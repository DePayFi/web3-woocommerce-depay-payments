<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Settings {

	public function __construct() {

		add_action( 'rest_api_init', [ $this, 'register_settings' ] );
	}

	public static function register_settings() {

		register_setting(
			'depay_wc',
			'depay_wc_receiving_wallet_address',
			[
				'type' => 'string',
				'show_in_rest' => true,
				'default' => null
			]
		);

		register_setting(
			'depay_wc',
			'depay_wc_accepted_payments',
			[
				'type' => 'string',
				'show_in_rest' => true,
				'default' => null
			]
		);

		register_setting(
			'depay_wc',
			'depay_wc_tokens',
			[
				'type' => 'string',
				'show_in_rest' => true,
				'default' => null
			]
		);

		register_setting(
			'depay_wc',
			'depay_wc_blockchains',
			[
				'type' => 'string',
				'show_in_rest' => true,
				'default' => null
			]
		);

		register_setting(
			'depay_wc',
			'depay_wc_checkout_title',
			[
				'type' => 'string',
				'show_in_rest' => true,
				'default' => 'DePay'
			]
		);

		register_setting(
			'depay_wc',
			'depay_wc_gateway_type',
			[
				'type' => 'string',
				'show_in_rest' => true,
				'default' => 'multichain'
			]
		);

		register_setting(
			'depay_wc',
			'depay_wc_checkout_description',
			[
				'type' => 'string',
				'show_in_rest' => true,
				'default' => null
			]
		);

		register_setting(
			'depay_wc',
			'depay_wc_token_for_denomination',
			[
				'type' => 'string',
				'show_in_rest' => true,
				'default' => null
			]
		);

		register_setting(
			'depay_wc',
			'depay_wc_displayed_currency',
			[
				'type' => 'string',
				'show_in_rest' => true,
				'default' => false
			]
		);

		register_setting(
			'depay_wc',
			'depay_wc_api_key',
			[
				'type' => 'string',
				'show_in_rest' => true,
				'default' => ''
			]
		);
	}
}
