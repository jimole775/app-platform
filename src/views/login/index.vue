

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
  import LoginForm from './form/index'  
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
<style rel="stylesheet/less" lang="less" scoped>

  /* @import './login.less'; */
  .ivu-spin-fix {
    background-color: hsla(0, 76%, 50%, 0) !important
  }

  .spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  .login{
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    position: relative;
    &-con{
        position: absolute;
        top: 50%;
        transform: translateY(-60%);
        width: 300px;
        &-header{
            font-size: 16px;
            font-weight: 300;
            text-align: center;
            padding: 30px 0;
        }
        .form-con{
            padding: 10px 0 0;
        }
        .login-tip{
            font-size: 10px;
            text-align: center;
            color: #c3c3c3;
        }
    }
  }
</style>
