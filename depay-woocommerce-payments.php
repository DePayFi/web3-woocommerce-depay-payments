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
 * Version: 1.2.1
 *
 * @package DePay\Payments
 */

defined( 'ABSPATH' ) || exit;

define( 'DEPAY_WC_PLUGIN_FILE', __FILE__ );
define( 'DEPAY_WC_ABSPATH', __DIR__ . '/' );
define( 'DEPAY_MIN_WC_ADMIN_VERSION', '0.23.2' );
define( 'DEPAY_CURRENT_VERSION', '1.2.1' );

require_once DEPAY_WC_ABSPATH . '/vendor/autoload.php';

function depay_activated() {
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) { return; }
  require_once ABSPATH . 'wp-admin/includes/upgrade.php';
  dbDelta("
    CREATE TABLE wp_wc_depay_checkouts (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      order_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
      accept LONGTEXT NOT NULL,
      created_at datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
      PRIMARY KEY (id)
    );
    CREATE TABLE wp_wc_depay_transactions (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      order_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
      checkout_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
      tracking_uuid TINYTEXT NOT NULL,
      blockchain TINYTEXT NOT NULL,
      transaction_id TINYTEXT NOT NULL,
      sender_id TINYTEXT NOT NULL,
      receiver_id TINYTEXT NOT NULL,
      token_id TINYTEXT NOT NULL,
      amount TINYTEXT NOT NULL,
      status TINYTEXT NOT NULL,
      failed_reason TINYTEXT NOT NULL,
      confirmations_required BIGINT UNSIGNED NOT NULL DEFAULT 0,
      confirmed_by TINYTEXT NOT NULL,
      confirmed_at datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
      created_at datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
      PRIMARY KEY (id)
    );
    ALTER TABLE wp_wc_depay_transactions ADD INDEX tracking_uuid_index (tracking_uuid);
  ");
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
