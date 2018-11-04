<template>
  <div class="patient">
    <div class="container">
      
      <h1>{{ firstName }} {{ lastName }}'s Dashboard</h1>
      
      

    <div>
      <b-card-group deck>
        <b-card title ="Add a Blood Pressure Log">
          <form>
              <b-form-input v-model="systolic"
                                type="text"
                                placeholder="Systolic"></b-form-input>
              <br>
              <b-form-input v-model="diastolic"
                                type="text"
                                placeholder="Diastolic"></b-form-input>
              <br>
              <b-form-input v-model="bpLogDate"
                                type="date"
                                placeholder=""></b-form-input>
              <br>
              <b-form-input v-model="bpLogTime"
                                type="time"
                                placeholder=""></b-form-input>
              <br>                  
              <button type="submit" class="btn btn-success my-1">Submit</button>

          </form>
        </b-card>

        <b-card title= "5 Recent Blood Pressure Logs">
           <b-table striped hover :items="bloodPressureLogs" :fields="fields"></b-table>
           <b-button href="#"
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
      firstName: localStorage.firstName,
      lastName: localStorage.lastName,
      systolic: "",
      diastolic: "",
      bpLogDate: "",
      bpLogTime: ""

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
        this.bloodPressureLogs = response.data;
      });
  },
  methods: {
    
    
  },
  computed: {}
};
</script>