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
    const response = JSON.parse(await wp.apiRequest({ 
      path: `/depay/wc/checkouts/${checkoutId}`,
      method: 'POST',
      headers: {
        'X-WP-Nonce': wpApiSettings?.nonce, // Use WordPress's REST API nonce
      },
    }).catch((error)=>{
      if(error?.responseJSON?.code === 'rest_cookie_invalid_nonce') {
        window.location.reload(true)
      }
    }))
    if(response.redirect) {
      window.location = response.redirect
      return
    }
    let configuration = { 
      accept: response.map((_accept)=>{
        return {..._accept,
          protocolFee: '1.5%',
        }
      }),
      closed: ()=>{
        window.location.hash = ''
        window.location.reload(true)
      },
      track: {
        method: (payment)=>{
          return new Promise((resolve, reject)=>{
            try {
              wp.apiRequest({
                path: `/depay/wc/checkouts/${checkoutId}/track`,
                method: 'POST',
                data: payment
              })
              .done(()=>resolve({ status: 200 }))
              .fail((request, status)=>reject(status))
            } catch { reject() }
          })
        },
        poll: {
          method: ()=>{
            return new Promise((resolve, reject)=>{
              wp.apiRequest({
                path: '/depay/wc/release',
                method: 'POST',
                data: { checkout_id: checkoutId }
              })
              .done((responseData)=>{
                resolve(responseData)
              }).fail(resolve)
            })
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
