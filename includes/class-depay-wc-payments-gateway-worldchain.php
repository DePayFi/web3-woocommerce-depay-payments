<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Worldchain_Gateway extends DePay_WC_Payments_Gateway {

	const GATEWAY_ID = 'depay_wc_payments_worldchain';

	public function __construct() {
		$this->id                 = static::GATEWAY_ID;
		$this->method_title       = 'World Chain';
		$this->method_description = 'Payments on World Chain.';
		$this->supports           = [ 'products' ];
		$this->init_form_fields();
		$this->init_settings();
		$title                    = 'World Chain';
		$this->title              = $title;
		$description              = get_option( 'depay_wc_checkout_description_worldchain' );
		$this->description        = empty($description) ? null : $description;
		$this->blockchain         = 'worldchain';
	}
}
