<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Arbitrum_Gateway extends DePay_WC_Payments_Gateway {

	const GATEWAY_ID = 'depay_wc_payments_arbitrum';

	public function __construct() {
		$this->id                 = static::GATEWAY_ID;
		$this->method_title       = 'Arbitrum';
		$this->method_description = 'Payments on the Arbitrum blockchain.';
		$this->supports           = [ 'products' ];
		$this->init_form_fields();
		$this->init_settings();
		$title                    = 'Arbitrum';
		$this->title              = $title;
		$description              = get_option( 'depay_wc_checkout_description_arbitrum' );
		$this->description        = empty($description) ? null : $description;
		$this->blockchain         = 'arbitrum';
	}
}
