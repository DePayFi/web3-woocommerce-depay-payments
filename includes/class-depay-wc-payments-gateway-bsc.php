<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Bsc_Gateway extends DePay_WC_Payments_Gateway {

	const GATEWAY_ID = 'depay_wc_payments_bsc';

	public function __construct() {
		$this->id                 = static::GATEWAY_ID;
		$this->method_title       = 'BNB Smart Chain';
		$this->method_description = 'Payments on the BNB Smart Chain.';
		$this->supports           = [ 'products' ];
		$this->init_form_fields();
		$this->init_settings();
		$title                    = 'BNB Smart Chain';
		$this->title              = $title;
		$description              = get_option( 'depay_wc_checkout_description_bsc' );
		$this->description        = empty($description) ? null : $description;
		$this->blockchain         = 'bsc';
	}
}
