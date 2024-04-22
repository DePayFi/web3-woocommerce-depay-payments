<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Base_Gateway extends DePay_WC_Payments_Gateway {

	const GATEWAY_ID = 'depay_wc_payments_base';

	public function __construct() {
		$this->id                 = static::GATEWAY_ID;
		$this->method_title       = 'Base';
		$this->method_description = 'Payments on the Base blockchain.';
		$this->supports           = [ 'products' ];
		$this->init_form_fields();
		$this->init_settings();
		$title                    = 'Base';
		$this->title              = $title;
		$description              = get_option( 'depay_wc_checkout_description_base' );
		$this->description        = empty($description) ? null : $description;
		$this->blockchain         = 'base';
	}
}
