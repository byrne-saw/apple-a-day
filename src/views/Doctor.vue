<template>
  <div class="doctor">
    <div class="container">
      <h1>Dr.{{ lastName }}'s Dashboard</h1>
      <b-button href="#"
                 variant="success">Create New Patient</b-button>
      <div style="height: 20px"></div> 
      <div>
        <b-card>
             <b-table striped hover :items="patients" :fields="fields"></b-table>
        </b-card>
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
      firstName: localStorage.firstName,
      lastName: localStorage.lastName,
      patients: [],
      fields: ['first_name', 'last_name', 'email', 'phone_number']

    };
  },
  created: function() {
    this.getPatients();
  },
  methods: {
    getPatients: function() {
      axios
        .get("http://localhost:3000/api/patients")
        .then(response => {
          this.patients = response.data;
        });
    }
  },
  computed: {}
};
</script>