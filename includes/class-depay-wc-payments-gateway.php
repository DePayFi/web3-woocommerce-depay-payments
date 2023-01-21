<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DePay_WC_Payments_Gateway extends WC_Payment_Gateway {

	public function __construct() {
		$title = 'DePay';
		$this->id									= 'depay_wc_payments';
		$this->method_title				= 'DePay';
		$this->method_description = 'Web3 Payments directly into your wallet. Accept any token with on-the-fly conversion.';
		$this->title							= 'DePay';
		$this->init_settings();
	}

	public function get_icon() {
		$icon = '';
		if ( empty( get_option( 'depay_wc_blockchains' ) ) ) {
			return $icon;
		}
		$blockchains = json_decode( get_option( 'depay_wc_blockchains' ) );
		foreach ( array_reverse( $blockchains ) as $blockchain ) {
			$url = esc_url( plugin_dir_url( __FILE__ ) . 'images/blockchains/' . $blockchain . '.svg' );
			$icon = $icon . "<img style='width: 32px; height: 32px;' src='" . $url . "'/>";
		}
		return $icon;    
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
		if ( 'USD' == $currency ) {
			$total_in_usd = $total;
		} else {
			$get = wp_remote_get( sprintf( 'https://public.depay.com/currencies/%s', $currency ) );
			if ( is_wp_error($get) ) {
				DePay_WC_Payments::log( $get->get_error_message() );
			}
			$rate = $get['body'];
			$total_in_usd = bcdiv( $total, $rate, 3 );
		}
		$accept = [];
		foreach ( json_decode( get_option( 'depay_wc_accepted_payments' ) ) as $accepted_payment ) {
			$get = wp_remote_get( sprintf( 'https://public.depay.com/tokens/prices/%s/%s', $accepted_payment->blockchain, $accepted_payment->token ) );
			if ( is_wp_error($get) ) {
				DePay_WC_Payments::log( $get->get_error_message() );
			}
			$rate = $get['body'];
			$get = wp_remote_get( sprintf( 'https://public.depay.com/tokens/decimals/%s/%s', $accepted_payment->blockchain, $accepted_payment->token ) );
			if ( is_wp_error($get) ) {
				DePay_WC_Payments::log( $get->get_error_message() );
			}
			$decimals = intval( $get['body'] );
			if ( !empty( $rate ) && !empty( $decimals ) ) {
				array_push($accept, [
					'blockchain' => $accepted_payment->blockchain,
					'token' => $accepted_payment->token,
					'amount' => $this->round_token_amount( bcdiv( $total_in_usd, $rate, $decimals ) ),
					'receiver' => $accepted_payment->receiver
				]);      
			}
		} 
		
		if ( empty( $accept ) ) {
			throw new Exception( 'No valid payment route found!' );
		}

		return $accept;
	}

	public function admin_options() {
		wp_redirect( '/wp-admin/admin.php?page=wc-admin&path=%2Fdepay%2Fsettings' );
	}
}
