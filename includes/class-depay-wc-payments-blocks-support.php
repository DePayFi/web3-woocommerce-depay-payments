<?php
use Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class DePay_WC_Payments_Blocks_Support extends AbstractPaymentMethodType {

	private $gateway;

	protected $name = DePay_WC_Payments_Gateway::GATEWAY_ID;

	public function initialize() {
		error_log('BLOCKS initialize');
		$this->gateway = new DePay_WC_Payments_Gateway();
		$this->settings = get_option( 'woocommerce_dummy_settings', [] );
	}

	public function is_active() {
		return $this->gateway->is_available();
	}

	public function get_payment_method_script_handles() {

		wp_register_script(
			'DEPAY_WC_BLOCKS_INTEGRATION',
			plugins_url( 'dist/block.js', DEPAY_WC_PLUGIN_FILE ),
			array( 'wc-blocks-registry' ),
			DEPAY_CURRENT_VERSION,
			true
		);

		return [ 'DEPAY_WC_BLOCKS_INTEGRATION' ];
	}

	public function get_payment_method_data() {
		return [
			'title'       => 'DePay',
			'description' => 'Pay WEB3',
			'supports'    => array_filter( $this->gateway->supports, [ $this->gateway, 'supports' ] )
		];
	}
}
