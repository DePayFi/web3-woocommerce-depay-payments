import Blockchains from "@depay/web3-blockchains"

const { useState, useEffect, useRef } = window.React
const { Fragment } = window.wp.element
const { Dropdown } = window.wp.components
const { Button, TableCard, FilterPicker } = window.wc.components
const { onQueryChange } = window.wc.navigation
const getCurrentPage = ()=>{
  return window.location.search.match(/paged=(\d+)/) ? window.location.search.match(/paged=(\d+)/)[1] : 1
}
const getCurrentPerPage = ()=>{
  return window.location.search.match(/per_page=(\d+)/) ? window.location.search.match(/per_page=(\d+)/)[1] : 25
}
const getCurrentOrderBy = ()=>{
  return window.location.search.match(/orderby=(\w+)/) ? window.location.search.match(/orderby=(\w+)/)[1] : 'created_at'
}
const getCurrentOrder = ()=>{
  return window.location.search.match(/order=(\w+)/) ? window.location.search.match(/order=(\w+)/)[1] : 'desc'
}
const getCurrentPaymentsFilter = ()=>{
  return window.location.search.match(/payments=(\w+)/) ? window.location.search.match(/payments=(\w+)/)[1] : 'completed'
}
let currentRequest

export default function(props) {

  const [ rows, setRows ] = useState()
  const [ anyTransactions, setAnyTransactions ] = useState()
  const [ totalRows, setTotalRows ] = useState()
  const [ isLoading, setIsLoading ] = useState(true)
  const [ query, setQuery ] = useState({
    paged: getCurrentPage(),
    per_page: getCurrentPerPage(),
    orderby: getCurrentOrderBy(),
    order: getCurrentOrder(),
    payments: getCurrentPaymentsFilter(),
  })
  const [ summary, setSummary ] = useState()
  const scrollPointRef = useRef()
  const [ filteredHeaders, setFilteredHeaders ] = useState([
    {
      label: 'Created at',
      key: 'created_at',
      required: true,
      isSortable: true,
    },
    {
      label: 'Status',
      key: 'status',
      required: true,
      isSortable: true,
    },
    {
      label: 'Order',
      key: 'order_id',
      required: true,
      isSortable: true,
    },
    {
      label: 'Blockchain',
      key: 'blockchain',
      required: true,
      isSortable: true,
    },
    {
      label: 'Transaction',
      key: 'transaction_id',
      required: true,
      isSortable: true,
    },
    {
      label: 'Sender',
      key: 'sender_id',
      required: true,
      isSortable: true,
    },
    {
      label: 'Receiver',
      key: 'receiver_id',
      required: true,
      isSortable: true,
    },
    {
      label: 'Amount',
      key: 'amount',
      required: true,
      isSortable: true,
    },
    {
      label: 'Token',
      key: 'token_id',
      required: true,
      isSortable: true,
    },
    {
      label: 'Confirmed by',
      key: 'confirmed_by',
      required: true,
      isSortable: true,
    },
    {
      label: 'Confirmed at',
      key: 'confirmed_at',
      required: true,
      isSortable: true,
    },
    {
      label: '',
      key: 'menu',
      required: true,
      isSortable: false,
    },
  ])

  const fetchTransactionsData = ()=> {
    if(currentRequest && !currentRequest.status && currentRequest.abort) { currentRequest.abort() }
    setIsLoading(true)
    setQuery({
      paged: getCurrentPage(),
      per_page: getCurrentPerPage(),
      orderby: getCurrentOrderBy(),
      order: getCurrentOrder(),
      payments: getCurrentPaymentsFilter(),
    })
    currentRequest = wp.apiRequest({
      path: `/depay/wc/transactions`,
      method: 'GET',
      data: {
        limit: getCurrentPerPage(),
        page: getCurrentPage(),
        orderby: getCurrentOrderBy(),
        order: getCurrentOrder(),
        payments: getCurrentPaymentsFilter(),
      }
    })
    currentRequest.then((response)=>{ setIsLoading(false); return response })
    return currentRequest
  }

  const onPushState = (event)=>{
    setTimeout(() => {
     fetchTransactionsData().then((transactionsData)=>setRows(transactionsToRows(transactionsData)))
    }, 1)
  }

  const onPopState = (event)=>{
    setTimeout(() => {
     fetchTransactionsData().then((transactionsData)=>setRows(transactionsToRows(transactionsData)))
    }, 1)
  }

  const transactionsToRows = (transactionsData)=>{
    return(transactionsData.transactions.map((transaction)=>[
      { display: (new Date(transaction.created_at)).toLocaleString(), value: (new Date(transaction.created_at)).toLocaleString() },
      { display: <div>{ (['PENDING', 'VALIDATING'].includes(transaction.status)) && <div>ATTEMPT<br/></div> }<div>{transaction.status}</div>{transaction.failed_reason && <div>{transaction.failed_reason}</div>}</div>, value: transaction.status },
      { display: <a target="blank" rel="noopener noreferrer" href={`/wp-admin/edit.php?s=${transaction.order_id}&post_status=all&post_type=shop_order&action=-1&m=0&_customer_user&paged=1&action2=-1`}>{transaction.order_id}</a>, value: transaction.order_id },
      { display: transaction.blockchain, value: transaction.blockchain },
      { display: <a target="blank" rel="noopener noreferrer" href={Blockchains[transaction.blockchain].explorerUrlFor({transaction: transaction.transaction_id})}>{transaction.transaction_id}</a>, value: transaction.transaction_id },
      { display: <a target="blank" rel="noopener noreferrer" href={Blockchains[transaction.blockchain].explorerUrlFor({address: transaction.sender_id})}>{transaction.sender_id}</a>, value: transaction.sender_id },
      { display: <a target="blank" rel="noopener noreferrer" href={Blockchains[transaction.blockchain].explorerUrlFor({address: transaction.receiver_id})}>{transaction.receiver_id}</a>, value: transaction.receiver_id },
      { display: transaction.amount, value: transaction.amount },
      { display: <a target="blank" rel="noopener noreferrer" href={Blockchains[transaction.blockchain].explorerUrlFor({token: transaction.token_id})}>{transaction.token_id}</a>, value: transaction.token_id },
      { display: transaction.confirmed_by, value: transaction.confirmed_by },
      { display: (transaction.confirmed_at !== '1000-01-01 00:00:00' ? (new Date(transaction.confirmed_at)).toLocaleString() : ''), value: (new Date(transaction.confirmed_at)).toLocaleString() },
      { display: <Dropdown
          renderToggle={({isOpen, onToggle})=>{
            if(transaction.status == 'SUCCESS') { return null }
            return(
              <button onClick={ onToggle } type="button" title="Choose which charts to display" aria-expanded="false" className="components-button woocommerce-ellipsis-menu__toggle">
                <svg className="gridicon gridicons-ellipsis" height="24" width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M7 12a2 2 0 11-4.001-.001A2 2 0 017 12zm12-2a2 2 0 10.001 4.001A2 2 0 0019 10zm-7 0a2 2 0 10.001 4.001A2 2 0 0012 10z"></path></g></svg>
              </button>
            )
          }}
          renderContent={ () => (
            <div role="menu" aria-orientation="vertical" className="woocommerce-ellipsis-menu__content">
              <button 
                onClick={()=>{
                  if(confirm("This transaction will be marked as succeeded and the order will be marked as paid!")) {
                    wp.apiRequest({
                      path: "/depay/wc/confirm",
                      method: 'POST',
                      data: { id: transaction.id }
                    }).always(()=>window.location.reload(true))
                  }
                }}
                type="button" role="menuitem" tabindex="0" className="woocommerce-ellipsis-menu__item" style={{ minWidth: "200px" }}
              >
                <svg style={{ height: "16px", width: "16px", position: "relative", top: "2px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                <span style={{ display: "inline-block", padding: "6px" }}>Confirm Manually</span>
              </button>
            </div>
          ) }
        />, value: null },
    ]))
  }

  useEffect(()=>{
    wp.api.loadPromise.then(() => {
      const settings = new wp.api.models.Settings()
      Promise.all([
        settings.fetch(),
        fetchTransactionsData()
      ]).then(([settings, transactionsData])=>{
        if(
          !settings.depay_wc_receiving_wallet_address &&
          !settings.depay_wc_accepted_payments &&
          !settings.depay_wc_tokens
        ) {
          window.location.search = '?page=wc-admin&path=%2Fdepay%2Fsettings'
        }
        setAnyTransactions(transactionsData.total > 0)
        setSummary([{ value: transactionsData.total, label: "Transactions" }])
        setTotalRows(transactionsData.total)
        setRows(transactionsToRows(transactionsData))
        setIsLoading(false)
      })
    })
  }, [])

  useEffect(()=>{
    window.addEventListener('pushstate', onPushState)
    return ()=>window.removeEventListener('pushstate', onPushState)
  }, [])

  useEffect(()=>{
    window.addEventListener('popstate', onPopState)
    return ()=>window.removeEventListener('popstate', onPopState)
  }, [])

  return(
    <Fragment>
      <div style={{ marginLeft: '-12px', paddingBottom: '12px' }}>
        <h2 class="screen-reader-text">Filters</h2>
        <FilterPicker
          query={query}
          config={{
            label: '',
            param: 'payments',
            defaultValue: 'completed',
            staticParams: [],
            showFilters: ()=>true,
            filters: [
              { label: 'Completed payments', value: 'completed' },
              { label: 'Payment attempts', value: 'attempts'  },
            ]
          }}
        />
      </div>
      <div
        className="woocommerce-report-table__scroll-point"
        ref={ scrollPointRef }
        aria-hidden
      />
      <TableCard
        className={ 'woocommerce-report-table' }
        title={"Transactions"}
        query={query}
        actions={[]}
        headers={ filteredHeaders }
        isLoading={ isLoading }
        showMenu={ false }
        rows={ rows }
        onQueryChange={ onQueryChange }
        rowsPerPage={ getCurrentPerPage() }
        summary={ summary }
        totalRows={ totalRows }
      />
    </Fragment>
  )
}
