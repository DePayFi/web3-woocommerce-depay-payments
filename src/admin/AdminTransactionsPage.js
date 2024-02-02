import Blockchains from "@depay/web3-blockchains"

const { useState, useEffect, useRef } = window.React
const { Fragment } = window.wp.element
const { Dropdown } = window.wp.components
const { TableCard, FilterPicker } = window.wc.components
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
const getCurrentSearch = ()=>{
  return window.location.search.match(/search=(\w+)/) ? window.location.search.match(/search=(\w+)/)[1] : ''
}

let currentRequest

const TableSearch = (props)=>{

  const [search, setSearch] =  useState(getCurrentSearch())

  return(
    <div className="woocommerce-select-control woocommerce-search is-searchable">
      <label className="components-base-control woocommerce-select-control__control empty">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="woocommerce-select-control__control-icon" aria-hidden="true" focusable="false"><path d="M13.5 6C10.5 6 8 8.5 8 11.5c0 1.1.3 2.1.9 3l-3.4 3 1 1.1 3.4-2.9c1 .9 2.2 1.4 3.6 1.4 3 0 5.5-2.5 5.5-5.5C19 8.5 16.5 6 13.5 6zm0 9.5c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"></path></svg>
        <div className="components-base-control__field">
          <input
            autocomplete="off"
            className="woocommerce-select-control__control-input" id="woocommerce-select-control-0__control-input"
            type="text"
            placeholder="Search by order, transaction or sender"
            value={search}
            onChange={(event)=>{
              props.onQueryChange( 'search' )( event.target.value, '' )
              setSearch(event.target.value)
            }}
          />
        </div>
      </label>
    </div>
  )
}

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
    search: getCurrentSearch()
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
      search: getCurrentSearch(),
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
        search: getCurrentSearch(),
      }
    })
    currentRequest.then((response)=>{
      setAnyTransactions(response.total > 0)
      setSummary([{ value: response.total, label: getCurrentPaymentsFilter() === 'attempts' ? "Attempts" : "Transactions" }])
      setRows(transactionsToRows(response))
      setTotalRows(response.total)
      setIsLoading(false)
      return response
    })
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
            return(
              <button onClick={ onToggle } type="button" title="Choose which charts to display" aria-expanded="false" className="components-button woocommerce-ellipsis-menu__toggle">
                <svg className="gridicon gridicons-ellipsis" height="24" width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M7 12a2 2 0 11-4.001-.001A2 2 0 017 12zm12-2a2 2 0 10.001 4.001A2 2 0 0019 10zm-7 0a2 2 0 10.001 4.001A2 2 0 0012 10z"></path></g></svg>
              </button>
            )
          }}
          renderContent={ () => (
            <div role="menu" aria-orientation="vertical" className="woocommerce-ellipsis-menu__content">
              { transaction.status !== 'SUCCESS' &&
                <button 
                  onClick={()=>{
                    if(confirm("Are you sure you want to mark this transaction as succeeded and the order as paid?")) {
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
              }
              <button 
                onClick={()=>{
                  if(confirm("Are you sure you want to delete this transaction?")) {
                    wp.apiRequest({
                      path: "/depay/wc/transaction",
                      method: 'DELETE',
                      data: { id: transaction.id }
                    }).always(()=>window.location.reload(true))
                  }
                }}
                type="button" role="menuitem" tabindex="0" className="woocommerce-ellipsis-menu__item" style={{ minWidth: "200px" }}
              >
                <svg style={{ height: "16px", width: "16px", position: "relative", top: "2px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M24 18h2v16h-2z"/><path d="M28 18h2v16h-2z"/><path d="M12 12h26v2H12z"/><path d="M30 12h-2v-1c0-.6-.4-1-1-1h-4c-.6 0-1 .4-1 1v1h-2v-1c0-1.7 1.3-3 3-3h4c1.7 0 3 1.3 3 3v1z"/><path d="M31 40H19c-1.6 0-3-1.3-3.2-2.9l-1.8-24 2-.2 1.8 24c0 .6.6 1.1 1.2 1.1h12c.6 0 1.1-.5 1.2-1.1l1.8-24 2 .2-1.8 24C34 38.7 32.6 40 31 40z"/></svg>
                <span style={{ display: "inline-block", padding: "6px" }}>Delete Transaction</span>
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
        setRows(transactionsToRows(transactionsData))
        setTotalRows(transactionsData.total)
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
      <div style={{ marginLeft: '-12px', paddingBottom: '12px', display: 'flex' }}>
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
        <a
          style={{ marginTop: '38px' }}
          className="components-button is-secondary"
          href="https://app.depay.com"
          target="_blank"
        >
          Export CSV
          <svg style={{ marginLeft: "6px" }} className="gridicon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="16px" height="16px"><path d="M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z"/></svg>
        </a>
      </div>
      <div
        className="woocommerce-report-table__scroll-point"
        ref={ scrollPointRef }
        aria-hidden
      />
      <TableCard
        className={ 'woocommerce-report-table' }
        title={ "Transactions" }
        query={ query }
        actions={ [
          <TableSearch
            onQueryChange={ onQueryChange }
          />
        ] }
        headers={ filteredHeaders }
        isLoading={ isLoading }
        showMenu={ false }
        rows={ rows }
        onQueryChange={ onQueryChange }
        rowsPerPage={ getCurrentPerPage() }
        summary={ summary }
        totalRows={ totalRows }
        hasSearch={true}
      />
    </Fragment>
  )
}
