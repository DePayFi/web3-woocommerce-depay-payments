<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class DePay_WC_Payments_Settings {

  public function __construct() {

    add_action( 'rest_api_init', [ $this, 'register_settings' ] );
  }

  public static function register_settings() {

    register_setting(
      'depay_wc',
      'depay_wc_receiving_wallet_address',
      [
        'type' => 'string',
        'show_in_rest' => true,
        'default' => NULL
      ]
    );

    register_setting(
      'depay_wc',
      'depay_wc_accepted_payments',
      [
        'type' => 'string',
        'show_in_rest' => true,
        'default' => NULL
      ]
    );

    register_setting(
      'depay_wc',
      'depay_wc_tokens',
      [
        'type' => 'string',
        'show_in_rest' => true,
        'default' => NULL
      ]
    );

    register_setting(
      'depay_wc',
      'depay_wc_blockchains',
      [
        'type' => 'string',
        'show_in_rest' => true,
        'default' => NULL
      ]
    );
  }
}
