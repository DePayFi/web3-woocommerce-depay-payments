(function ( React ) {

  const settings = window.wc.wcSettings.getPaymentMethodData( 'depay_wc_payments' );

  if(settings) {

    const DePayPaymentBlockLabel = ({})=>{
      return(
        <>
          <div>{ settings.title }</div>
          <div style={{ flexGrow: "1", display: 'flex', justifyContent: 'end', paddingRight: '14px', paddingLeft: '14px' }}>
            { settings.blockchains.map((blockchain, index)=>{
              return(
                <img key={index} title={`Payments on #{blockchain}`} style={{ marginBottom: '2px', width: '28px', height: '28px' }} src={`${settings.pluginUrl}images/blockchains/${blockchain}.svg`} />
              )
            }) }
          </div>
        </>
      )
    }

    const DePayPaymentBlockContent = ({})=>{
      return(
        <>
          { settings.description &&
            <div>
              { settings.description }
            </div>
          }
        </>
      )
    }

    window.wc.wcBlocksRegistry.registerPaymentMethod({
      name: 'depay_wc_payments',
      label: Object( window.wp.element.createElement )( DePayPaymentBlockLabel, null ),
      ariaLabel: settings.title,
      content: Object( window.wp.element.createElement )( DePayPaymentBlockContent, null ),
      edit: Object( window.wp.element.createElement )( DePayPaymentBlockContent, null ),
      canMakePayment: ()=>{ return true },
      paymentMethodId: 'depay_wc_payments',
      supports: {
        features: ['products']
      }
    })
  }

  [
    'arbitrum',
    'avalanche',
    'base',
    'bsc',
    'ethereum',
    'fantom',
    'gnosis',
    'optimism',
    'polygon',
    'solana',
  ].forEach((blockchain)=>{

    const settings = window.wc.wcSettings.getPaymentMethodData( `depay_wc_payments_${blockchain}` );

    if(settings) {

      const DePayPaymentPerBlockchainBlockLabel = ({})=>{
        return(
          <>
            <div>{ settings.title }</div>
            <div style={{ flexGrow: "1", display: 'flex', justifyContent: 'end', paddingRight: '14px', paddingLeft: '14px' }}>
              <img title={`Payments on #{blockchain}`} style={{ marginBottom: '2px', width: '28px', height: '28px' }} src={`${settings.pluginUrl}images/blockchains/${blockchain}.svg`} />
            </div>
          </>
        )
      }

      const DePayPaymentPerBlockchainBlockContent = ({})=>{
        return(
          <>
            { settings.description &&
              <div>
                { settings.description }
              </div>
            }
          </>
        )
      }

      window.wc.wcBlocksRegistry.registerPaymentMethod({
        name: `depay_wc_payments_${blockchain}`,
        label: Object( window.wp.element.createElement )( DePayPaymentPerBlockchainBlockLabel, null ),
        ariaLabel: settings.title,
        content: Object( window.wp.element.createElement )( DePayPaymentPerBlockchainBlockContent, null ),
        edit: Object( window.wp.element.createElement )( DePayPaymentPerBlockchainBlockContent, null ),
        canMakePayment: ()=>{ return true },
        paymentMethodId: `depay_wc_payments_${blockchain}`,
        supports: {
          features: ['products']
        }
      })
    }

  });

})( window.React )
