!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";!function(){jQuery((function(e){e(document).ajaxError((function(){"function"==typeof window._depayUnmountLoading&&window._depayUnmountLoading()})),e(document).ajaxComplete((function(){"function"==typeof window._depayUnmountLoading&&window._depayUnmountLoading()})),e("form.woocommerce-checkout").on("submit",(async()=>{if(e("form.woocommerce-checkout").serialize().match("payment_method=depay_wc_payments")){let{unmount:e}=await DePayWidgets.Loading({text:"Loading payment data..."});setTimeout(e,1e4)}}))}));const e=async()=>{if(window.location.hash.startsWith("#wc-depay-checkout-")){let e=window.location.hash.match(/wc-depay-checkout-(.*?)@/)[1],t=JSON.parse(await wp.apiRequest({path:`/depay/wc/checkouts/${e}`,method:"POST"}));DePayWidgets.Payment({accept:t,fee:{amount:"1.5%",receiver:"0x9Db58B260EfAa2d6a94bEb7E219d073dF51cc7Bb"},closed:()=>{window.location.hash="",window.jQuery("form.woocommerce-checkout").removeClass("processing").unblock()},before:()=>{let e=window.location.host;return!(e.match(/^localhost/)||e.match(/\.local$/)||e.match(/\.local\:/)||e.match(/127\.0\.0\.1/)||e.match(/0\.0\.0\.0/)||e.match(/0:0:0:0:0:0:0:1/)||e.match(/::1/))||(window.alert("Payments can not be tested in local development! Make sure to test in a deployed environment where payment validation callbacks can reach your server!"),!1)},track:{method:t=>new Promise(((o,a)=>{wp.apiRequest({path:`/depay/wc/checkouts/${e}/track`,method:"POST",data:t}).done((e=>o({status:200}))).fail(((e,t)=>a(t)))})),poll:{method:async()=>{let t=fetch("/index.php?rest_route=/depay/wc/release",{method:"POST",body:JSON.stringify({checkout_id:e}),headers:{"Content-Type":"application/json"}});if(200==t.status){return await t.json()}}}}})}};document.addEventListener("DOMContentLoaded",e),window.addEventListener("hashchange",e)}()}));
