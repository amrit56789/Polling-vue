<template>
<nav>
    <router-link to="/signup"></router-link>
</nav>
<router-view />
</template>

<script>
export default {
    name: 'App',
    components: {}
}
</script>

<style>
body{
  background-color: #E2E4F4;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 20px;
}
</style>
