<template>
  <div class="login">
    <div class="container">
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <form v-on:submit.prevent="submit()">
            <div class="form-group">
              <label>Email:</label>
              <input type="email" class="form-control" v-model="email">
            </div>
            <div class="form-group">
              <label>Password:</label>
              <input type="password" class="form-control" v-model="password">
            </div>
            <ul>
              <li class="text-danger" v-for="error in errors">{{ error }}</li>
            </ul>
            <input type="submit" class="btn btn-success" value="Login">
          </form>
        </div>
        <div class="col"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  template: "#login-page",
  data: function() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  created: function() {
    this.roleCheck();  
  },

  methods: {
    submit: function() {
      var params = {
        email: this.email,
        password: this.password
      };
      axios
        .post("/api/sessions", params)
        .then(response => {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("userId", response.data.user_id);
          localStorage.setItem("firstName", response.data.first_name);
          localStorage.setItem("lastName", response.data.last_name);

          this.roleCheck();
        })
        .catch(error => {
          this.errors = ["Invalid email or password."];
          this.email = "";
          this.password = "";
        });
    },
    roleCheck: function() {
      var role = localStorage.role;
      if (role === 'admin') {
        this.$router.push("/admin");
      } else if (role === 'doctor') {
        this.$router.push("/doctor");
      } else if (role === 'patient') {
        this.$router.push("/patient");
      }
    }
  }
};
</script>