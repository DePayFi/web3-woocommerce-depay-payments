<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType;
use Automattic\WooCommerce\Blocks\Payments\PaymentMethodTypeInterface;

final class DePay_WC_Payments_Block extends AbstractPaymentMethodType {

	private $gateway;

	public $name = DePay_WC_Payments_Gateway::GATEWAY_ID;

	public function initialize() {
		$this->gateway = new DePay_WC_Payments_Gateway();
		$this->settings = array(
			'blockchains' => get_option( 'depay_wc_blockchains', '[]' )
		);
	}

	public function is_active() {
		return $this->gateway->is_available();
	}

	public function get_payment_method_script_handles() {

		wp_register_script(
			'DEPAY_WC_BLOCKS_INTEGRATION',
			plugins_url( 'dist/block.js', DEPAY_WC_PLUGIN_FILE ),
			array( 'wc-blocks-registry', 'wc-settings', 'wp-element' ),
			DEPAY_CURRENT_VERSION,
			true
		);

		return [ 'DEPAY_WC_BLOCKS_INTEGRATION' ];
	}

	public function get_payment_method_data() {
		return array(
			'id'          => $this->gateway->id,
			'title'       => $this->gateway->title,
			'description' => $this->gateway->description,
			'enabled'     => $this->gateway->is_available(),
			'blockchains' => json_decode( get_option( 'depay_wc_blockchains', '[]' ) ),
			'pluginUrl' 	=> plugin_dir_url( __FILE__ ),
		);
	}
}
