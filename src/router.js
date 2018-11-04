import Vue from 'vue';
import Router from 'vue-router';

import Login from "./views/Login.vue";
import Logout from "./views/Logout.vue";
import Admin from "./views/Admin.vue";
import Doctor from "./views/Doctor.vue";
import Patient from "./views/Patient.vue";

import BloodPressureLogsIndex from "./views/BloodPressureLogsIndex.vue";

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', name: 'root', component: Login},

    { path: "/login", name: "login", component: Login },
    { path: "/logout", name: "logout", component: Logout },

    { path: "/admin", name: "admin", component: Admin },
    { path: "/patient", name: "patient", component: Patient },
    { path: "/doctor", name: "doctor", component: Doctor },

    { path: "/bloodpressurelogsindex", name: "bp-logs", component: BloodPressureLogsIndex }

  ]
});
