const replace = require('replace-in-file')
const prompt = require('prompt')
const package = require('./package.json')
const openExplorer = require('open-file-explorer')

console.log(`Enter new version (current version ${package.version})`)
prompt.start()
prompt.get(['version'], async (err, result)=> {
  if(!result.version) { return }
  if(!result.version.match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/)){
    console.log('WRONG VERSION FROMAT (see: https://semver.org)')
    return
  }
  
  await replace({ files: './package.json', from: `"version": "${package.version}",`, to: `"version": "${result.version}",`})
  await replace({ files: './readme.txt', from: `Stable tag: ${package.version}`, to: `Stable tag: ${result.version}`})
  await replace({ files: './readme.txt', from: `== Changelog ==`, to: `== Changelog ==\n\n= ${result.version} =\n*`})
  await replace({ files: './depay-woocommerce-payments.php', from: `* Version: ${package.version}`, to: `* Version: ${result.version}`})
  await replace({ files: './depay-woocommerce-payments.php', from: `define( 'DEPAY_CURRENT_VERSION', '${package.version}' );`, to: `define( 'DEPAY_CURRENT_VERSION', '${result.version}' );`})
  await replace({ files: './languages/depay-woocommerce-payments.pot', from: `Project-Id-Version: DePay WooCommerce Payments ${package.version}`, to: `Project-Id-Version: DePay WooCommerce Payments ${result.version}`})

  console.log('Dont forget to add a changelog entry to readme.txt')
  openExplorer('./readme.txt')
})

