<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class DePay_Payments {

	private static $settings;
	
	public static function init() {
		define( 'DEPAY_VERSION_NUMBER', self::get_plugin_headers()['Version'] );

		include_once DEPAY_WC_ABSPATH . 'includes/class-depay-wc-payments-gateway.php';
		include_once DEPAY_WC_ABSPATH . 'includes/class-depay-wc-payments-settings.php';
		include_once DEPAY_WC_ABSPATH . 'includes/class-depay-wc-payments-admin.php';

		self::setup_install();
		self::setup_settings();
		self::setup_admin();
		self::setup_gateway();
		self::setup_task();
	}

	private static $plugin_headers = null;
	public static function get_plugin_headers() {
		if ( null === self::$plugin_headers ) {
			self::$plugin_headers = get_file_data(
				DEPAY_WC_PLUGIN_FILE,
				[
					'WCRequires' => 'WC requires at least',
					'RequiresWP' => 'Requires at least',
					'Version'    => 'Version',
				]
			);
		}
		return self::$plugin_headers;
	}

	public static function setup_install() {
		register_activation_hook( DEPAY_WC_ABSPATH, [ 'DePay_Payments', 'install' ] );
	}

	public static function install() {
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
			  confirmed_by TINYTEXT NOT NULL,
			  confirmed_at datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
			  created_at datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
			  PRIMARY KEY (id)
			);
			ALTER TABLE wp_wc_depay_transactions ADD INDEX tracking_uuid_index (tracking_uuid);
		");
	}

	public static function setup_settings() {
		self::$settings = new DePay_WC_Payments_Settings();
	}

	public static function setup_admin() {
		if ( !is_admin() || !current_user_can( 'manage_woocommerce' ) ) { return; }
		new DePay_WC_Payments_Admin(self::$settings);
	}

	public static function setup_gateway() {
		if(
   		!empty(get_option('depay_wc_receiving_wallet_address')) &&
   		!empty(get_option('depay_wc_accepted_payments')) &&
   		!empty(get_option('depay_wc_tokens'))
    ) {
			add_filter('woocommerce_payment_gateways', [ 'DePay_Payments', 'add_gateway' ] );
		}
	}

	public static function add_gateway($gateways) {
    $gateways[] = 'DePay_WC_Payments_Gateway';
    return $gateways;
  }

  public static function setup_task() {
		if(
   		empty(get_option('depay_wc_receiving_wallet_address')) &&
   		empty(get_option('depay_wc_accepted_payments')) &&
   		empty(get_option('depay_wc_tokens'))
    ) {
    	add_filter( 'woocommerce_get_registered_extended_tasks', [ 'DePay_Payments', 'add_extended_task' ], 10, 1 );
		}
	}

	public static function add_extended_task($registered_tasks_list_items) {
    $new_task_name = 'setup_depay_wc_payments';
    if ( ! in_array( $new_task_name, $registered_tasks_list_items, true ) ) {
      array_push( $registered_tasks_list_items, $new_task_name );
    }
    return $registered_tasks_list_items;
	}
}
