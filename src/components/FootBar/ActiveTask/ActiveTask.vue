<template>
    <Button @click='minimzReplenish()'>
        <Badge dot>
            <Icon :type='this.icon' :size='this.size'></Icon>
        </Badge>
    </Button>
</template>

<script>
import {mapActions} from 'vuex';

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
  },
  methods:{
    ...mapActions(['doMinimized','reverseMinimized']),
    minimzReplenish(){
      if(this.$store.state.minimizedState){
        this.reverseMinimized();
      }else{
        this.doMinimized();
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
