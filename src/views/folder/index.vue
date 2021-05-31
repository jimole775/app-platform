<template>
  <ThreadController 
    v-if="folder.iStarted"
    class="folder-box"
    :threadItem="folder"
  >
    <div class="folder-box-default">dasdasdasd</div>
  </ThreadController>
  <!-- <header class="hand-bar">
    <div class="drag-handle" ref="dragHandle"></div>
    <ButtonGroup class="hand-btns">
      <Button icon="ios-remove" @click.native="doMinimized(folder)" />
      <Button class="btn-close" icon="ios-close" @click.native="doClose(folder)" />
    </ButtonGroup>
  </header>
  <keep-alive>
    <div class="folder-box-default">dasdasdasd</div>
  </keep-alive> -->
</template>
<script>
  // 使用iframe用作每个App的容器
  // 每个容器必须要实时获取App的尺寸，以调整自身的状态
  import {mapActions, mapMutations} from 'vuex'
  import ThreadController from "@comp/thread_controller/index"
  // import Drag from '@public/drag'
  export default {
    name: 'Folder',
    components: {
      ThreadController
    },
    data() {
      return {
        dragger: null
      }
    },
    // watch: {
    //   'folder.iActived': {
    //     handler (iActived) {
    //       if (iActived === true && !this.dragger) {
    //         this.dragger = new Drag({dragBox: this.$refs.FolderRef, dragHandle: this.$refs.dragHandle, hasEdge: false})
    //       }
    //     },
    //     immediate: true
    //   }
    // },
    computed: {
      // appState(){
      //   return this.threadItem
      // },
      folder () {
        return this.$store.state.folder
      }
    },
    mounted () {
      // this.$nextTick(async () => {
      //   await this.$refs.FolderRef
      //   new Drag({dragBox: this.$refs.FolderRef, dragHandle: this.$refs.dragHandle, hasEdge: false})
      // })
    },
    methods: {
      ...mapActions(['doMinimized', 'doClose', 'doFocus'])
    }
  }
</script>
<style rel="stylesheet/less" lang="less" scoped>
  .folder-box {
    height: 75%;
    width: 80%;
    position: fixed;
    top: 3rem;
    left: 10%;
    border-radius: 4px;
    border: 0;
    box-shadow: 0px 0px 6px rgba(0,0,0,0.3);
  }

  .hand-bar {
    height: 6%;
    width: 100%;
    position: relative;
    min-height: 28px;
  }

  .folder-box-default {
    height: 94%;
    width: 100%;
    border: 0;
    border-radius: 0 0 4px 4px;
    position: relative;
    background: #fff;
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

