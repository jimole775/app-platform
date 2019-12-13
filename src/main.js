// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store/store'
import App from './app'
import router from './router'
import iView from 'iview'
import './styles/index.less'
import 'iview/dist/styles/iview.css'
// import vux from 'vux'

Vue.use(iView)
// Vue.use(vux)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
