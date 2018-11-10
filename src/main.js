import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from "axios";
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// fontawesome icon stuff
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAppleAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faAppleAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);
// end fontawesome icon stuff

// switch stuff
import Switches from 'vue-switches';
Vue.component('switches', Switches);

Vue.use(BootstrapVue);

var jwt = localStorage.getItem("jwt");
if (jwt) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
}


Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
