<template>
  <Row>
    <Col span="1">
        <Badge dot>
            <Icon type="ios-notifications-outline" size="26"></Icon>
        </Badge>
    </Col>
    <Col span="1"> 
    <Badge dot>
    <Icon type="ios-notifications-outline" size="26"></Icon>
        </Badge>
        </Col>
    <Col span="1"> <Badge dot>
       <Icon type="ios-notifications-outline" size="26"></Icon>
        </Badge></Col>
    <Col span="1"> <Badge dot>
      <Icon type="ios-notifications-outline" size="26"></Icon>
        </Badge></Col>
  </Row>
</template>

<script>
export default {
  name: 'FootBar',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
