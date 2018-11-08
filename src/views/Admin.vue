<template>
  <div class="admin">
    <div class="container">
      <h1>{{ firstName }} {{ lastName }}'s Admin Dashboard</h1>

      <div>
        <b-btn @click="modalShow = !modalShow" variant="success">Create New User</b-btn>
        <!-- Modal Component -->
        <b-modal id="modal-center" hide-footer centered title="Create New User" v-model="modalShow">
          <form v-on:submit.prevent="addWhichType()">
            <b-form-group label="Type of user:">
                  <b-form-radio-group id="btnradios2"
                                      buttons
                                      button-variant="outline-success"
                                      v-model="userType"
                                      :options="userTypeOptions"
                                      name="radioBtnOutline" 
                                      @click.native="patientErrors = []"/>
            </b-form-group>

            <div v-if="userType === 'patient'">
              <b-form-select @click.native="patientErrors = []" v-model="doctorSelected" :options="doctorOptions" class="mb-3" />
            </div>

            <div class="row">
              <div class="col">
                <b-form-input v-model="newUser.firstName"
                              type="text"
                              placeholder="First Name"></b-form-input>
              </div>
              <div class="col">
                <b-form-input v-model="newUser.lastName"
                              type="text"
                              placeholder="Last Name"></b-form-input>
              </div>
            </div>
            <br>
            <div class="row">
              <div class="col">
                <b-form-input v-model="newUser.phoneNumber"
                                  type="tel"
                                  placeholder="Phone Number"></b-form-input>
              </div>
              <div class="col">
                <b-form-input v-model="newUser.email"
                                  type="email"
                                  placeholder="Email"></b-form-input>
              </div>
            </div>
            <br>
            <b-form-input v-model="newUser.password"
                              type="password"
                              placeholder="Password"></b-form-input>
            <br>
            <b-form-input v-model="newUser.passwordConfirmation"
                              type="password"
                              placeholder="Password Confirmation"></b-form-input>
            <br>
            <b-btn type="submit" class="btn btn-success my-1">Create New Patient</b-btn>
            <ul>
              <li class="text-danger" v-for="error in errors">{{ error }}</li>
              <li class="text-danger" v-for="error in patientErrors">{{ error }}</li>
            </ul>
          </form>
        </b-modal>
      </div>
      
      <div style="height: 20px"></div> 
      <div>
        <b-card title="Admins">
         <b-table striped hover :items="admins" :fields="fields"></b-table>
        </b-card>
        <b-card title="Doctors">
         <b-table striped hover :items="doctors" :fields="fields"></b-table>
        </b-card>
        <b-card title="Patients">
         <b-table striped hover :items="patients" :fields="fieldsPatients"></b-table>
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
      fields: ['first_name', 'last_name', 'email', 'phone_number'],
      fieldsPatients: ['doctor', 'first_name', 'last_name', 'email', 'phone_number'],
      admins: [],
      doctors: [],
      patients: [],
      newUser: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        passwordConfirmation: ""
      },
      modalShow: false,
      errors: [],
      patientErrors: [],
      userType: 'patient',
      userTypeOptions: [
        { text: 'Patient', value: 'patient' },
        { text: 'Doctor', value: 'doctor' },
        { text: 'Admin', value: 'admin' }
      ],
      doctorSelected: null,
      doctorOptions: []
    };
  },
  created: function() {
    this.getPatients();
    this.getDoctors();
    this.getAdmins();
    this.doctorsDropDown();
  },
  methods: {
    getPatients: function() {
      axios
        .get("http://localhost:3000/api/patients")
        .then(response => {
          this.patients = response.data;
        });
    },
    getDoctors: function() {
      axios
        .get("http://localhost:3000/api/doctors")
        .then(response => {
          this.doctors = response.data;
        });
    },
    getAdmins: function() {
      axios
        .get("http://localhost:3000/api/admins")
        .then(response => {
          this.admins = response.data;
        });
    },
    addAdmin: function() {
      var params = {
        first_name: this.newUser.firstName,
        last_name: this.newUser.lastName,
        phone_number: this.newUser.phoneNumber,
        email: this.newUser.email,
        password: this.newUser.password,
        password_confirmation: this.newUser.passwordConfirmation
      };
      axios
        .post("http://localhost:3000/api/admins", params)
        .then(cleanUp => {
          this.errors = [];
          this.newUser.firstName = "";
          this.newUser.lastName = "";
          this.newUser.phoneNumber = "";
          this.newUser.email = "";
          this.newUser.password = "";
          this.newUser.passwordConfirmation = "";
          this.getAdmins();
          this.modalShow = !this.modalShow;
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    addDoctor: function() {
      var params = {
        first_name: this.newUser.firstName,
        last_name: this.newUser.lastName,
        phone_number: this.newUser.phoneNumber,
        email: this.newUser.email,
        password: this.newUser.password,
        password_confirmation: this.newUser.passwordConfirmation
      };
      axios
        .post("http://localhost:3000/api/doctors", params)
        .then(cleanUp => {
          this.errors = [];
          this.newUser.firstName = "";
          this.newUser.lastName = "";
          this.newUser.phoneNumber = "";
          this.newUser.email = "";
          this.newUser.password = "";
          this.newUser.passwordConfirmation = "";
          this.getDoctors();
          this.modalShow = !this.modalShow;
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    addPatient: function() {
      var params = {
        first_name: this.newUser.firstName,
        last_name: this.newUser.lastName,
        phone_number: this.newUser.phoneNumber,
        email: this.newUser.email,
        password: this.newUser.password,
        password_confirmation: this.newUser.passwordConfirmation,
        doctor_id: this.doctorSelected
      };
      axios
        .post("http://localhost:3000/api/patients", params)
        .then(cleanUp => {
          this.errors = [];
          this.newUser.firstName = "";
          this.newUser.lastName = "";
          this.newUser.phoneNumber = "";
          this.newUser.email = "";
          this.newUser.password = "";
          this.newUser.passwordConfirmation = "";
          this.getPatients();
          this.modalShow = !this.modalShow;
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    }, 
    addWhichType: function() {
      this.patientErrors = [];
      if (this.userType === 'patient') {
        if (this.doctorSelected === null) {
          this.patientErrors.push("Please select a doctor"); //I want to break if this is true
        }
        this.addPatient();
      } else if (this.userType === 'doctor') {
        this.addDoctor();
      } else if (this.userType === 'admin') {
        this.addAdmin();
      }
    },
    doctorsDropDown: function() {
      axios
        .get("http://localhost:3000/api/doctors_info_list")
        .then(response => {
          this.doctorOptions = response.data;
        });
    }
  },
  computed: {}
};
</script>