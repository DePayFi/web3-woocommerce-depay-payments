<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class DePay_WC_Payments_Gateway extends WC_Payment_Gateway {

  public function __construct() {
    $title = "DePay";
    $this->id                 = 'depay_wc_payments';
    $this->icon               = '';
    $this->method_title       = 'DePay';
    $this->method_description = 'Web3 Payments directly into your wallet. Accept any token with on-the-fly conversion.';
    $this->title              = $this->get_title();
  }

  public function get_title() {
    $title = "DePay ";
    if(empty(get_option('depay_wc_blockchains'))) { return $title; }
    $blockchains = json_decode(get_option('depay_wc_blockchains'));
    foreach (array_reverse($blockchains) as $blockchain) {
      $title = $title."<img style='width: 28px; height: 28px;' src='".plugin_dir_url( __FILE__ )."images/blockchains/".$blockchain.".svg'/>";
    }
    return $title;
  }

  public function process_payment( $order_id ) {
    global $wpdb;
    $order = wc_get_order( $order_id );

    if ( $order->get_total() > 0 ) {
      
      $accept = $this->get_accept($order);
      $wpdb->insert('wp_wc_depay_checkouts', array(
        'order_id' => $order_id,
        'accept' => json_encode($accept),
        'created_at' => current_time( 'mysql' )
      ));
      $checkout_id = $wpdb->get_var("SELECT id FROM wp_wc_depay_checkouts WHERE order_id = $order_id ORDER BY id DESC LIMIT 1");

      return([
        'result'         => 'success',
        'redirect'       => '#wc-depay-checkout-'.$checkout_id.'-'.time()
      ]);
    } else {
      $order->payment_complete();
    }
  }
  
  public function get_accept( $order ) {
    $total = $order->get_total();
    $currency = $order->get_currency();
    if($currency == 'USD') {
      $total_in_usd = $total;
    } else {
      $get = wp_remote_get( sprintf('https://public.depay.com/currencies/%s', $currency ));
      $rate = $get['body'];
      $total_in_usd = bcdiv($total, $rate, 3);
    }
    $accept = [];
    foreach (json_decode(get_option('depay_wc_accepted_payments')) as $accepted_payment) {
      $get = wp_remote_get( sprintf('https://public.depay.com/tokens/prices/%s/%s', $accepted_payment->blockchain, $accepted_payment->token ));
      $rate = $get['body'];
      $get = wp_remote_get( sprintf('https://public.depay.com/tokens/decimals/%s/%s', $accepted_payment->blockchain, $accepted_payment->token ));
      $decimals = intval($get['body']);
      if(!empty($rate) && !empty($decimals)){
        array_push($accept, [
          'blockchain' => $accepted_payment->blockchain,
          'token' => $accepted_payment->token,
          'amount' => bcmul($total_in_usd, $rate, $decimals),
          'receiver' => $accepted_payment->receiver
        ]);      
      }
    } 
    
    if(empty($accept)) { throw new Exception( 'No valid payment route found!' ); }

    return $accept;
  }

  public function admin_options() {
    wp_redirect("/wp-admin/admin.php?page=wc-admin&path=%2Fdepay%2Fsettings");
  }
}
