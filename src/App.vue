<template>
  <nav class="bg-blue-500 p-4 text-white shadow-md mb-3">
      <div class="container mx-auto flex justify-between items-center">
          <div> 
              <h1 class="text-xl">Polling App</h1>
          </div>
          <div class="flex justify-end mr-10 text-xl">
              <router-link to="/signup" class="text-white hover:text-blue-200 mr-4">SignUp</router-link>
              <router-link to="/login" class="text-white hover:text-blue-200">Login</router-link>
          </div>
      </div>
  </nav>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  components: {}
}
</script>
<style>
body{
  background-color: #e3e4eb;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
