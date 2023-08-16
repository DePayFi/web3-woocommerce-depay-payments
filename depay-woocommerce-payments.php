<?php
/**
 * Plugin Name: DePay Payments for WooCommerce
 * Plugin URI: https://depay.com/plugins/woocommerce
 * Description: Web3 Payments directly into your own wallet. Accept thousands of different tokens with on-the-fly conversion on multiple blockchains.
 * Author: DePay
 * Author URI: https://depay.com
 * Text Domain: depay-payments
 * Domain Path: /languages
 * WC requires at least: 6.2
 * WC tested up to: 7.6.1
 * Requires at least: 5.8
 * Requires PHP: 7.0
 * Version: 1.18.2
 *
 * @package DePay\Payments
 */

defined( 'ABSPATH' ) || exit;

define( 'DEPAY_WC_PLUGIN_FILE', __FILE__ );
define( 'DEPAY_WC_ABSPATH', __DIR__ . '/' );
define( 'DEPAY_MIN_WC_ADMIN_VERSION', '0.23.2' );
define( 'DEPAY_CURRENT_VERSION', '1.18.2' );

require_once DEPAY_WC_ABSPATH . '/vendor/autoload.php';

function depay_run_migration() {
	global $wpdb;

	$latestDbVersion = 3;
	$currentDbVersion = get_option('depay_wc_db_version');

	if ( !empty($currentDbVersion) && $currentDbVersion >= $latestDbVersion ) {
		return;
	}

	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	dbDelta("
		CREATE TABLE wp_wc_depay_logs (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			log LONGTEXT NOT NULL,
			created_at datetime NOT NULL DEFAULT '1000-01-01 00:00:00',
			PRIMARY KEY  (id)
		);
		CREATE TABLE wp_wc_depay_checkouts (
			id VARCHAR(36) NOT NULL,
			order_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
			accept LONGTEXT NOT NULL,
			created_at datetime NOT NULL DEFAULT '1000-01-01 00:00:00',
			PRIMARY KEY  (id)
		);
		CREATE TABLE wp_wc_depay_transactions (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			order_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
			checkout_id VARCHAR(36) NOT NULL,
			tracking_uuid TINYTEXT NOT NULL,
			blockchain TINYTEXT NOT NULL,
			transaction_id TINYTEXT NOT NULL,
			sender_id TINYTEXT NOT NULL,
			receiver_id TINYTEXT NOT NULL,
			token_id TINYTEXT NOT NULL,
			amount TINYTEXT NOT NULL,
			status TINYTEXT NOT NULL,
			failed_reason TINYTEXT NOT NULL,
			commitment_required TINYTEXT NOT NULL,
			confirmed_by TINYTEXT NOT NULL,
			confirmed_at datetime NOT NULL DEFAULT '1000-01-01 00:00:00',
			created_at datetime NOT NULL DEFAULT '1000-01-01 00:00:00',
			PRIMARY KEY  (id),
			KEY tracking_uuid_index (tracking_uuid(191))
		);
	");

	$exists = $wpdb->get_col("SHOW COLUMNS FROM wp_wc_depay_transactions LIKE 'confirmations_required'");
	if (! empty( $exists ) ) {
			$wpdb->query( 'ALTER TABLE wp_wc_depay_transactions DROP COLUMN confirmations_required' );
	}
	update_option( 'depay_wc_db_version', $latestDbVersion );
}

add_action('admin_init', 'depay_run_migration');

function depay_activated() {

	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) { 
		return;
	}

	depay_run_migration();
	
	try {
		wp_remote_post( 'https://integrate.depay.com/installs', 
			array( 
				'headers' => array( 'Content-Type' => 'application/json; charset=utf-8' ),
				'body' => json_encode( [
					'type' => 'woocommerce', 
					'host' => get_option( 'siteurl' ),
				] ),
				'method' => 'POST',
				'data_format' => 'body'
			) 
		);
	} catch (Exception $e) {
		error_log('Reporting install failed');
	}
}
register_activation_hook( __FILE__, 'depay_activated' );

function depay_deactivated() {

}
register_deactivation_hook( __FILE__, 'depay_deactivated' );

function depay_init() {

	require_once DEPAY_WC_ABSPATH . '/includes/class-depay-wc-payments.php';
	DePay_WC_Payments::init();
}
add_action( 'plugins_loaded', 'depay_init', 11 );

function depay_tasks_init() {
	
}
add_action( 'plugins_loaded', 'depay_tasks_init' );

// HPOS compatible
add_action( 'before_woocommerce_init', function() {
	if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
	}
});

// TODO: ACTIVATE ONCE FULLY SUPPORTED
// function depay_blocks_support() {
// 	if ( class_exists( 'Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType' ) ) {
// 		require_once DEPAY_WC_ABSPATH . 'includes/class-depay-wc-payments-blocks-support.php';
// 		add_action(
// 			'woocommerce_blocks_payment_method_type_registration',
// 			function( Automattic\WooCommerce\Blocks\Payments\PaymentMethodRegistry $payment_method_registry ) {
// 				$payment_method_registry->register( new DePay_WC_Payments_Blocks_Support );
// 			}
// 		);
// 	}
// }
// add_action( 'woocommerce_blocks_loaded', 'depay_blocks_support' );
