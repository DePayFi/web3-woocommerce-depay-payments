<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Gateway extends WC_Payment_Gateway {

	const GATEWAY_ID = 'depay_wc_payments';

	public $blockchain;

	public function __construct() {
		$this->id									= static::GATEWAY_ID;
		$this->method_title				= 'DePay';
		$this->method_description = 'Web3 Payments directly into your wallet. Accept any token with on-the-fly conversion.';
		$this->supports    				= [ 'products' ];
		$this->init_form_fields();
		$this->init_settings();
		$title 										= get_option( 'depay_wc_checkout_title' );
		$this->title  						= empty($title) ? 'DePay' : $title;
		$description 							= get_option( 'depay_wc_checkout_description' );
		$this->description  			= empty($description) ? null : $description;
		$this->blockchain				  = null;
	}

	public function get_title() {
		return $this->title;
	}

	public function get_icon() {
		$icon = '<style>.wc_payment_method_depay_image { margin: 0 3px 0 0 !important; padding: 0 !important; flex: 1 1 auto !important; width: auto; max-width: 24px !important; } .payment_box.payment_method_depay_wc_payments { width: 100%; } .wc_payment_method.payment_method_depay_wc_payments { display: flex; flex-direction: row; flex-wrap: no-wrap; align-items: center; } .payment_method_depay_wc_payments label { display: flex !important; flex-grow: 1; align-items: center; white-space: nowrap; }</style><div style="display: inline-flex; flex-direction: row; flex-grow: 1; padding-left: 12px; justify-content: end; width: 100%; overflow: hidden;">';
		if ( empty( get_option( 'depay_wc_blockchains' ) ) ) {
			$icon = '';
		} else if ( null != $this->blockchain ) {
			$url = esc_url( plugin_dir_url( __FILE__ ) . 'images/blockchains/' . $this->blockchain . '.svg' );
			$icon = $icon . "<img title='Payments on " . ucfirst($this->blockchain) . "' class='wc_payment_method_depay_image' src='" . $url . "'/>";
		} else {
			$blockchains = json_decode( get_option( 'depay_wc_blockchains' ) );
			$index = 0;
			$more = '';
			foreach ( $blockchains as $blockchain ) {
				if ($index < 5) {
					$url = esc_url( plugin_dir_url( __FILE__ ) . 'images/blockchains/' . $blockchain . '.svg' );
					$icon = $icon . "<img title='Payments on " . ucfirst($blockchain) . "' class='wc_payment_method_depay_image' src='" . $url . "'/>";
				} else {
					$more = $more . ', ' . ucfirst($blockchain);
				}
				++$index;
			}
			if ($index > 5) {
				$more = substr($more, 2);
				$icon = $icon . "<span title='" . $more . "' style='width: 18px; padding-left: 6px;'><img style='position: relative; top: 6px; width: 100%; opacity: 0.5;' class='wc_payment_method_depay_image' src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgDQoJIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDQxLjkxNSA0MS45MTYiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0xMS4yMTQsMjAuOTU2YzAsMy4wOTEtMi41MDksNS41ODktNS42MDcsNS41ODlDMi41MSwyNi41NDQsMCwyNC4wNDYsMCwyMC45NTZjMC0zLjA4MiwyLjUxMS01LjU4NSw1LjYwNy01LjU4NQ0KCQkJQzguNzA1LDE1LjM3MSwxMS4yMTQsMTcuODc0LDExLjIxNCwyMC45NTZ6Ii8+DQoJCTxwYXRoIGQ9Ik0yNi41NjQsMjAuOTU2YzAsMy4wOTEtMi41MDksNS41ODktNS42MDYsNS41ODljLTMuMDk3LDAtNS42MDctMi40OTgtNS42MDctNS41ODljMC0zLjA4MiwyLjUxMS01LjU4NSw1LjYwNy01LjU4NQ0KCQkJQzI0LjA1NiwxNS4zNzEsMjYuNTY0LDE3Ljg3NCwyNi41NjQsMjAuOTU2eiIvPg0KCQk8cGF0aCBkPSJNNDEuOTE1LDIwLjk1NmMwLDMuMDkxLTIuNTA5LDUuNTg5LTUuNjA3LDUuNTg5Yy0zLjA5NywwLTUuNjA2LTIuNDk4LTUuNjA2LTUuNTg5YzAtMy4wODIsMi41MTEtNS41ODUsNS42MDYtNS41ODUNCgkJCUMzOS40MDYsMTUuMzcxLDQxLjkxNSwxNy44NzQsNDEuOTE1LDIwLjk1NnoiLz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4='/></span>";
			}
		}
		return $icon . '</div>';
	}

	public function init_form_fields() {

		$this->form_fields = array(
			'enabled' => array(
				'title'   => 'Enable/Disable',
				'type'    => 'checkbox',
				'label'   => 'Enable gateway',
				'default' => 'yes'
			),
			'title' => array(
				'title'       => 'Title',
				'type'        => 'text',
				'description' => __( 'This controls the title which the user sees during checkout.' ),
				'default'     => 'DePay',
				'desc_tip'    => true,
			),
			'description' => array(
				'title'       => 'Description',
				'type'        => 'textarea',
				'description' => 'Payment method description that the customer will see on your checkout.',
				'default'     => '',
				'desc_tip'    => true,
			)
		);
	}

	public function process_payment( $order_id ) {
		global $wpdb;
		$order = wc_get_order( $order_id );

		if ( $order->get_total() > 0 ) {
			
			$accept = $this->get_accept( $order );
			$checkout_id = wp_generate_uuid4();
			$result = $wpdb->insert( "{$wpdb->prefix}wc_depay_checkouts", array(
				'id' => $checkout_id,
				'order_id' => $order_id,
				'accept' => json_encode( $accept ),
				'created_at' => current_time( 'mysql' )
			));
			if ( false === $result ) {
				$error_message = $wpdb->last_error;
				DePay_WC_Payments::log( 'Storing checkout failed: ' . $error_message );
				throw new Exception( 'Storing checkout failed: ' . $error_message );
			}
			
			return( [
				'result'         => 'success',
				'redirect'       => '#wc-depay-checkout-' . $checkout_id . '@' . time()
			] );
		} else {
			$order->payment_complete();
		}
	}

	public function round_token_amount( $amount ) {
		$amount = strval( $amount );
		preg_match( '/\d+\.0*(\d{4})/' , $amount, $digits_after_decimal );
		if ( !empty( $digits_after_decimal ) ) {
			$digits_after_decimal = $digits_after_decimal[0];
			preg_match( '/\d{4}$/', $digits_after_decimal, $focus );
			$focus = $focus[0];
			if ( preg_match( '/^0/', $focus ) ) {
				$float = floatval( "$focus[1].$focus[2]$focus[3]" );
				$fixed = '0' . number_format( round( $float, 2 ) , 2, '', '' );
			} else {
				$float = floatval( "$focus[0].$focus[1]$focus[2]9" );
				$fixed = number_format( round( $float, 2 ), 2, '', '' );
			}
			if ( '0999' == $fixed && round( $amount, 0 ) == 0 ) {
				return preg_replace( '/\d{4}$/', '1000', $digits_after_decimal );
			} elseif ( '1000' == $fixed && round( $amount, 0 ) == 0 ) {
				return preg_replace( '/\d{5}$/', '1000', $digits_after_decimal );
			} elseif ( '0' != $fixed[0] && strlen( $fixed ) > 3 ) {
				return round( $amount, 0 );
			} else {
				return preg_replace( '/\d{4}$/', $fixed, $digits_after_decimal );
			}
		} else {
			return $amount;
		}
	}

	public function get_accept( $order ) {
		$total = $order->get_total();
		$currency = $order->get_currency();
		$requests = [];
		$token_denominated = false;
		$token = null;
		$api_key = get_option( 'depay_wc_api_key' );
		if ( empty( $api_key ) ) {
			$api_key = false;
		}

		if ( !empty( get_option( 'depay_wc_token_for_denomination' ) ) ) {

			$token = json_decode( get_option( 'depay_wc_token_for_denomination' ) );

			if ( $token->symbol === $currency ) {
				$token_denominated = true;
			}
		}

		$price_decimals = get_option( 'woocommerce_price_num_decimals' );
		$price_format_specifier = '%.' . $price_decimals . 'f';
		if ( $token_denominated ) {
			if ( $api_key ) {
				$usd_amount = wp_remote_get(
					sprintf( 'https://api.depay.com/v2/conversions/USD/%s/%s?amount=' . $price_format_specifier, $token->blockchain, $token->address, $total ),
					array(
						'headers' => array(
							'x-api-key' => $api_key
						),
						'timeout' => 10
					)
				);
			} else {
				$usd_amount = wp_remote_get(
					sprintf( 'https://public.depay.com/conversions/USD/%s/%s?amount=' . $price_format_specifier, $token->blockchain, $token->address, $total ),
					array(
						'timeout' => 10
					)
				);
			}
			if ( wp_remote_retrieve_response_code( $usd_amount ) === 429 ) {
				DePay_WC_Payments::log( 'To many requests! Please upgrade to DePay PRO.' );
				throw new Exception( 'To many requests! Please upgrade to DePay PRO.' );
			} else if ( is_wp_error($usd_amount) || wp_remote_retrieve_response_code( $usd_amount ) != 200 ) {
				DePay_WC_Payments::log( 'Price request failed!' );
				throw new Exception( 'Price request failed!' );
			}
			$total_in_usd = bcmul( $usd_amount['body'], 1, 3 );
		} else if ( 'USD' == $currency ) {
			$total_in_usd = $total;
		} else {
			if ( $api_key ) {
				$get = wp_remote_get(
					sprintf( 'https://api.depay.com/v2/currencies/%s', $currency ),
					array(
						'headers' => array(
							'x-api-key' => $api_key
						)
					)
				);
			} else {
				$get = wp_remote_get( sprintf( 'https://public.depay.com/currencies/%s', $currency ) );
			}
			if ( wp_remote_retrieve_response_code( $get ) === 429 ) {
				DePay_WC_Payments::log( 'To many requests! Please upgrade to DePay PRO.' );
				throw new Exception( 'To many requests! Please upgrade to DePay PRO.' );
			} else if ( is_wp_error($get) || wp_remote_retrieve_response_code( $get ) != 200 ) {
				DePay_WC_Payments::log( 'Price request failed!' );
				throw new Exception( 'Price request failed!' );
			}
			$rate = $get['body'];
			$total_in_usd = bcdiv( $total, $rate, 3 );
		}

		if ( empty($total_in_usd) ) {
			DePay_WC_Payments::log( 'total_in_usd empty!' );
			throw new Exception( 'total_in_usd empty!' );
		}

		$accepted_payments = json_decode( get_option( 'depay_wc_accepted_payments' ) );

		if ( null != $this->blockchain ) {
			$accepted_payments = array_values( array_filter( $accepted_payments, function ( $payment ) {
				return $payment->blockchain === $this->blockchain;
			}));
		}

		foreach ( $accepted_payments as $accepted_payment ) {
			if ( $api_key ) {
				$requests[] = array(
					'url' => sprintf( 'https://api.depay.com/v2/conversions/%s/%s/USD?amount=' . $price_format_specifier, $accepted_payment->blockchain, $accepted_payment->token, $total_in_usd ),
					'type' => 'GET',
					'timeout' => 10,
					'headers' => array(
						'x-api-key' => $api_key
					)
				);
				$requests[] = array(
					'url' => sprintf( 'https://api.depay.com/v2/tokens/decimals/%s/%s', $accepted_payment->blockchain, $accepted_payment->token ),
					'type' => 'GET',
					'headers' => array(
						'x-api-key' => $api_key
					)
				);
			} else {
				$requests[] = array(
					'url' => sprintf( 'https://public.depay.com/conversions/%s/%s/USD?amount=' . $price_format_specifier, $accepted_payment->blockchain, $accepted_payment->token, $total_in_usd ),
					'type' => 'GET',
					'timeout' => 10
				);
				$requests[] = array(
					'url' => sprintf( 'https://public.depay.com/tokens/decimals/%s/%s', $accepted_payment->blockchain, $accepted_payment->token ),
					'type' => 'GET'
				);
			}
		}

		$responses = Requests::request_multiple( $requests );

		$accept = [];

		for ($i = 0; $i < count($responses); $i++) {
			if ( 0 === $i % 2 ) { // even 0, 2, 4 ...
				if ( $responses[$i]->status_code === 429 ) {
					DePay_WC_Payments::log( 'To many requests! Please upgrade to DePay PRO.' );
					throw new Exception( 'To many requests! Please upgrade to DePay PRO.' );
				} else if ( $responses[$i]->success && $responses[$i+1]->success && !empty( $responses[$i]->body ) && !empty( $responses[$i+1]->body ) ) {
					$accepted_payment = $accepted_payments[ $i / 2 ];
					if ( $token_denominated && $token && $token->blockchain === $accepted_payment->blockchain && $token->address === $accepted_payment->token ) {
						$amount = $total;
					} else {
						$amount = $this->round_token_amount( $responses[$i]->body );
					}
					if ( !empty( $amount ) && strval( $amount ) !== '0.00' ) {
						array_push($accept, [
							'blockchain' => $accepted_payment->blockchain,
							'token' => $accepted_payment->token,
							'amount' => $amount,
							'receiver' => $accepted_payment->receiver
						]);
					}
				}
			}
		}
		
		if ( empty( $accept ) ) {
			DePay_WC_Payments::log( 'No valid payment route found!' );
			throw new Exception( 'No valid payment route found!' );
		}

		return $accept;
	}

	public function admin_options() {
		wp_redirect( '/wp-admin/admin.php?page=wc-admin&path=%2Fdepay%2Fsettings' );
	}
}
