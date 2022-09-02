<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

use phpseclib3\Crypt\RSA;
use phpseclib3\Crypt\PublicKeyLoader;

class DePay_WC_Payments_Rest {

  private static $key = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtqsu0wy94cpz90W4pGsJ\nSf0bfvmsq3su+R1J4AoAYz0XoAu2MXJZM8vrQvG3op7OgB3zze8pj4joaoPU2piT\ndH7kcF4Mde6QG4qKEL3VE+J8CL3qK2dUY0Umu20x/O9O792tlv8+Q/qAVv8yPfdM\nn5Je9Wc7VI5XeIBKP2AzsCkrXuzQlR48Ac5LpViNSSLu0mz5NTBoHkW2sz1sNWc6\nUpYISJkiKTvYc8Bo4p5xD6+ZmlL4hj1Ad/+26SjYcisX2Ut4QD7YKRBP2SbItVkI\nqp9mp6c6MCKNmEUkosxAr0KVfOcrk6/fcc4tI8g+KYZ32G11Ri8Xo4fgHH06DLYP\n3QIDAQAB\n-----END PUBLIC KEY-----\n";

  public function register_routes() {
    register_rest_route( 'depay/wc', '/checkouts/(?P<id>\d+)', [ 'methods' => 'GET', 'callback' => [ $this, 'get_checkout_accept' ] ]);
    register_rest_route( 'depay/wc', '/checkouts/(?P<id>\d+)/track', [ 'methods' => 'POST', 'callback' => [ $this, 'track_payment' ] ]);
    register_rest_route( 'depay/wc', '/validate', [ 'methods' => 'POST', 'callback' => [ $this, 'validate_payment' ] ]);
    register_rest_route( 'depay/wc', '/transactions', [ 'methods' => 'GET', 'callback' => [ $this, 'fetch_transactions' ], 'permission_callback' => array( $this, 'get_transactions_permission' ) ]);
  }

  public function get_checkout_accept($request) {
    global $wpdb;
    $id = $request->get_param('id');
    $accept = $wpdb->get_var("SELECT accept FROM wp_wc_depay_checkouts WHERE id = $id LIMIT 1");
    return rest_ensure_response($accept);
  }

