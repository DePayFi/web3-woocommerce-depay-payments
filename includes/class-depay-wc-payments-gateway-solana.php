<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Solana_Gateway extends DePay_WC_Payments_Gateway {

	const GATEWAY_ID = 'depay_wc_payments_solana';

	public function __construct() {
		$this->id                 = static::GATEWAY_ID;
		$this->method_title       = 'Solana';
		$this->method_description = 'Payments on the Solana blockchain.';
		$this->supports           = [ 'products' ];
		$this->init_form_fields();
		$this->init_settings();
		$title                    = 'Solana';
		$this->title              = $title;
		$description              = get_option( 'depay_wc_checkout_description_solana' );
		$this->description        = empty($description) ? null : $description;
		$this->blockchain         = 'solana';
	}
}
