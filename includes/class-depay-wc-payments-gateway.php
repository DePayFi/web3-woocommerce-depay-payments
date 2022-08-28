<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class DePay_WC_Payments_Gateway extends WC_Payment_Gateway {

  public function __construct() {
    $title = "DePay";
    $this->id                 = 'depay_wc_payments';
    $this->icon               = '';
    $this->method_title       = 'DePay';
    $this->method_description = 'Payments directly into your wallet. Accept any token with on-the-fly conversion.';
    $this->title              = $this->get_title();
  }

  public function get_title() {
    $title = "DePay ";
    if(empty(get_option('depay_wc_blockchains'))) { return $title; }
    $blockchains = json_decode(get_option('depay_wc_blockchains'));
    foreach (array_reverse($blockchains) as $blockchain) {
      $title = $title."<img src='".plugin_dir_url( __FILE__ )."images/blockchains/".$blockchain.".svg'/>";
    }
    return $title;
  }
}
