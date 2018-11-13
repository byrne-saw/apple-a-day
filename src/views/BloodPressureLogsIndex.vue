<template>
  <div class="bp-logs">
    <div class="container">
      
      <h1>{{ firstName }} {{ lastName }}'s Blood Pressure Logs</h1>
      
      <div>
        <b-card-group deck>
          <b-card>
            <b-table striped hover small outlined v-on:row-clicked="showModalBpLog($event)" :items="bloodPressureLogs" :fields="fields"></b-table>
          </b-card>
        </b-card-group>
      </div>
      
      <div>
        <b-modal id="modal-center" hide-footer centered title="Edit Blood Pressure Reading" v-model="modalShow">
            <b-form-group>
                <b-form-radio-group id="btnradios2"
                                    buttons
                                    button-variant="outline-success"
                                    v-model="updateDelete"
                                    :options="updateDeleteOptions"
                                    name="radioBtnOutline" 
                                    @click.native="patientErrors = []"/>
              <div style="height: 20px"></div> 
            </b-form-group>
            <form v-on:submit.prevent="updateBpLog()" v-if="updateDelete === 'update'">
              <b-form-input v-model="editBpLog.systolic"
                                type="text"
                                v-bind:value="clickedBpLog.systolic"></b-form-input>
              <br>
              <b-form-input v-model="editBpLog.diastolic"
                                type="text"
                                v-bind:value="clickedBpLog.diastolic"></b-form-input>
              <br>
              <b-form-input v-model="editBpLog.logDate"
                                type="date"
                                v-bind:value="currentDateTime.setDate"></b-form-input> 
              <br>
              <b-form-input v-model="editBpLog.logHourMin"
                                type="time"
                                v-bind:value="currentDateTime.setTime"></b-form-input>
              <br>                  
              <div class="row">
                <div class="col"></div>  
                  <ul>
                    <li class="text-danger" v-for="error in errorsBP">{{ error }}</li>
                  </ul>
                <div class="col"></div>  
              </div>
              <button type="submit" class="btn btn-success my-1">Add Blood Pressure Reading</button>
            </form>

            <div v-if="updateDelete === 'delete'">
              <div style="height: 20px"></div>
              <p style="font-size:160%;">Are you <strong>sure</strong>?</p>    
              <div style="height: 20px"></div> 
              <b-btn class="mt-3" variant="outline-danger" block @click="deleteDpLog()">Delete Blood Pressure Reading {{ clickedBpLog.systolic }} over {{ clickedBpLog.diastolic }}</b-btn>
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
      fields: ['log_time', 'systolic', 'diastolic'],
      bloodPressureLogs: [],
      firstName: localStorage.firstName,
      lastName: localStorage.lastName,
      modalShow: false,
      errorsBP:[],
      editBpLog: {
        id: "",
        systolic: "", 
        diastolic: "",
        logDate: "",
        logHourMin: ""
      },
      clickedBpLog: {
        id: "",
        systolic: "", 
        diastolic: ""
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
      },
      updateDelete: "update",
      updateDeleteOptions: [
        { text: 'Update', value: 'update' },
        { text: 'Delete', value: 'delete' },
      ]
    };
  },
  created: function() {
    this.setCurrentDateTime();
    axios
      .get('/api/blood_pressure_logs')
      .then(response => {
        this.bloodPressureLogs = response.data;
      });
  },
  methods: {
    showModalBpLog: function(event) {
      this.setCurrentDateTime();
      this.modalShow = !this.modalShow;
      this.updateDelete = "";
      this.updateDelete = "update";
      this.clickedBpLog.id = event.id;
      this.clickedBpLog.systolic = event.systolic;
      this.clickedBpLog.diastolic = event.diastolic;
    },
    updateBpLog: function() {
      var params = {
        id: this.clickedBpLog.id,
        systolic: this.editBpLog.systolic,
        diastolic: this.editBpLog.diastolic,
        log_date: this.editBpLog.logDate,
        log_hour_min: this.editBpLog.logHourMin
      };
      axios
        .patch("/api/blood_pressure_logs/" + this.clickedBpLog.id, params)
        .then(cleanUp => {
          this.clickedBpLog.systolic = "";
          this.clickedBpLog.diastolic = "";
          this.clickedBpLog.logDate = "";
          this.clickedBpLog.logHourMinog = "";
          this.editBpLog.id = "";
          this.editBpLog.systolic = "";
          this.editBpLog.diastolic = "";
          this.editBpLog.logDate = "";
          this.editBpLog.logHourMinog = "";
          this.modalShow = !this.modalShow;
        })
        .catch(error => {
          this.errorsBP = error.response.data.errors;
        });
    },
    deleteDpLog: function() {
      var params = {
        id: this.clickedBpLog.id
      };
      axios
        .delete("/api/blood_pressure_logs/" + this.clickedBpLog.id, params)
        .then(cleanUp => {
          this.editBpLog.id = "";
          this.clickedBpLog.systolic = "";
          this.clickedBpLog.diastolic = "";
          this.clickedBpLog.logDate = "";
          this.clickedBpLog.logHourMinog = "";
          this.modalShow = !this.modalShow;
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

      this.editBpLog.logDate = this.currentDateTime.setDate;
      this.editBpLog.logHourMin = this.editBpLog.setTime;
    }    
  },
  computed: {}
};
</script>