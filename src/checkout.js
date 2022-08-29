window.addEventListener( 'hashchange', async()=> {
  if ( window.location.hash.startsWith( '#wc-depay-checkout-' ) ) {
    let checkoutId = window.location.hash.match(/wc-depay-checkout-(\d+)/)[1]
    let accept = JSON.parse(await wp.apiRequest({ path: `/depay/wc/checkouts/${checkoutId}` }))
    DePayWidgets.Payment({ 
      accept,
      closed: ()=>{ window.jQuery('form.woocommerce-checkout').removeClass( 'processing' ).unblock() }
    })
  }
} );
