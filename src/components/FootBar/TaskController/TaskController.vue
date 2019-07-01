<template>
    <Button @click='visibleSwitch(taskItem)'>
        <img :src="taskItem.favicon" :width="22" :height="22">
    </Button>
</template>

<script>
import {mapActions} from 'vuex';

export default {
  name: 'TaskController',
  props: {
    taskItem: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions(['doExtend','doMinimized']),   
    visibleSwitch(taskItem) {
      if(taskItem.iShow) {
        this.doMinimized(taskItem)
      }else{
        this.doExtend(taskItem)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
