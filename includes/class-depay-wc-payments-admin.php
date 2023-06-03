<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Admin {

	public function __construct( DePay_WC_Payments_Settings $settings ) {

		add_action( 'admin_menu', [ $this, 'add_menu' ] );
		add_action( 'admin_init', [ $settings, 'register_settings' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'scripts_and_styles' ] );
	}

	public function scripts_and_styles() {

		$extensions = get_loaded_extensions();
		
		wp_register_script('DEPAY_WC_ETHERS', plugins_url( 'dist/ethers-5.7.umd.min.js', DEPAY_WC_PLUGIN_FILE ), array(), DEPAY_CURRENT_VERSION, true);
		wp_enqueue_script( 'DEPAY_WC_ETHERS' );
		wp_register_script('DEPAY_WC_SOLANA_WEB3', plugins_url( 'dist/solana-web3.js', DEPAY_WC_PLUGIN_FILE ), array(), DEPAY_CURRENT_VERSION, true);
		wp_enqueue_script( 'DEPAY_WC_SOLANA_WEB3' );
		wp_register_script('DEPAY_WC_BLOCKCHAINS', plugins_url( 'dist/web3-blockchains.js', DEPAY_WC_PLUGIN_FILE ), array(), DEPAY_CURRENT_VERSION, true);
		wp_enqueue_script( 'DEPAY_WC_BLOCKCHAINS' );
		wp_register_script('DEPAY_WC_CLIENT', plugins_url( 'dist/web3-client.js', DEPAY_WC_PLUGIN_FILE ), array(), DEPAY_CURRENT_VERSION, true);
		wp_enqueue_script( 'DEPAY_WC_CLIENT' );
		wp_register_script('DEPAY_WC_WIDGETS', plugins_url( 'dist/widgets.bundle.js', DEPAY_WC_PLUGIN_FILE ), array(), DEPAY_CURRENT_VERSION, true);
		wp_enqueue_script( 'DEPAY_WC_WIDGETS' );
		wp_register_style( 'DEPAY_WC_ADMIN', plugins_url( 'assets/css/admin.css', DEPAY_WC_PLUGIN_FILE ), array(), DEPAY_CURRENT_VERSION );
		wp_enqueue_style( 'DEPAY_WC_ADMIN' );
		wp_register_script('DEPAY_WC_REACT_TOKEN_IMAGE', plugins_url( 'dist/react-token-image.js', DEPAY_WC_PLUGIN_FILE ), array('react', 'react-dom', 'DEPAY_WC_ETHERS', 'DEPAY_WC_SOLANA_WEB3', 'DEPAY_WC_BLOCKCHAINS', 'DEPAY_WC_CLIENT'), DEPAY_CURRENT_VERSION, true);
		wp_enqueue_script( 'DEPAY_WC_REACT_TOKEN_IMAGE' );
		wp_register_script('DEPAY_WC_ADMIN', plugins_url( 'dist/admin.js', DEPAY_WC_PLUGIN_FILE ), array('react', 'react-dom', 'wp-hooks', 'wp-element', 'wp-components', 'wp-api', 'wc-components', 'wc-navigation', 'DEPAY_WC_REACT_TOKEN_IMAGE'), DEPAY_CURRENT_VERSION, true);
		wp_localize_script('DEPAY_WC_ADMIN', 'DEPAY_WC_SETUP', array(
			'done' => ( !empty(get_option('depay_wc_accepted_payments')) && !empty(get_option('depay_wc_tokens')) ),
			'bcmath' => in_array('bcmath', $extensions, true),
		));
		wp_enqueue_script( 'DEPAY_WC_ADMIN' );
	}

	public function add_menu() {
		
		$menu_icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA4NTIgNjg0IgoJIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIGZpbGw9IiNBMkFBQjIiIGQ9Ik03MDUuMiwyMDEuOGgxMTYuM1Y4Ny40YzAtNDYuMi0zNy40LTgzLjYtODMuNi04My42SDEwM2MtNDYuMiwwLTgzLjYsMzcuNC04My42LDgzLjZ2MTE2LjloNjQuMmw0OC4zLTQ4LjMKCQljMi44LTIuOCw2LjQtNC41LDEwLjMtNC45YzAsMCwwLDAsMCwwYzAuMiwwLDAuNSwwLDAuNy0wLjFjMCwwLDAuMSwwLDAuMSwwYzAuMywwLDAuNiwwLDAuOSwwaDE0MC4yYzMuMy0xNi4xLDExLjItMzEsMjMuMS00Mi45CgkJYzE2LTE2LDM3LjMtMjQuOCw2MC0yNC44YzIyLjcsMCw0My45LDguOCw2MCwyNC44YzE2LDE2LDI0LjgsMzcuMywyNC44LDYwYzAsMjAtNi44LDM4LjktMTkuNCw1NGMtMS43LDItMy41LDQtNS40LDUuOQoJCWMtMS45LDEuOS0zLjksMy43LTUuOSw1LjRjLTE1LjIsMTIuNi0zNC4xLDE5LjQtNTQsMTkuNGMtMjIuNywwLTQzLjktOC44LTYwLTI0LjhjLTExLjktMTEuOS0xOS44LTI2LjgtMjMuMS00Mi45SDE1MC45CgkJbC00OC4zLDQ4LjNjLTIuOCwyLjgtNi40LDQuNS0xMC4zLDQuOWMwLDAsMCwwLDAsMGMtMC4yLDAtMC41LDAtMC43LDAuMWMwLDAtMC4xLDAtMC4xLDBjLTAuMywwLTAuNiwwLTAuOSwwSDE5LjN2MTAzLjh2MjkuM2g1MS44CgkJbDMyLjgtMzIuOGMyLjgtMi44LDYuNC00LjUsMTAuMy00LjljMCwwLDAsMCwwLDBjMC4yLDAsMC41LDAsMC43LTAuMWMwLDAsMC4xLDAsMC4xLDBjMC4zLDAsMC42LDAsMC45LDBoNTIuNwoJCWMzLjMtMTYuMSwxMS4yLTMxLDIzLjEtNDIuOWMxNi0xNiwzNy4zLTI0LjgsNjAtMjQuOGMyMi43LDAsNDMuOSw4LjgsNjAsMjQuOGMxNiwxNiwyNC44LDM3LjMsMjQuOCw2MGMwLDIyLjctOC44LDQzLjktMjQuOCw2MAoJCWMtMTYsMTYtMzcuMywyNC44LTYwLDI0LjhjLTIyLjcsMC00My45LTguOC02MC0yNC44Yy0xMS45LTExLjktMTkuOC0yNi44LTIzLjEtNDIuOWgtNDUuNmwtMzIuOCwzMi44Yy0yLjgsMi44LTYuNCw0LjUtMTAuMyw0LjkKCQljMCwwLDAsMC0wLjEsMGMtMC4yLDAtMC41LDAtMC43LDAuMWMtMC4xLDAtMC4xLDAtMC4yLDBjLTAuMiwwLTAuNSwwLTAuNywwYzAsMC0wLjEsMC0wLjEsMEgxOS4zVjQ2N2gxMDEuMmMwLjMsMCwwLjYsMCwwLjksMAoJCWMwLDAsMC4xLDAsMC4xLDBjMC4zLDAsMC41LDAsMC43LDAuMWMwLDAsMCwwLDAsMGMzLjksMC40LDcuNSwyLjEsMTAuMyw0LjlsNTAuMyw1MC4zaDEwMy42YzMuMy0xNi4xLDExLjItMzEsMjMuMS00Mi45CgkJYzE2LTE2LDM3LjMtMjQuOCw2MC0yNC44czQzLjksOC44LDYwLDI0LjhjMTYsMTYsMjQuOCwzNy4zLDI0LjgsNjBjMCwyMS03LjYsNDAuOS0yMS41LDU2LjRjLTEuMSwxLjItMi4yLDIuNC0zLjMsMy41CgkJYy0xLjEsMS4yLTIuMywyLjMtMy41LDMuM2MtMTUuNiwxMy45LTM1LjQsMjEuNS01Ni40LDIxLjVjLTIyLjcsMC00My45LTguOC02MC0yNC44Yy0xMS45LTExLjktMTkuOC0yNi44LTIzLjEtNDIuOUgxNzUuOAoJCWMtMS45LDAtMy44LTAuMy01LjYtMC45YzAsMC0wLjEsMC0wLjEsMGMtMC4yLTAuMS0wLjMtMC4xLTAuNS0wLjJjLTAuMSwwLTAuMi0wLjEtMC4zLTAuMWMtMC4xLDAtMC4yLTAuMS0wLjMtMC4xCgkJYy0wLjItMC4xLTAuMy0wLjEtMC41LTAuMmMwLDAtMC4xLDAtMC4xLTAuMWMtMS43LTAuOC0zLjItMS45LTQuNi0zLjNsLTUwLjMtNTAuM0gxOS4zdjk2LjFjMCw0Ni4yLDM3LjQsODMuNiw4My42LDgzLjZoNjM0LjkKCQljNDYuMiwwLDgzLjYtMzcuNCw4My42LTgzLjZWNDgyLjhINzA1LjJjLTc3LjYsMC0xNDAuNS02Mi45LTE0MC41LTE0MC41djBDNTY0LjcsMjY0LjcsNjI3LjYsMjAxLjgsNzA1LjIsMjAxLjh6Ii8+Cgk8cGF0aCBmaWxsPSIjQTJBQUIyIiBkPSJNNDE2LjMsNTM5LjRjMC0yNS43LTIwLjktNDYuNy00Ni43LTQ2LjdjLTI1LjcsMC00Ni43LDIwLjktNDYuNyw0Ni43YzAsMjUuNywyMC45LDQ2LjcsNDYuNyw0Ni43CgkJQzM5NS4zLDU4Ni4xLDQxNi4zLDU2NS4xLDQxNi4zLDUzOS40eiIvPgoJPHBhdGggZmlsbD0iI0EyQUFCMiIgZD0iTTQxMy45LDE2OC4yYzAtMjUuNy0yMC45LTQ2LjctNDYuNy00Ni43Yy0yNS43LDAtNDYuNywyMC45LTQ2LjcsNDYuN2MwLDI1LjcsMjAuOSw0Ni43LDQ2LjcsNDYuNwoJCUMzOTIuOSwyMTQuOSw0MTMuOSwxOTMuOSw0MTMuOSwxNjguMnoiLz4KCQoJCTxlbGxpcHNlIHRyYW5zZm9ybT0ibWF0cml4KDAuMzgyNyAtMC45MjM5IDAuOTIzOSAwLjM4MjcgLTE2OC42OTk1IDQ0OS4yNDQ1KSIgZmlsbD0iI0EyQUFCMiIgY3g9IjI1MS44IiBjeT0iMzUwLjkiIHJ4PSI0Ni43IiByeT0iNDYuNyIvPgo8L2c+CjxwYXRoIGZpbGw9IiNBMkFBQjIiIGQ9Ik03MDYuMSwyMzUuM2gtMC45Yy01OS4xLDAtMTA3LDQ3LjktMTA3LDEwN3YwYzAsNTkuMSw0Ny45LDEwNywxMDcsMTA3aDAuOWM1OS4xLDAsMTA3LTQ3LjksMTA3LTEwN3YwCglDODEzLjEsMjgzLjIsNzY1LjIsMjM1LjMsNzA2LjEsMjM1LjN6IE03MzIsMzk4LjFoLTU1LjhsMTUuOS01OC40Yy05LjQtNC41LTE1LjktMTQuMS0xNS45LTI1LjJjMC0xNS40LDEyLjUtMjcuOSwyNy45LTI3LjkKCVM3MzIsMjk5LDczMiwzMTQuNGMwLDExLjEtNi41LDIwLjctMTUuOSwyNS4yTDczMiwzOTguMXoiLz4KPC9zdmc+Cg==';

		wc_admin_register_page(
			[
				'id'         => 'depay-woocommerce-payments',
				'title'      => 'DePay',
				'path'       => '/depay/settings',
				'capability' => '',
				'icon'       => $menu_icon,
				'position'   => 56,
				'nav_args'   => [
					'title'        => 'DePay',
					'is_category'  => true,
					'is_top_level' => true,
				],
			]
		);
		
		wc_admin_register_page(
			[
				'id'         => 'depay-woocommerce-payments-transactions',
				'title'      => 'Transactions',
				'capability' => 'manage_woocommerce',
				'parent'     => 'depay-woocommerce-payments',
				'path'       => '/depay/transactions',
				'nav_args'   => [
					'parent'   => 'depay-woocommerce-payments',
					'order'  => 10
				]
			]
		);

		wc_admin_register_page(
			[
				'id'         => 'depay-woocommerce-payments-settings',
				'title'      => 'Settings',
				'capability' => 'manage_woocommerce',
				'parent'     => 'depay-woocommerce-payments',
				'path'       => '/depay/settings',
				'nav_args'   => [
					'parent'   => 'depay-woocommerce-payments',
					'order'  => 20
				]
			]
		);
	} 
}
