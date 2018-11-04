<template>
  <div class="patient">
    <div class="container">
      
      <h1>{{ firstName }} {{ lastName }}'s Dashboard</h1>
            
      <div>
        <b-card-group deck>
          <b-card title="Add a Blood Pressure Log">
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
                                  placeholder=""></b-form-input>
                <br>
                <b-form-input v-model="newBpLog.logTime"
                                  type="time"
                                  placeholder=""></b-form-input>
                <br>                  
                <button type="submit" class="btn btn-success my-1">Add Blood Pressure Log</button>
                <ul>
                  <li class="text-danger" v-for="error in errors">{{ error }}</li>
                </ul>

            </form>
          </b-card>

          <b-card title= "Five Recent Blood Pressure Logs">
             <b-table striped hover :items="bloodPressureLogs" :fields="fields"></b-table>
             <b-button href="#/bloodpressurelogsindex"
                        variant="success">All Blood Pressure Logs</b-button>
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
      errors:[],
      firstName: localStorage.firstName,
      lastName: localStorage.lastName,
      newBpLog: {
        systolic: "", 
        diastolic: "",
        logDate: "",
        logTime: ""
      }
    };
  },
  created: function() {
    this.fiveRecentBP();
  },
  methods: {
    addBloodPressureLog: function() {
      var params = {
        systolic: this.newBpLog.systolic,
        diastolic: this.newBpLog.diastolic,
        log_date: this.newBpLog.logDate,
        log_time: this.newBpLog.logTime
      };
      axios
        .post("http://localhost:3000/api/blood_pressure_logs", params)
        .then(cleanUp => {
          this.errors = [];
          this.newBpLog.systolic = "";
          this.newBpLog.diastolic = "";
          this.newBpLog.logDate = "";
          this.newBpLog.logTime = "";
          this.fiveRecentBP();
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    fiveRecentBP: function() {
      axios
        .get("http://localhost:3000/api/blood_pressure_logs/recent", {
          params: {
            patient_id: null
          }
        })
        .then(response => {
          this.bloodPressureLogs = response.data;
        });
    }
    
  },
  computed: {}
};
</script>