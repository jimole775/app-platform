<template>
  <div id="app">
    <!--主要用于切换 login 和 展示平台-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted(){
    window.fillerWidth = 100
    const prevLoad = document.querySelector("#prevLoad")
    const loadingText = document.querySelector(".loadingText")
    loadingText.innerText = 'completion'
    setTimeout(function () {   // 给与1S的时间填充满                   
        prevLoad.style.opacity = 0
        setTimeout(function () {  // 给与时间fade-out 
            prevLoad.remove()
        }, 500)
    }, 1000)
  },
  created(){}
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
  min-height: 240px;
}
</style>
