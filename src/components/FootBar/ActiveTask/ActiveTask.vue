<template>
    <Badge dot>
        <Icon :type='this.icon' :size='this.size'></Icon>
    </Badge>
</template>

<script>
export default {
  name: 'ActiveTask',
  props:{
    icon:{
      type:String,
      default:'',
      required:true,
    },
    size:{
      type:Number,
      default:26,
    },    
  },
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
