<template>
  <Row>
    <Col span="1" v-for='app in apps' :key='app.id'>
        <ActiveTask :icon='app.icon' :size='app.size'></ActiveTask>
    </Col>

    <Col span="1">
        <Button>
            <Icon type="ios-notifications-outline" size="26"></Icon>
        </Button>
    </Col>
  </Row>
</template>

<script>
import ActiveTask from './ActiveTask/ActiveTask';
export default {
  name: 'FootBar',
  data () {
    return {
      apps: [
        {
          icon:'ios-desktop',
          size:26,
          id:1,
        },
        {
          icon:'ios-cube',
          size:26,
          id:2,      
        },
      ]
    }
  },
  components:{
    ActiveTask
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
