<template>
    <Button type="info" ghost @click='activeApp($event)'>
        <Icon :type='this.icon' :size='this.size'></Icon>
    </Button>
</template>

<script>
// TODO 使用sortable进行拖拽管理
// sortable的主要任务就是，实现拖拽的触发，动画，完成回调
export default {
  name: 'ActiveTask',
  props:{
    icon:{
      type:String,
      default:'',
    },
    size:{
      type:Number,
      default:26,
    },    
  },
  data () {
    return {
    }
  },
  methods:{
    activeApp(e){
        console.log('is hover on this element',e);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
