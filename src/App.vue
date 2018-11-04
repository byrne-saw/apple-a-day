<template>
  <div id="app">
    
    <div class="header">
      <b-navbar toggleable="md" type="dark" variant="success">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <div>
          <!-- Image and text -->
          <b-navbar variant="faded" type="light">
            <b-navbar-brand href="#">
              <font-awesome-icon icon="apple-alt" />
              A Day
            </b-navbar-brand>
          </b-navbar>
        </div>

        <b-collapse is-nav id="nav_collapse">
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item href="#/">Home</b-nav-item>
            <b-nav-item href="#/Logout">Logout</b-nav-item>
            <b-nav-item-dropdown right>
              <!-- Using button-content slot -->
              <template slot="button-content">
                <em>Patient</em>
              </template>
              <b-dropdown-item href="#/Logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown right>
              <!-- Using button-content slot -->
              <template slot="button-content">
                <em>Doctor</em>
              </template>
              <b-dropdown-item href="#/Logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown right>
              <!-- Using button-content slot -->
              <template slot="button-content">
                <em>Admin</em>
              </template>
              <b-dropdown-item href="#/Logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>

          </b-navbar-nav>

        </b-collapse>
      </b-navbar>
      <!-- navbar-1.vue -->   
      <div style="height: 20px"></div> 
    </div>

    <div class="apple">
      <router-view/>
    </div>

    <footer class="footer">
      <div class="container">
        <span class="text-muted"> Copyright © 2018. Apple A Day by <a href="http://kingstudio.ro" target="_blank">AByrnesJaunt</a>. 
        <div style="height: 0px"></div> 
          All Rights Reserved.
        </span>
      </div>
    </footer>
  <!-- end app div -->
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*padding-bottom: 60px;*/
}

.apple {
  margin-bottom: 60px;
  
}

.footer {
    position: relative;
    bottom: 0;
    width: 100%;
    height: 60px;
    line-height: 30px;
    background-color: #f5f5f5;
}
</style>
