window.addEventListener( 'hashchange', async()=> {
  if ( window.location.hash.startsWith( '#wc-depay-checkout-' ) ) {
    let checkoutId = window.location.hash.match(/wc-depay-checkout-(\d+)/)[1]
    let accept = JSON.parse(await wp.apiRequest({ path: `/depay/wc/checkouts/${checkoutId}` }))
    DePayWidgets.Payment({ 
      accept,
      fee: { amount: '1.5%', receiver: '0x9Db58B260EfAa2d6a94bEb7E219d073dF51cc7Bb' },
      closed: ()=>{ window.jQuery('form.woocommerce-checkout').removeClass( 'processing' ).unblock() },
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
        }
      }
    })
  }
} );
