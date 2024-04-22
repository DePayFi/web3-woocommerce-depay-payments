<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Avalanche_Gateway extends DePay_WC_Payments_Gateway {

	const GATEWAY_ID = 'depay_wc_payments_avalanche';

	public function __construct() {
		$this->id                 = static::GATEWAY_ID;
		$this->method_title       = 'Avalanche';
		$this->method_description = 'Payments on the Avalanche blockchain.';
		$this->supports           = [ 'products' ];
		$this->init_form_fields();
		$this->init_settings();
		$title                    = 'Avalanche';
		$this->title              = $title;
		$description              = get_option( 'depay_wc_checkout_description_avalanche' );
		$this->description        = empty($description) ? null : $description;
		$this->blockchain         = 'avalanche';
	}
}
