<template>
  <div class="doctor">
    <div class="container">
      <h1>Dr.{{ lastName }}'s Dashboard</h1>
      
      <div>
        <b-btn @click="modalShowNewPatient = !modalShowNewPatient" variant="success">Create New Patient</b-btn>
        <!-- Modal Component -->
        <b-modal id="modal-center" hide-footer centered title="Create New Patient" v-model="modalShowNewPatient">
          <form v-on:submit.prevent="addPatient()">
            <div class="row">
              <div class="col">
                <b-form-input v-model="newPatient.firstName"
                              type="text"
                              placeholder="First Name"></b-form-input>
              </div>
              <div class="col">
                <b-form-input v-model="newPatient.lastName"
                              type="text"
                              placeholder="Last Name"></b-form-input>
              </div>
            </div>
            <br>
            <div class="row">
              <div class="col">
                <b-form-input v-model="newPatient.phoneNumber"
                                  type="tel"
                                  placeholder="Phone Number"></b-form-input>
              </div>
              <div class="col">
                <b-form-input v-model="newPatient.email"
                                  type="email"
                                  placeholder="Email"></b-form-input>
              </div>
            </div>
            <br>
            <b-form-input v-model="newPatient.password"
                              type="password"
                              placeholder="Password"></b-form-input>
            <br>
            <b-form-input v-model="newPatient.passwordConfirmation"
                              type="password"
                              placeholder="Password Confirmation"></b-form-input>
            <br>
            <b-btn type="submit" class="btn btn-success my-1">Create New Patient</b-btn>
            <ul>
              <li class="text-danger" v-for="error in errors">{{ error }}</li>
            </ul>
          </form>
        </b-modal>
      </div>

      <div style="height: 20px"></div> 
      <div>
        <b-card>
           <b-table striped hover small outlined v-on:row-clicked="showModalPatientActions($event)" :items="patients" :fields="fields"></b-table>
        </b-card>
        
      </div>

      <div>
        <b-modal id="modal-center" hide-footer centered title="Patient Actions" v-model="modalShowPatientActions">
          <b-form-group label="Actions:">
                <b-form-radio-group id="btnradios2"
                                    buttons
                                    button-variant="outline-success"
                                    v-model="patientActions"
                                    :options="patientActionsOptions"
                                    name="radioBtnOutline" 
                                    @click.native="patientActionErrors = []"/>
          </b-form-group>
          
          <form v-on:submit.prevent="sendPatientMessage()" v-if="patientActions === 'message'">
            <p>Send Message to {{ clickedPatient.firstName }} {{ clickedPatient.lastName }}</p>
            <textarea class="form-control" v-model="patientMessage" rows="5"></textarea>
            <br>
            <div class="row">
              <div class="col-10"></div>
                <b-btn type="submit" class="btn btn-success my-1">Send</b-btn>
            </div>
          </form>



        </b-modal>
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
      },
      modalShowNewPatient: false,
      modalShowPatientActions: false,
      patientActions: 'message',
      patientActionsOptions: [
        { text: 'Message', value: 'message' },
        { text: 'Notifications', value: 'notification' },
        { text: 'Edit', value: 'edit' },
        { text: 'Delete', value: 'delete' }
      ],
      patientActionErrors: [],
      patientMessage: "",
      clickedPatient: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: ""
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
          this.modalShowNewPatient = !this.modalShowNewPatient;
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    showModalPatientActions: function(event) {
      this.modalShowPatientActions = !this.modalShowPatientActions;
      this.clickedPatient.firstName = event.first_name;
      this.clickedPatient.lastName = event.last_name;
      this.clickedPatient.phoneNumber = event.phone_number;
      this.clickedPatient.email = event.email;


    },
    sendPatientMessage: function() {
      var params = {
        message: this.patientMessage,
        phone_number: this.clickedPatient.phoneNumber
      };
      axios
        .post("http://localhost:3000/api/text", params)
        .then(cleanUp => {
          this.clickedPatient.firstName = "";
          this.clickedPatient.lastName = "";
          this.clickedPatient.phoneNumber = "";
          this.clickedPatient.email = "";
          this.patientMessage = "";
          this.modalShowPatientActions = !this.modalShowPatientActions;
        });
    },

  },
  computed: {}
};
</script>