import Vue from 'vue';
// import WebRTC from 'vue-webrtc';
import * as io from 'socket.io-client';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import '@/styles/index.scss';

window.io = io;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
