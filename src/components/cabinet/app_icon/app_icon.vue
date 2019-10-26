<template>
    <Button type="info" ghost @dblclick.native="doActive(appItem)" class="app-icon-container">
      <img 
      v-show="appItem.href" 
      :src="appItem.favicon" 
      draggable="true"
      :width="size" 
      :height="size">
    </Button>
</template>

<script>

import {mapActions,mapMutations} from 'vuex';
// TODO 使用sortable进行拖拽管理
// sortable的主要任务就是，实现拖拽的触发，动画，完成回调
export default {
  name: 'AppIcon',
  props:{
    size:{
      type: Number,
      default: 26,
    },  
    appItem:{
      type: Object,
      default: {} 
    }  
  },
  data () {
    return {
    }
  },
  methods:{
    ...mapActions(['doActive'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .app-icon-container{
    padding: 0;
    line-height: 0;
  }
</style>
