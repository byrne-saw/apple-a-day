<template>
  <div class="bp-logs">
    <div class="container">
      
      <h1>{{ firstName }} {{ lastName }}'s Blood Pressure Logs</h1>
      
      <div>
        <b-card-group deck>
          <b-card>
            <b-table striped hover small outlined :items="bloodPressureLogs" :fields="fields"></b-table>
          </b-card>
        </b-card-group>
      </div>
    </div>  
  </div>
</template>

<style>
</style>

<script>
var axios = require('axios');

export default {
  data: function() {
    return {
      fields: ['log_time', 'systolic', 'diastolic'],
      bloodPressureLogs: [],
      firstName: localStorage.firstName,
      lastName: localStorage.lastName
    };
  },
  created: function() {
    axios
      .get('http://localhost:3000/api/blood_pressure_logs')
      .then(response => {
        this.bloodPressureLogs = response.data;
      });
  },
  methods: {},
  computed: {}
};
</script>