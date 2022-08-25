<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class DePay_Payments {
	
	public static function init() {
		define( 'DEPAY_VERSION_NUMBER', self::get_plugin_headers()['Version'] );
		self::setup_admin();
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

	public static function setup_admin() {
		if ( !is_admin() || !current_user_can( 'manage_woocommerce' ) ) { return; }
		include_once DEPAY_WC_ABSPATH . 'includes/admin/class-depay-payments-admin.php';
		new DePay_Payments_Admin();

		// Use tracks loader only in admin screens because it relies on WC_Tracks loaded by WC_Admin.
		// include_once DEPAY_WC_ABSPATH . 'includes/admin/tracks/tracks-loader.php';

		// include_once __DIR__ . '/admin/class-depay-payments-admin-sections-overwrite.php';
		// new WC_Payments_Admin_Sections_Overwrite( self::get_account_service() );
		// new WC_Payments_Status( self::get_wc_payments_http(), self::get_account_service() );
	}

}
