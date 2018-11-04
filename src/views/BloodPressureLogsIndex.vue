<template>
  <div class="bp-logs">
    <h1>Blood Pressure Logs</h1>
  </div>
</template>

<style>
</style>

<script>
var axios = require('axios');

export default {
  data: function() {
    return {
      bp_logs: []
    };
  },
  created: function() {
    axios
    .get('http://localhost:3000/api/blood_pressure_logs')
    .then(response => {

    });
  },
  methods: {},
  computed: {}
};
</script>