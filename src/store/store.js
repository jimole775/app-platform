import Vuex from 'vuex'
import Vue from 'vue'
import storage from '_pub/Storage'
import emulationData from '_pub/Apps.info.json'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appInfo: storage.getItem('_appContainerModel') || emulationData,
    threads: []
  },
  mutations: {
    dropTransfer(store, cordinate) {
      // 交换位置，并存储到本地
      const dragItem = this.state.appInfo[cordinate.drag.y][cordinate.drag.x] || {}
      const dropItem = this.state.appInfo[cordinate.drop.y][cordinate.drop.x] || {}
      this.state.appInfo[cordinate.drop.y][cordinate.drop.x] = dragItem
      this.state.appInfo[cordinate.drag.y][cordinate.drag.x] = dropItem
      this.commit('appInfoUpdate', this.state.appInfo.slice())
    },
    appInfoUpdate(store, newInfo) {
      this.state.appInfo = newInfo
      storage.setItem('_appContainerModel', this.state.appInfo)
    },
    threadsDelete(store, position) {
      this.state.threads.splice(position, 1, {})
    },
    threadsUpdate(store, thread) {
      thread.threadId = this.state.threads.length  
      this.state.threads.push(thread)
    },
    resetAppInfo(store) {
      this.state.appInfo.length = 0
    },
    resetThreads() {
      this.state.threads.length = 0
    }
  },
  actions: {
    doMinimized(store, threadItem) {
      threadItem.iShow = false
    },
    doExtend(store, threadItem) {
      threadItem.iShow = true
    },
    doClose(store, threadItem) {
      // 加一个延迟，操作感比较真实
      setTimeout(()=>{
        threadItem.iActive = false
        threadItem.iShow = false
        let whillDestoryPosition = 0
        let isEmptyThread = true
        this.state.threads.forEach((threadItem, loopIndex)=>{
          if(threadItem.threadId === threadItem.threadId){
            whillDestoryPosition = loopIndex
            isEmptyThread = false
          }
        })
        if (isEmptyThread) this.commit('resetThreads')
        else this.commit('threadsDelete', whillDestoryPosition)
      },150) 
    },
    doActive(store, threadItem) {
      if(threadItem.href){    
        // 为了远程项目可以开两个线程进行测试
        const cloneItem = JSON.parse(JSON.stringify(threadItem))
        cloneItem.iActive = true
        cloneItem.iShow = true
        this.commit('threadsUpdate', cloneItem)
      }
    }
  },
  modules: {}
});


