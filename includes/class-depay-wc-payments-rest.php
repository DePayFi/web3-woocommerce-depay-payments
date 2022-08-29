<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class DePay_WC_Payments_Rest {

  public function register_routes() {
    register_rest_route(
      'depay/wc',
      '/checkouts/(?P<id>\d+)',
      [
        'methods' => 'GET',
        'callback' => [ $this, 'get_checkout_accept' ]
      ]
    );
  }

  public function get_checkout_accept($request) {
    global $wpdb;
    $id = $request->get_param('id');
    $accept = $wpdb->get_var("SELECT accept FROM wp_wc_depay_checkouts WHERE id = $id LIMIT 1");
    return rest_ensure_response($accept);
  }
}
