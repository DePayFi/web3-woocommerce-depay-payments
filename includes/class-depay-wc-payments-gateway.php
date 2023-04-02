<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Gateway extends WC_Payment_Gateway {

	const GATEWAY_ID = 'depay_wc_payments';

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
		$this->description  			= empty($title) ? null : $description;
	}

	public function get_icon() {
		$icon = '';
		if ( empty( get_option( 'depay_wc_blockchains' ) ) ) {
			return $icon;
		}
		$blockchains = json_decode( get_option( 'depay_wc_blockchains' ) );
		foreach ( array_reverse( $blockchains ) as $blockchain ) {
			$url = esc_url( plugin_dir_url( __FILE__ ) . 'images/blockchains/' . $blockchain . '.svg' );
			$icon = $icon . "<img style='height: 40px;' src='" . $url . "'/>";
		}
		return $icon;    
	}

	public function init_form_fields() {

		$this->form_fields = array(
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
				'default'     => 'The goods are yours. No money needed!!!',
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
			$wpdb->insert( 'wp_wc_depay_checkouts', array(
				'id' => $checkout_id,
				'order_id' => $order_id,
				'accept' => json_encode( $accept ),
				'created_at' => current_time( 'mysql' )
			));
			
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

		if ( !empty( get_option( 'depay_wc_token_for_denomination' ) ) ) {

			$token = json_decode( get_option( 'depay_wc_token_for_denomination' ) );

			if ( $token->symbol === $currency ) {
				$token_denominated = true;
			}
		}

		if ( $token_denominated ) {
			$token_price = wp_remote_get( sprintf( 'https://public.depay.com/tokens/prices/%s/%s', $token->blockchain, $token->address ) );
			if ( is_wp_error($token_price) || wp_remote_retrieve_response_code( $token_price ) != 200 ) {
				DePay_WC_Payments::log( 'Price request failed!' );
				throw new Exception( 'Price request failed!' );
			}
			$token_decimals = wp_remote_get( sprintf( 'https://public.depay.com/tokens/decimals/%s/%s', $token->blockchain, $token->address ) );
			if ( is_wp_error($token_decimals) || wp_remote_retrieve_response_code( $token_decimals ) != 200 ) {
				DePay_WC_Payments::log( 'Decimals request failed!' );
				throw new Exception( 'Decimals request failed!' );
			}
			$total_in_usd = bcmul( $token_price['body'], $total, $token_decimals['body'] );
		} else if ( 'USD' == $currency ) {
			$total_in_usd = $total;
		} else {
			$get = wp_remote_get( sprintf( 'https://public.depay.com/currencies/%s', $currency ) );
			if ( is_wp_error($get) || wp_remote_retrieve_response_code( $get ) != 200 ) {
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

		foreach ( $accepted_payments as $accepted_payment ) {
			$requests[] = array( 'url' => sprintf( 'https://public.depay.com/tokens/prices/%s/%s', $accepted_payment->blockchain, $accepted_payment->token ), 'type' => 'GET' );
			$requests[] = array( 'url' => sprintf( 'https://public.depay.com/tokens/decimals/%s/%s', $accepted_payment->blockchain, $accepted_payment->token ), 'type' => 'GET' );
		}

		$responses = Requests::request_multiple( $requests );

		$accept = [];

		for ($i = 0; $i < count($responses); $i++) {
			if ( 0 === $i % 2 ) { // even 0, 2, 4 ...
				if ( $responses[$i]->success && $responses[$i+1]->success && !empty( $responses[$i]->body ) && !empty( $responses[$i+1]->body ) ) {
					$accepted_payment = $accepted_payments[ $i / 2 ];
					if ( $token_denominated && $token && $token->blockchain === $accepted_payment->blockchain && $token->address === $accepted_payment->token ) {
						$amount = $total;
					} else {
						$amount = $this->round_token_amount( bcdiv( $total_in_usd, $responses[$i]->body, $responses[$i+1]->body ) );
					}
					array_push($accept, [
						'blockchain' => $accepted_payment->blockchain,
						'token' => $accepted_payment->token,
						'amount' => $amount,
						'receiver' => $accepted_payment->receiver
					]);
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
