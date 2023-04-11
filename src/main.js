import { createApp } from 'vue'
// import Vue from 'vue'

import App from './App.vue'



import './style.scss';
// import '../snapshot-spaces/skins';

//import CSS custom and bootstrap
import './style/bootstrap.css'
import './style/style.css';
import setting from './setting';
window.setting = setting

// buffer module
import { Buffer } from 'buffer';
window.Buffer = Buffer;




import api from './api'
window.api = api
// router
import router from './router'
// store 
import store from './store/store'
import 'vue-universal-modal/dist/index.css';
import VueUniversalModal from 'vue-universal-modal';


import Toaster from "@meforma/vue-toaster";

import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

// Create and mount the root instance.
const app = createApp(App)
app.use(VueUniversalModal, {
    teleportTarget: '#modals',
  });
  app.use(VueLoading, {
    // props
    color: '#595959',
    loader: 'dots',
}, {
    // slots
})
app.use(Toaster, {
  // One of the options
  position: "top-right",
});
app.use(router).use(store).mount('#app')













// createApp(App).mount('#app')
// new Vue({
//     el: '#app',
//     router,
//     store,
//     render: h => h(App)
//   })
