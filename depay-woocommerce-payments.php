<?php
/**
 * Plugin Name: DePay Payments for WooCommerce
 * Plugin URI: https://depay.com/plugins/woocommerce
 * Description: Accept Web3 payments directly into your own wallet. P2P cryptocurrency payments on multiple blockchains with on-the-fly token conversion.
 * Author: DePay
 * Author URI: https://depay.com
 * Text Domain: depay-payments
 * Domain Path: /languages
 * WC requires at least: 6.2
 * WC tested up to: 6.8.0
 * Requires at least: 5.8
 * Requires PHP: 7.0
 * Version: 0.0.9
 *
 * @package DePay\Payments
 */

defined( 'ABSPATH' ) || exit;

define( 'DEPAY_WC_PLUGIN_FILE', __FILE__ );
define( 'DEPAY_WC_ABSPATH', __DIR__ . '/' );
define( 'DEPAY_MIN_WC_ADMIN_VERSION', '0.23.2' );

// require_once __DIR__ . '/vendor/autoload_packages.php';
// require_once __DIR__ . '/includes/class-depay-payments-features.php';

function depay_activated() {
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return;
	}
}
register_activation_hook( __FILE__, 'depay_activated' );

function depay_deactivated() {
	require_once DEPAY_WC_ABSPATH . '/includes/class-depay-payments.php';
	// DePay_Payments::remove_woo_admin_notes();
}
register_deactivation_hook( __FILE__, 'depay_deactivated' );

function depay_init() {
	require_once DEPAY_WC_ABSPATH . '/includes/class-depay-payments.php';
	DePay_Payments::init();
}
add_action( 'plugins_loaded', 'depay_init', 11 );

function depay_tasks_init() {
}
add_action( 'plugins_loaded', 'depay_tasks_init' );
