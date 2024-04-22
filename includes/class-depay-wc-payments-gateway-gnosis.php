<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Gnosis_Gateway extends DePay_WC_Payments_Gateway {

	const GATEWAY_ID = 'depay_wc_payments_gnosis';

	public function __construct() {
		$this->id                 = static::GATEWAY_ID;
		$this->method_title       = 'Gnosis';
		$this->method_description = 'Payments on the Gnosis blockchain.';
		$this->supports           = [ 'products' ];
		$this->init_form_fields();
		$this->init_settings();
		$title                    = 'Gnosis';
		$this->title              = $title;
		$description              = get_option( 'depay_wc_checkout_description_gnosis' );
		$this->description        = empty($description) ? null : $description;
		$this->blockchain         = 'gnosis';
	}
}
