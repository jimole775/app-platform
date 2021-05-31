<template>
  <div
    class="iframe-box"
    v-if="threadItem.iStarted"
    v-show="threadItem.iActived"
    :ref="`appContainer${threadItem.threadId}`"
    :style="{zIndex: threadItem.zIndex}"
    @mousedown="doFocus(threadItem)"
  >
    <header class="hand-bar">
      <div class="drag-handle" ref="dragHandle"></div>
      <ButtonGroup class="hand-btns">
        <Button icon="ios-remove" @click.native="doMinimized(threadItem)"></Button>
        <Button class="btn-close" icon="ios-close" @click.native="doClose(threadItem)"></Button>
      </ButtonGroup>
    </header>
    <keep-alive>
      <slot />
    </keep-alive>
  </div>
</template>
<script>
  // 使用iframe用作每个App的容器
  // 每个容器必须要实时获取App的尺寸，以调整自身的状态
  import {mapActions, mapMutations} from 'vuex'
  import Drag from '@public/drag'
  export default {
    name: 'appContainer',
    data() {
      return {
      }
    },
    props: {
      threadItem: {
        type: Object,
        default: {}
      }
    },
    computed: {
      // appState(){
      //   return this.threadItem
      // }
    },
    mounted() {
      this.$nextTick(async () => {
        const ref = await this.$refs[`appContainer${this.threadItem.threadId}`]
        new Drag({dragBox: ref, dragHandle: this.$refs.dragHandle, hasEdge: false})
        this.appendCompToRoot(ref)
      })
    },
    methods: {
      ...mapActions(['doMinimized', 'doClose', 'doFocus']),
      appendCompToRoot(component) {
        document.body.appendChild(component)
      }
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
    box-shadow: 0px 0px 6px rgba(0,0,0,0.3);
  }

  .hand-bar {
    height: 6%;
    width: 100%;
    position: relative;
    min-height: 28px;
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

