<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Optimism_Gateway extends DePay_WC_Payments_Gateway {

	const GATEWAY_ID = 'depay_wc_payments_optimism';

	public function __construct() {
		$this->id                 = static::GATEWAY_ID;
		$this->method_title       = 'Optimism';
		$this->method_description = 'Payments on the Optimism blockchain.';
		$this->supports           = [ 'products' ];
		$this->init_form_fields();
		$this->init_settings();
		$title                    = 'Optimism';
		$this->title              = $title;
		$description              = get_option( 'depay_wc_checkout_description_optimism' );
		$this->description        = empty($description) ? null : $description;
		$this->blockchain         = 'optimism';
	}
}
