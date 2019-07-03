<template>
  <div id="app">
    <!--主要用于切换 login 和 展示平台-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>


<style>
#app,html,body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height:100%;
  width:100%;  
}
</style>