  public function track_payment($request) {
    global $wpdb;
    $id = $request->get_param('id');
    $accept = $wpdb->get_var("SELECT accept FROM wp_wc_depay_checkouts WHERE id = $id LIMIT 1");
    $order_id = $wpdb->get_var("SELECT order_id FROM wp_wc_depay_checkouts WHERE id = $id LIMIT 1");
    $order = wc_get_order($order_id);
    $accepted_payment = NULL;
    foreach(json_decode($accept) as $accepted) {
      if(
        $accepted->blockchain == $request->get_param('blockchain') &&
        $accepted->token == $request->get_param('to_token')
      ){
        $accepted_payment = $accepted;
      }
    }

    $get = wp_remote_get( sprintf('https://public.depay.com/tokens/decimals/%s/%s', $accepted_payment->blockchain, $accepted_payment->token ));
    $decimals = intval($get['body']);

    $fee_amount = bcmul($accepted_payment->amount, '0.015', $decimals);
    $amount = bcsub($accepted_payment->amount, $fee_amount, $decimals);
    $tracking_uuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));

    $total = $order->get_total();
    $currency = $order->get_currency();
    if($currency == 'USD') {
      $total_in_usd = $total;
    } else {
      $get = wp_remote_get( sprintf('https://public.depay.com/currencies/%s', $currency ));
      $rate = $get['body'];
      $total_in_usd = bcdiv($total, $rate, 3);
    }
    
    if($total_in_usd < 1000) {
      $required_confirmations = 1;
    } else {
      $required_confirmations = 12;
    }

    $transaction_id = $request->get_param('transaction');
    $existing_transaction_id = $wpdb->get_var("SELECT id FROM wp_wc_depay_transactions WHERE transaction_id = '$transaction_id' AND blockchain = '$accepted_payment->blockchain' ORDER BY id DESC LIMIT 1");

    if(empty($existing_transaction_id)) {
      $wpdb->insert('wp_wc_depay_transactions', array(
        'order_id' => $order_id,
        'checkout_id' => $id,
        'tracking_uuid' => $tracking_uuid,
        'blockchain' => $accepted_payment->blockchain,
        'transaction_id' => $transaction_id,
        'sender_id' => $request->get_param('sender'),
        'receiver_id' => $accepted_payment->receiver,
        'token_id' => $accepted_payment->token,
        'amount' => $amount,
        'status' => 'VALIDATING',
        'confirmations_required' => $required_confirmations,
        'created_at' => current_time( 'mysql' )
      ));
    }

    $post = wp_remote_post("https://public.depay.com/payments",
      array(
        'headers' => array('Content-Type' => 'application/json; charset=utf-8'),
        'body' => json_encode([
          'blockchain' => $accepted_payment->blockchain,
          'receiver' => $accepted_payment->receiver,
          'token' => $accepted_payment->token,
          'amount' => $amount,
          'confirmations' => $required_confirmations,
          'transaction' => $transaction_id,
          'sender' => $request->get_param('sender'),
          'nonce' => $request->get_param('nonce'),
          'after_block' => $request->get_param('after_block'),
          'uuid' => $tracking_uuid,
          'callback' => get_site_url(null, 'index.php?rest_route=/depay/wc/validate'),
          'forward_to' => $order->get_checkout_order_received_url(),
          'forward_on_failure' => false,
          'fee_amount' => $fee_amount,
          'fee_receiver' => '0x9Db58B260EfAa2d6a94bEb7E219d073dF51cc7Bb'
        ]),
        'method' => 'POST',
        'data_format' => 'body'
      )
    );

    $response = rest_ensure_response("{}");
    if(!is_wp_error($post) && (wp_remote_retrieve_response_code($post) == 200 || wp_remote_retrieve_response_code($post) == 201)) {
      $response->set_status(200);
    } else {
      $response->set_status(500);
    }
    
    return $response;
  }

  public function validate_payment($request) {
    global $wpdb;
    $response = new WP_REST_Response();

    $signature = $request->get_header('x-signature');
    $signature = str_replace("_","/",  $signature);
    $signature = str_replace("-", "+",  $signature);
    $key = PublicKeyLoader::load(self::$key)->withHash('sha256')->withPadding(RSA::SIGNATURE_PSS)->withMGFHash('sha256')->withSaltLength(64);
    if(!$key->verify($request->get_body(), base64_decode($signature))){
      $response->set_status(422);
      return $response;
    }

    $tracking_uuid = $request->get_param('uuid');
    $existing_transaction_id = $wpdb->get_var("SELECT id FROM wp_wc_depay_transactions WHERE tracking_uuid = '$tracking_uuid' ORDER BY id DESC LIMIT 1");

    if(empty($existing_transaction_id)){
      $response->set_status(404);
      return $response;
    }

    $order_id = $wpdb->get_var("SELECT order_id FROM wp_wc_depay_transactions WHERE tracking_uuid = '$tracking_uuid' ORDER BY id DESC LIMIT 1");
    $expected_receiver_id = $wpdb->get_var("SELECT receiver_id FROM wp_wc_depay_transactions WHERE tracking_uuid = '$tracking_uuid' ORDER BY id DESC LIMIT 1");
    $expected_amount = $wpdb->get_var("SELECT amount FROM wp_wc_depay_transactions WHERE tracking_uuid = '$tracking_uuid' ORDER BY id DESC LIMIT 1");
    $expected_blockchain = $wpdb->get_var("SELECT blockchain FROM wp_wc_depay_transactions WHERE tracking_uuid = '$tracking_uuid' ORDER BY id DESC LIMIT 1");
    $expected_transaction = $wpdb->get_var("SELECT transaction_id FROM wp_wc_depay_transactions WHERE tracking_uuid = '$tracking_uuid' ORDER BY id DESC LIMIT 1");
    $order = wc_get_order($order_id);
    $status = $request->get_param('status');
    $decimals = $request->get_param('decimals');
    $amount = $request->get_param('amount');
    $transaction = $request->get_param('transaction');

    if($expected_transaction != $transaction) {
      $wpdb->query(
        $wpdb->prepare(
          "UPDATE wp_wc_depay_transactions SET transaction_id = %s WHERE tracking_uuid = '$tracking_uuid'",
          $transaction
        )
      );
    }

    if(
      $status == 'success' &&
      $request->get_param('blockchain') == $expected_blockchain &&
      strtolower($request->get_param('receiver')) == strtolower($expected_receiver_id) &&
      (bccomp($expected_amount, $amount, $decimals) == 0 || bccomp($expected_amount, $amount, $decimals) == -0)
    ) {
      $wpdb->query(
        $wpdb->prepare(
          "UPDATE wp_wc_depay_transactions SET status = %s, confirmed_at = %s, confirmed_by = %s, failed_reason = NULL WHERE tracking_uuid = '$tracking_uuid'",
          'SUCCESS',
          current_time( 'mysql' ),
          'API'
        )
      );
      $order->payment_complete();
    } else {
      $failed_reason = $request->get_param('failed_reason');
      if(empty($failed_reason)){ $failed_reason = "MISMATCH"; }
      $wpdb->query(
        $wpdb->prepare(
          "UPDATE wp_wc_depay_transactions SET failed_reason = %s, status = %s, confirmed_by = %s WHERE tracking_uuid = '$tracking_uuid'",
          $failed_reason,
          'FAILED',
          'API'
        )
      );
    }

    $response->set_status(200);
    return $response;
  }

  public function get_transactions_permission($request) {

    if ( !current_user_can( 'manage_woocommerce' ) ) {
      return new WP_Error( 'depay_woocommerce_not_a_wc_admin', "Not a WooCommerce admin!", array( 'status' => 403 ) );
    }

    return true;
  }

  public function fetch_transactions($request) {
    global $wpdb;

    $limit = $request->get_param('limit');
    if(empty($limit)) { $limit = 25; }

    $page = $request->get_param('page');
    if(empty($page)) { $page = 1; }

    $offset = $limit * ($page-1);

    $orderby = $request->get_param('orderby');
    if(empty($orderby)) { $orderby = 'created_at'; }
    
    $order = $request->get_param('order');
    if(empty($orderby)) { $order = 'desc'; }

    $transactions = $wpdb->get_results(
      $wpdb->prepare(
        "SELECT * FROM wp_wc_depay_transactions ORDER BY $orderby $order LIMIT $limit OFFSET $offset"
      )
    );

    $total = $wpdb->get_var("SELECT COUNT(*) FROM wp_wc_depay_transactions AS total_count");

    return rest_ensure_response([
      "total" => $total,
      "transactions" => $transactions
    ]);
  }
}