<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class DePay_WC_Payments_Rest {

  public function register_routes() {
    register_rest_route( 'depay/wc', '/checkouts/(?P<id>\d+)', [ 'methods' => 'GET', 'callback' => [ $this, 'get_checkout_accept' ] ]);
    register_rest_route( 'depay/wc', '/checkouts/(?P<id>\d+)/track', [ 'methods' => 'POST', 'callback' => [ $this, 'track_payment' ] ]);
    register_rest_route( 'depay/wc', '/validate', [ 'methods' => 'POST', 'callback' => [ $this, 'validate_payment' ] ]);
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

    $required_confirmations = 0;

    $post = wp_remote_post("https://public.depay.com/payments", [
      "blockchain" => $accepted_payment->blockchain,
      "receiver" => $accepted_payment->receiver,
      "token" => $accepted_payment->token,
      "amount" => $amount,
      "confirmations" => $required_confirmations,
      "transaction" => $request->get_param('transaction'),
      "sender" => $request->get_param('sender'),
      "nonce" => $request->get_param('nonce'),
      "after_block" => $request->get_param('after_block'),
      "uuid" => $tracking_uuid,
      "callback" => get_site_url(null, 'index.php?rest_route=/depay/wc/validate'),
      "forward_to" => $order->get_checkout_order_received_url(),
      "forward_on_failure" => false,
      "fee_amount" => $fee_amount,
      "fee_receiver" => '0x9Db58B260EfAa2d6a94bEb7E219d073dF51cc7Bb',
    ]);

    $response = new WP_REST_Response();
    if(!is_wp_error($post) && (wp_remote_retrieve_response_code($post) == 200 || wp_remote_retrieve_response_code($post) == 201)) {
      $wpdb->insert('wp_wc_depay_transactions', array(
        'order_id' => $order_id,
        'checkout_id' => $id,
        'tracking_uuid' => $tracking_uuid,
        'blockchain' => $accepted_payment->blockchain,
        'transaction_id' => $request->get_param('transaction'),
        'sender_id' => $request->get_param('sender'),
        'receiver_id' => $accepted_payment->receiver,
        'token_id' => $accepted_payment->token,
        'amount' => $amount,
        'status' => 'PROCESSING',
        'created_at' => current_time( 'mysql' )
      ));
      $response->set_status(200);
    } else {
      $response->set_status(500);
    }
    
    return rest_ensure_response($response);
  }

  public function validate_payment($request) {

  }
}
