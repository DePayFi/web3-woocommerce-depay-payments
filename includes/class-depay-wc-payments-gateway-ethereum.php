<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Ethereum_Gateway extends DePay_WC_Payments_Gateway {

	const GATEWAY_ID = 'depay_wc_payments_ethereum';

	public function __construct() {
		$this->id                 = static::GATEWAY_ID;
		$this->method_title       = 'Ethereum';
		$this->method_description = 'Payments on the Ethereum blockchain.';
		$this->supports           = [ 'products' ];
		$this->init_form_fields();
		$this->init_settings();
		$title                    = 'Ethereum';
		$this->title              = $title;
		$description              = get_option( 'depay_wc_checkout_description_ethereum' );
		$this->description        = empty($description) ? null : $description;
		$this->blockchain         = 'ethereum';
	}
}
