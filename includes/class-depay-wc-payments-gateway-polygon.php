<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Polygon_Gateway extends DePay_WC_Payments_Gateway {

	const GATEWAY_ID = 'depay_wc_payments_polygon';

	public function __construct() {
		$this->id                 = static::GATEWAY_ID;
		$this->method_title       = 'Polygon (POS)';
		$this->method_description = 'Payments on the Polygon (POS) blockchain.';
		$this->supports           = [ 'products' ];
		$this->init_form_fields();
		$this->init_settings();
		$title                    = 'Polygon (POS)';
		$this->title              = $title;
		$description              = get_option( 'depay_wc_checkout_description_polygon' );
		$this->description        = empty($description) ? null : $description;
		$this->blockchain         = 'polygon';
	}
}
