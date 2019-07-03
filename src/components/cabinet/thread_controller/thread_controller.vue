<template>
  <div ref='appContainer' class='iframe-box' v-show='appState.iShow' v-if='appState.iActive'>
    <header class='hand-bar'>
      <div class='drag-handle' ref='dragHandle'></div>
      <ButtonGroup class='hand-btns'>
        <Button icon="ios-remove" @click='doMinimized(appItem)'></Button>
        <Button class='btn-close' icon="ios-close" @click='doClose(appItem)'></Button>
      </ButtonGroup>
    </header>
    <keep-alive>
        <iframe class='iframe-default' :src='appItem.href'></iframe>    
    </keep-alive>
  </div>
</template>
<script>
  // 使用iframe用作每个App的容器
  // 每个容器必须要实时获取App的尺寸，以调整自身的状态
  import {mapActions, mapMutations} from 'vuex';
  import Drag from '_pub/drag';

  export default {
    name: 'appContainer',
    data() {
      return {}
    },
    props: {
      appItem: {
        type: Object
      }
    },
    computed: {
      appState(){
        return this.appItem
      }
    },
    mounted() {
      this.$nextTick(() => {
        new Drag({dragBox: this.$refs.appContainer, dragHandle: this.$refs.dragHandle});
      });
    },
    methods: {
      ...mapActions(['doMinimized', 'doClose']),
    }
  }


</script>
<style rel="stylesheet/less" lang="less" scoped>
  .iframe-box {
    height: 75%;
    width: 20rem;
    position: fixed;
    top: 3rem;
    left: 50% - 20rem;
    border-radius: 4px;
    border: 0;
    box-shadow: 0px 0px 12px #211e1e;
  }

  .hand-bar {
    height: 6%;
    width: 100%;
    position: relative;
  }

  .iframe-default {
    height: 94%;
    width: 100%;
    border: 0;
    border-radius: 0 0 4px 4px;
    position: relative;
  }

  .hand-btns {
    float: right;
  }

  .hand-btns button {
    border-radius: 0;
    background: none;
    border: 0;
    color: #fff;
    outline: 0;
  }

  .hand-btns button:hover {
    background: rgba(197, 197, 197, 0.7);
  }

  .hand-btns button.btn-close:hover {
    background: rgba(253, 0, 0, 0.7);
  }

  .drag-handle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
</style> 

