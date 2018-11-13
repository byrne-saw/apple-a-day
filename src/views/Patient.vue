<template>
  <div class="patient">
    <div class="container">
      
      <div v-if="alertShow">
        <b-alert show dismissible variant="danger">
          {{ alertMessage }}
        </b-alert>
      </div>

      <h1>{{ firstName }} {{ lastName }}'s Dashboard</h1>
            
      <div>
        <b-card-group deck>
          <b-card title="Add a Blood Pressure Reading">
            <form v-on:submit.prevent="addBloodPressureLog()">
                <b-form-input v-model="newBpLog.systolic"
                                  type="text"
                                  placeholder="Systolic"></b-form-input>
                <br>
                <b-form-input v-model="newBpLog.diastolic"
                                  type="text"
                                  placeholder="Diastolic"></b-form-input>
                <br>
                <b-form-input v-model="newBpLog.logDate"
                                  type="date"
                                  v-bind:value="currentDateTime.setDate"></b-form-input> 
                <br>
                <b-form-input v-model="newBpLog.logHourMin"
                                  type="time"
                                  v-bind:value="currentDateTime.setTime"></b-form-input>
                <br>                  
                <button type="submit" class="btn btn-success my-1">Add Blood Pressure Reading</button>
                <div class="row">
                  <div class="col"></div>  
                    <ul>
                      <li class="text-danger" v-for="error in errors">{{ error }}</li>
                    </ul>
                  <div class="col"></div>  
                </div>

            </form>
          </b-card>
          <b-card title= "Five Recent Blood Pressure Readings">
             <b-table striped hover outlined v-on:row-clicked="showModal($event)" :items="bloodPressureLogs" :fields="fields"></b-table>
             <b-button href="#/bloodpressurelogsindex"
                        variant="success">All Blood Pressure Readings</b-button>
          </b-card>
        </b-card-group>
      </div>
      
      <div>

        <b-modal id="modal-center" hide-footer centered title="Edit Blood Pressure Reading" v-model="modalShow">
          <h1>{{ bpLog }}</h1>

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
      alertShow: false,
      alertMessage: "",
      modalShow: false,
      bpLog: [],
      fields: ['log_time', 'systolic', 'diastolic'],
      bloodPressureLogs: [],
      errors:[],
      firstName: localStorage.firstName,
      lastName: localStorage.lastName,
      newBpLog: {
        systolic: "", 
        diastolic: "",
        logDate: "",
        logHourMin: ""
      },
      currentDateTime: {
        today: "",
        dd: "",
        mm: "",
        yyyy: "",
        hh: "",
        min: "",
        setDate: "",
        setTime: ""
      }
    };
  },
  created: function() {
    this.setCurrentDateTime();
    this.fiveRecentBP();
    this.checkAlerts();
  },
  methods: {
    showModal: function(event) {
      this.modalShow = !this.modalShow;
      // this.bpLog = item;
      console.log(event["id"]);
    },
    addBloodPressureLog: function() {
      var params = {
        systolic: this.newBpLog.systolic,
        diastolic: this.newBpLog.diastolic,
        log_date: this.newBpLog.logDate,
        log_hour_min: this.newBpLog.logHourMin
      };
      axios
        .post("/api/blood_pressure_logs", params)
        .then(cleanUp => {
          this.errors = [];
          this.newBpLog.systolic = "";
          this.newBpLog.diastolic = "";
          this.newBpLog.logDate = "";
          this.newBpLog.logHourMin = "";
          this.fiveRecentBP();
          this.checkAlerts();
          this.setCurrentDateTime();
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    fiveRecentBP: function() {
      axios
        .get("/api/blood_pressure_logs/recent", {
          params: {
            patient_id: null
          }
        })
        .then(response => {
          this.bloodPressureLogs = response.data;
        });
    },
    checkAlerts: function() {
      axios
        .get("/api/alert")
        .then(response => {
          this.alertMessage = response.data.message;
          if (this.alertMessage !== "") {
            this.alertShow = true;
          } else {
            this.alertShow = false;
          }
        });
    },
    setCurrentDateTime: function() {
      this.currentDateTime.today = new Date();
      this.currentDateTime.dd = this.currentDateTime.today.getDate();
      this.currentDateTime.mm = this.currentDateTime.today.getMonth() + 1;
      this.currentDateTime.yyyy = this.currentDateTime.today.getFullYear();
      this.currentDateTime.hh = this.currentDateTime.today.getHours();
      this.currentDateTime.min = this.currentDateTime.today.getMinutes();
      if (this.currentDateTime.dd < 10) {
        this.currentDateTime.dd = '0' + this.currentDateTime.dd;
      }
      if (this.currentDateTime.mm < 10) {
        this.currentDateTime.mm = '0' + this.currentDateTime.mm;
      }
      if (this.currentDateTime.hh < 10) {
        this.currentDateTime.hh = '0' + this.currentDateTime.hh;
      }
      if (this.currentDateTime.min < 10) {
        this.currentDateTime.min = '0' + this.currentDateTime.min;
      }
      this.currentDateTime.setDate = this.currentDateTime.yyyy + '-' + this.currentDateTime.mm + '-' + this.currentDateTime.dd;
      this.currentDateTime.setTime = this.currentDateTime.hh + ':' + this.currentDateTime.min;
      this.newBpLog.logDate = this.currentDateTime.setDate;
      this.newBpLog.logHourMin = this.currentDateTime.setTime;
    }
  },
  computed: {}
};
</script>