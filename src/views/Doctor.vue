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
          <h5>{{ clickedPatient.firstName }} {{ clickedPatient.lastName }}:</h5>  
          <b-form-group>
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

          <form v-on:submit.prevent="updatePatient()" v-if="patientActions === 'edit'">
            <div class="row">
              <div class="col">
                First Name: <br><b-form-input v-model="editPatient.firstName"
                              type="text"
                              v-bind:value="clickedPatient.firstName"></b-form-input>
              </div>
              <div class="col">
                Last Name: <br><b-form-input v-model="editPatient.lastName"
                              type="text"
                              v-bind:value="clickedPatient.lastName"></b-form-input>
              </div>
            </div>
            <br>
            <div class="row">
              <div class="col">
                Phone Number: <br><b-form-input v-model="editPatient.phoneNumber"
                                  type="tel"
                                  v-bind:value="clickedPatient.phoneNumber"></b-form-input>
              </div>
              <div class="col">
                Email: <br><b-form-input v-model="editPatient.email"
                                  type="email"
                                  v-bind:value="clickedPatient.email"></b-form-input>
              </div>
            </div>
            <br>
            <div class="row">
              <div class="col"></div>
              <div class="col">
                <b-btn type="submit" class="btn btn-warning my-1">Update {{clickedPatient.firstName }} {{ clickedPatient.lastName }}</b-btn>
              </div>
            </div>
          </form>

          <div v-if="patientActions === 'notification'">
            <form v-on:submit.prevent="addNotifications()">
              <div class="row">
                <div class="col">
                  Notification Type: <br><b-form-select v-model="newNotification.notifyType" :options="newNotification.notifyTypeOptions" class="mb-3" />
                </div>
                <div class="col">
                  Notification Interval: <br><b-form-select v-model="newNotification.interval" :options="newNotification.intervalOptions" class="mb-3" />
                </div>
              </div>
              <br>
              <div class="row">
                <div class="col">
                  <switches v-model="newNotification.smsText"
                        text-enabled = "Text On:"
                        text-disabled = "Text Off:"
                        theme="bootstrap" 
                        color="success" 
                        type-bold="true"></switches>
                </div>
                <div class="col">
                  <div v-if="newNotification.smsText">
                    Hour to be texted: <br><b-form-select v-model="newNotification.textAt" :options="newNotification.textAtOptions" class="mb-3" />
                  </div>
                </div>
              </div>
              <br>

              <b-btn type="submit" class="btn btn-success my-1">Create New Notification</b-btn>
              <ul>
                <li class="text-danger" v-for="error in errors">{{ error }}</li>
              </ul>
            </form>
          </div>


          <div v-if="patientActions === 'delete'">
            <div style="height: 20px"></div>
            <p style="font-size:160%;">Are you <strong>sure</strong>?</p>    
            <div style="height: 20px"></div> 
            <b-btn class="mt-3" variant="outline-danger" block @click="deletePatient()">Delete {{clickedPatient.firstName }} {{ clickedPatient.lastName }}</b-btn>
            <div style="height: 20px"></div> 
          </div>

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
        id: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: ""
      },
      editPatient: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: ""
      },
      newNotification: {
        notifyType: "Blood Pressure",
        notifyTypeOptions: [
          { value: 'Blood Pressure', text: 'Blood Pressure' }
        ],
        interval: "24",
        intervalOptions: [
          { value: '24', text: 'Daily' },
          { value: '168', text: 'Weekly' }
        ], 
        smsText: false, 
        textAt: "9",
        textAtOptions: [
          { value: '5', text: '5am' },
          { value: '6', text: '6am' },
          { value: '7', text: '7am' },
          { value: '8', text: '8am' },
          { value: '9', text: '9am' },
          { value: '10', text: '10am' },
          { value: '11', text: '11am' },
          { value: '12', text: 'Noon' },
          { value: '13', text: '1pm' },
          { value: '14', text: '2pm' },
          { value: '15', text: '3pm' },
          { value: '16', text: '4pm' },
          { value: '17', text: '5pm' },
          { value: '18', text: '6pm' },
          { value: '19', text: '7pm' },
          { value: '20', text: '8pm' },
        ]
      }
    };
  },
  created: function() {
    this.getPatients();
  },
  methods: {
    getPatients: function() {
      axios
        .get("/api/patients")
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
        .post("/api/patients", params)
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
      this.clickedPatient.id = event.id;
      this.clickedPatient.firstName = event.first_name;
      this.clickedPatient.lastName = event.last_name;
      this.clickedPatient.phoneNumber = event.phone_number;
      this.clickedPatient.email = event.email;
      this.patientActions = 'message';
    },
    sendPatientMessage: function() {
      var params = {
        message: this.patientMessage + " ~ Dr. " + this.firstName + " " + this.lastName,
        phone_number: this.clickedPatient.phoneNumber
      };
      axios
        .post("/api/text", params)
        .then(cleanUp => {
          this.clickedPatient.id = "";
          this.clickedPatient.firstName = "";
          this.clickedPatient.lastName = "";
          this.clickedPatient.phoneNumber = "";
          this.clickedPatient.email = "";
          this.patientMessage = "";
          this.modalShowPatientActions = !this.modalShowPatientActions;
        });
    },
    updatePatient: function() {
      var params = {
        id: this.clickedPatient.id,
        first_name: this.editPatient.firstName,
        last_name: this.editPatient.lastName,
        phone_number: this.editPatient.phoneNumber,
        email: this.editPatient.email
      };
      axios
        .patch("/api/patients/" + this.clickedPatient.id, params)
        .then(cleanUp => {
          this.clickedPatient.id = "";
          this.clickedPatient.firstName = "";
          this.clickedPatient.lastName = "";
          this.clickedPatient.phoneNumber = "";
          this.clickedPatient.email = "";
          this.editPatient.firstName = "";
          this.editPatient.lastName = "";
          this.editPatient.phoneNumber = "";
          this.editPatient.email = "";
          this.getPatients();
          this.modalShowPatientActions = !this.modalShowPatientActions;
        });
    }, 
    deletePatient: function() {
      var params = {
        id: this.clickedPatient.id
      };
      axios
        .delete("/api/patients/" + this.clickedPatient.id, params)
        .then(cleanUp => {
          this.clickedPatient.id = "";
          this.clickedPatient.firstName = "";
          this.clickedPatient.lastName = "";
          this.clickedPatient.phoneNumber = "";
          this.clickedPatient.email = "";
          this.getPatients();
          this.modalShowPatientActions = !this.modalShowPatientActions;
        });
    }, 
    addNotifications: function() {
      var params = {
        patient_id: this.clickedPatient.id,
        notify_type:  this.newNotification.notifyType,
        interval: this.newNotification.interval,
        sms_text: this.newNotification.smsText,
        text_at: this.newNotification.textAt
      };
      axios
        .post("/api/notifications", params)
        .then(cleanUp => {
          this.clickedPatient.id = "";
          this.clickedPatient.firstName = "";
          this.clickedPatient.lastName = "";
          this.clickedPatient.phoneNumber = "";
          this.clickedPatient.email = "";
          this.modalShowPatientActions = !this.modalShowPatientActions;
        });
    }

  },
  computed: {}
};
</script>