<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class DePay_WC_Payments {

	private static $settings;
	
	public static function init() {
		define( 'DEPAY_VERSION_NUMBER', self::get_plugin_headers()['Version'] );

		include_once DEPAY_WC_ABSPATH . 'includes/class-depay-wc-payments-gateway.php';
		include_once DEPAY_WC_ABSPATH . 'includes/class-depay-wc-payments-settings.php';
		include_once DEPAY_WC_ABSPATH . 'includes/class-depay-wc-payments-admin.php';
		include_once DEPAY_WC_ABSPATH . 'includes/class-depay-wc-payments-rest.php';

		self::setup_settings();
		self::setup_admin();
		self::setup_gateway();
		self::setup_task();
		self::setup_checkout();
		self::setup_rest_api();
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
			add_filter('woocommerce_payment_gateways', [ 'DePay_WC_Payments', 'add_gateway' ] );
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
    	add_filter( 'woocommerce_get_registered_extended_tasks', [ 'DePay_WC_Payments', 'add_extended_task' ], 10, 1 );
		}
	}

	public static function add_extended_task($registered_tasks_list_items) {
    $new_task_name = 'setup_depay_wc_payments';
    if ( ! in_array( $new_task_name, $registered_tasks_list_items, true ) ) {
      array_push( $registered_tasks_list_items, $new_task_name );
    }
    return $registered_tasks_list_items;
	}
  
  public static function setup_checkout() {
  	add_action( 'wp_enqueue_scripts', [ 'DePay_WC_Payments', 'setup_checkout_scripts' ] );
  }
  
  public static function setup_checkout_scripts() {
  	wp_register_script('DEPAY_WC_WIDGETS', plugins_url( 'dist/widgets.bundle.js', DEPAY_WC_PLUGIN_FILE ), array(), '0.0.9', true);
  	wp_enqueue_script('DEPAY_WC_WIDGETS');
  	wp_register_script('DEPAY_WC_CHECKOUT', plugins_url( 'dist/checkout.js', DEPAY_WC_PLUGIN_FILE ), array('wp-api-request', 'jquery'), '0.0.9', true);
  	wp_enqueue_script('DEPAY_WC_CHECKOUT');
  }

  public static function setup_rest_api() {
  	add_action( 'rest_api_init', [ 'DePay_WC_Payments', 'init_rest_api' ] );
  }

  public static function init_rest_api() {
		$controller = new DePay_WC_Payments_Rest();
		$controller->register_routes();
  }
}
