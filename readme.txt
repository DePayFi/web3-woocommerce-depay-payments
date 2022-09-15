=== WooCommerce Web3 Payments by DePay - Accept P2P Crypto Donations ===
Contributors: depayfi
Tags: woocommerce,  payment, web3, depay, cryptocurrency
Requires at least: 5.8
Tested up to: 6.0
Requires PHP: 7.0
Stable tag: 1.4.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Web3 Payments directly into your own wallet. P2P crypto payments with on-the-fly conversion.

== Description ==
**Web3 Payments directly into your own wallet.**

A WooCommerce plugin for P2P cryptocurrency payments on multiple blockchains.

[youtube https://www.youtube.com/watch?v=bc1sPOnlGyk]

= Features =
> 📌 Check out the [live demo](https://web3woocommerce.xyz "WooCommerce Plugin for Crypto Web3 Payments (live demo) by DePay").

* **Wallet-to-wallet**: Middleman-free P2P payments.
* **Multichain**: Your customers can perform payments on various blockchains.
* **On-the-fly conversion**: 100% decentralized token conversion via decentralized liquidity pools such as Uniswap, PancakeSwap etc. 
* **Configure incoming tokens**: Receive the tokens you want, while letting your customers pay with tokens they hold.
* **Open-source**: You can find our [WooCommerce Web3 Payment Plugin on GitHub](https://github.com/DePayFi/web3-woocommerce-depay-payments).
* **Custom CSS**: Customize the look of your payment widget with your own theme/CSS.

= Supported wallets =
Your customers can send you Web3 Payments using the most popular crypto wallets:

* Metamask
* Coinbase Wallet
* 100+ additional wallets via [WalletConnect](https://walletconnect.com), **for example**:
  * Trust Wallet
  * DeFi Wallet by crypto.com
  * 1inch Wallet
  * imToken Wallet
  * TokenPocket
  * Pillar
  * Math Wallet
  * Ledger Live
  * Argent Wallet
  * AlphaWallet
  * Unstoppable Wallet
  * Atomic Wallet
  * Rainbow 
  * (...)

= Supported blockchains =
* Ethereum
* BNB Chain (previously "Binance Smart Chain")
* Polygon
* Solana (soon)

= Pricing =

1.5% transaction fee.

= About DePay = 
> [DePay](https://depay.com) pioneers Web3 Payments with the power of DeFi. 
> Driving mass adoption of blockchain-based payments, DePay merges the core ideas of decentralization and interoperability with state-of-the-art Web3 technologies.
> The first truly decentralized multichain payment protocol built on DeFi. ETHOnline finalist, made in Switzerland (Crypto Valley).

🤝 Do you want to integrate the DePay payment protocol into your own plugin or project? [We are happy to give you support](https://depay.com/documentation#support).

== Installation ==

[youtube https://www.youtube.com/watch?v=bc1sPOnlGyk]

-> [How to Accept Web3 Payments on WooCommerce](https://depay.com/how-to/accept-web3-cryptocurrency-donations-on-wordpress-3kmut5La6fMFiv7lHCfaeF)

❤️ The DePay community is [here for you](https://depay.com/documentation#support) in case you need additional support.

== Frequently Asked Questions ==

= What does "P2P" mean? =
Another term we like to use is "wallet-to-wallet".
When someone sends you a crypto payment through your WooCommerce Shop via DePay, it goes directly from your customers's wallet to your own wallet (this is referred to by the term "peer-to-peer" or "P2P"). There are no intermediaries in between, but smart contracts. These ensure that the payer can pay with any token on supported blockchains, whereupon the tokens are converted into the ones you want to receive.

= What are "Web3 Payments"? =
Building on the idea that "Web3" is the next generation of a blockchain-based and therefore decentralized Internet, "Web3 payments" are a new type of P2P payments. Besides being decentralized and peer-to-peer, they are also characterized by being "permissionless" and not requiring you to trust ("trustless") in centralized entities such as intermediaries. Furthermore, Web3 payments are censorship-resistant. "Open source" code can often be an indicator of Web3 technologies. Read more: [What are Web3 Payments?](https://depay.com/web3-payments).

= How does "on-the-fly" conversion work? =
* You configure which tokens you want to receive (e.g. USDT, BUSD) per blockchain
* Your customers pay with any token they currently have in their wallets (e.g. ETH or any other token)
* Once a transaction is sent, DePay's smart contracts convert the sender token (via decentralized liquidity pools such as Uniswap) into the tokens you have configured to be received. The payments arrive directly in your own wallet after the real-time conversion.

== Screenshots ==

1. Performing a Web3 Payment with DePay.
...

== Changelog ==

= 1.4.0 =
* adds payload to payment validations

= 1.3.4 =
* fix: prevent unnecessary price updates in the payment widget

= 1.3.3 =
* fix loading transactions (admin)

= 1.3.2 =
* fix loading public key

= 1.3.1 =
* Improves php syntax (fixes lint issues)

= 1.3.0 =
* Upgrade DePay widgets to v17.6.2

= 1.2.2 =
* Fixes admin table for transactions

= 1.2.1 =
* Fixed onboarding task list for payments (ensure DePay setup)

= 1.2.0 =
* Allow wc admins to confirm payments manually

= 1.1.1 =
* Security update: No ' in SQL

= 1.1.0 =
* Adds payment validation polling for resilient payment validation release

= 1.0.1 =
* Security update: Safe SQL

= 1.0.0 =
* First Version
