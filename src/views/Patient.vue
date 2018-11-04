<template>
  <div class="patient">
    <h1>Patient</h1>
    
    <div class="row">
      <div class="col"></div>
      <div class="col"></div>
      <div class="col">
       <b-table striped hover :items="blood_pressure_logs" :fields="fields"></b-table>
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
      fields: [ 'log_time', 'systolic', 'diastolic' ],
      blood_pressure_logs: []
    };
  },
  created: function() {
    axios
      .get("http://localhost:3000/api/blood_pressure_logs/recent", {
        params: {
          patient_id: null
        }
      })
      .then(response => {
        this.blood_pressure_logs = response.data;
      });
  },
  methods: {
    
  },
  computed: {}
};
</script>