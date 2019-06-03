

<template>
  <div class="login">
    <Row type="flex" justify="center">
      <div class="login-con">
        <Card icon="log-in" title="欢迎登录" :bordered="false">
          <div class="form-con">
            <login-form @on-success-valid="handleSubmit"></login-form>
            <p class="login-tip">输入用户名和密码即可</p>
          </div>
        </Card>
      </div>
    </Row>
    <Spin size="large" fix v-if="loading">
      <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
      <div>login ... </div>
    </Spin>
  </div>
</template>

<script>
  import LoginForm from './form/form'  
  import {
    mapActions
  } from 'vuex'
  export default {
    components: {
      LoginForm
    },
    data() {
      return {
        loading: false
      }
    },
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      handleSubmit({
        userName,
        userPwd
      }) {
        this.loading = true
        this.handleLogin({
          userName,
          userPwd
        }).then(res => {
          this.getUserInfo().then(res => {
            this.loading = false
            this.$router.push({
              name: this.$config.homeName
            })
          }).catch(e => {
            this.loading = false
            this.$Message.error(e)
          })
        }).catch(e => {
          this.$Message.error(e)
        })
      }
    }
  }
</script>
<style>

  @import './login.less';
  .ivu-spin-fix {
    background-color: hsla(0, 76%, 50%, 0) !important
  }

  .spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
