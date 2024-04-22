<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Fantom_Gateway extends DePay_WC_Payments_Gateway {

	const GATEWAY_ID = 'depay_wc_payments_fantom';

	public function __construct() {
		$this->id                 = static::GATEWAY_ID;
		$this->method_title       = 'Fantom';
		$this->method_description = 'Payments on the Fantom blockchain.';
		$this->supports           = [ 'products' ];
		$this->init_form_fields();
		$this->init_settings();
		$title                    = 'Fantom';
		$this->title              = $title;
		$description              = get_option( 'depay_wc_checkout_description_fantom' );
		$this->description        = empty($description) ? null : $description;
		$this->blockchain         = 'fantom';
	}
}
