(function ( ) {

jQuery( function($) {

  $( document ).ajaxError(function() {
    if(typeof window._depayUnmountLoading == 'function') { window._depayUnmountLoading() }
  })

  $( document ).ajaxComplete(function() {
    if(typeof window._depayUnmountLoading == 'function') { window._depayUnmountLoading() }
  })

  $("form.woocommerce-checkout").on('submit', async()=>{
    var values = $("form.woocommerce-checkout").serialize()
    if(values.match('payment_method=depay_wc_payments')) {
      let { unmount } = await DePayWidgets.Loading({ text: 'Loading payment data...' });
      setTimeout(unmount, 10000)
    }
  })
})

const displayCheckout = async()=>{
  if ( window.location.hash.startsWith( '#wc-depay-checkout-' ) ) {
    const checkoutId = window.location.hash.match(/wc-depay-checkout-(.*?)@/)[1]
    const accept = JSON.parse(await wp.apiRequest({ 
      path: `/depay/wc/checkouts/${checkoutId}`,
      method: 'POST'
    }))
    let configuration = { 
      accept,
      fee: { amount: '1.5%', receiver: '0x9Db58B260EfAa2d6a94bEb7E219d073dF51cc7Bb' },
      closed: ()=>{
        window.location.hash = ''
        window.jQuery('form.woocommerce-checkout').removeClass( 'processing' ).unblock()
      },
      before: ()=> {
        let confirmed = true
        let host = window.location.host
        if(
          host.match(/^localhost/) ||
          host.match(/\.local$/) ||
          host.match(/\.local\:/) ||
          host.match(/127\.0\.0\.1/) ||
          host.match(/0\.0\.0\.0/) ||
          host.match(/0:0:0:0:0:0:0:1/) ||
          host.match(/::1/)
        ) {
          window.alert("Payments can not be tested in local development! Make sure to test in a deployed environment where payment validation callbacks can reach your server!");
          return(false);
        }
        return(confirmed)
      },
      track: {
        method: (payment)=>{
          return new Promise((resolve, reject)=>{
            wp.apiRequest({
              path: `/depay/wc/checkouts/${checkoutId}/track`,
              method: 'POST',
              data: payment
            })
            .done((result)=>resolve({ status: 200 }))
            .fail((request, status)=>reject(status))
          })
        },
        poll: {
          method: async ()=>{
            let response = fetch('/index.php?rest_route=/depay/wc/release', {
              method: 'POST',
              body: JSON.stringify({ checkout_id: checkoutId }),
              headers: { "Content-Type": "application/json" }
            })

            if(response.status == 200) {
              let json = await response.json()
              return json
            }
          }
        }
      }
    }
    if(window.DEPAY_WC_CURRENCY && window.DEPAY_WC_CURRENCY.displayCurrency == 'store' && window.DEPAY_WC_CURRENCY.storeCurrency?.length) {
      configuration.currency = window.DEPAY_WC_CURRENCY.storeCurrency
    }
    DePayWidgets.Payment(configuration)
  }
}

document.addEventListener('DOMContentLoaded', displayCheckout);
window.addEventListener('hashchange', displayCheckout);

})()
