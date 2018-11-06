<template>
  <div class="doctor">
    <div class="container">
      <h1>Dr.{{ lastName }}'s Dashboard</h1>
      
      <div>
        <b-btn v-b-modal.modal-center variant="success">Create New Patient</b-btn>

        <!-- Modal Component -->
        <b-modal id="modal-center" hide-footer centered title="Create New Patient">
          <form v-on:submit.prevent="addPatient()">
              <b-form-input v-model="newPatient.firstName"
                                type="text"
                                placeholder="First Name"></b-form-input>
              <br>
              <b-form-input v-model="newPatient.lastName"
                                type="text"
                                placeholder="Last Name"></b-form-input>
              <br>
              <b-form-input v-model="newPatient.phoneNumber"
                                type="text"
                                placeholder="Phone Number"></b-form-input>
              <br>
              <b-form-input v-model="newPatient.email"
                                type="text"
                                placeholder="Email"></b-form-input>
              <br>
              <b-form-input v-model="newPatient.password"
                                type="text"
                                placeholder="Password"></b-form-input>
              <br>
              <b-form-input v-model="newPatient.passwordConfirmation"
                                type="text"
                                placeholder="Password Confirmation"></b-form-input>
              <br>
                           
              <button type="submit" class="btn btn-success my-1">Create New Patient</button>
              <ul>
                <li class="text-danger" v-for="error in errors">{{ error }}</li>
              </ul>

          </form>

        </b-modal>
      </div>

      

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
      fields: ['first_name', 'last_name', 'email', 'phone_number'],
      holder: "",
      errors: [],
      newPatient: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        passwordConfirmation: ""
      }

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
    },
    addPatient: function() {
      var params = {
        first_name: this.newPatient.firstName,
        last_name: this.newPatient.lastName,
        phone_number: this.newPatient.phoneNumber,
        email: this.newPatient.email,
        password: this.newPatient.password,
        password_confirmation: this.newPatient.passwordConfirmation
      };
      axios
        .post("http://localhost:3000/api/patients", params)
        .then(cleanUp => {
          this.errors = [];
          this.newPatient.firstName = "";
          this.newPatient.lastName = "";
          this.newPatient.phoneNumber = "";
          this.newPatient.email = "";
          this.newPatient.password = "";
          this.newPatient.passwordConfirmation = "";
          this.getPatients();
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    }
  },
  computed: {}
};
</script>