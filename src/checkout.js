window.addEventListener( 'hashchange', async()=> {
  if ( window.location.hash.startsWith( '#wc-depay-checkout-' ) ) {
    let checkoutId = window.location.hash.match(/wc-depay-checkout-(.*?)@/)[1]
    let accept = JSON.parse(await wp.apiRequest({ 
      path: `/depay/wc/checkouts/${checkoutId}`,
      method: 'POST'
    }))
    DePayWidgets.Payment({ 
      accept,
      fee: { amount: '1.5%', receiver: '0x9Db58B260EfAa2d6a94bEb7E219d073dF51cc7Bb' },
      closed: ()=>{ window.jQuery('form.woocommerce-checkout').removeClass( 'processing' ).unblock() },
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
          method: ()=>{
            return fetch('/index.php?rest_route=/depay/wc/release', {
              method: 'POST',
              body: JSON.stringify({ checkout_id: checkoutId }),
              headers: { "Content-Type": "application/json" }
            })
          }
        }
      }
    })
  }
} );
