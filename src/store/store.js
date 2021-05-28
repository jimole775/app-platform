import Vuex from 'vuex'
import Vue from 'vue'
import storage from '@public/storage'
import emulationData from '@public/apps.info.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appInfo: storage.getItem('_appContainerModel') || emulationData,
    folder: {
      name: 'folder',
      type: 'system',
      iMinimized: false,
      iActived: false,
      iFocused: false,
      iTop: false,
      zIndex: 0,
      threadId: 0
    },
    threads: [],
    maxZIndex: 100,
  },
  mutations: {
    updateFolder (state, active) {
      state.folder.iActived = active
      state.folder.iFocused = active
      state.folder.iMinimized = !active
    },
    dropTransfer(state, cordinate) {
      // 交换位置，并存储到本地
      const dragItem = state.appInfo[cordinate.drag.y][cordinate.drag.x] || {}
      const dropItem = state.appInfo[cordinate.drop.y][cordinate.drop.x] || {}
      state.appInfo[cordinate.drop.y][cordinate.drop.x] = dragItem
      state.appInfo[cordinate.drag.y][cordinate.drag.x] = dropItem
      this.commit('appInfoUpdate', { items: state.appInfo.slice() })
    },
    appInfoUpdate(state, { items, version }) {
      state.appInfo = items
      if (version) state.appVersion = version
      storage.setItem('_appContainerModel', state.appInfo)
      if (version) storage.setItem('_appContainerModel_version', state.appVersion)
    },
    threadsDelete(state, position) {
      state.threads.splice(position, 1)
      this.commit('focusingLastActiveThread')
    },
    threadsCreate(state, thread) {
      thread.threadId = state.threads.length  
      thread.zIndex = thread.threadId
      state.threads.push(thread)
      this.commit('focusingLastActiveThread')
    },
    resetAppInfo(state) {
      state.appInfo.length = 0
    },
    resetThreads(state) {
      state.threads.length = 0
    },
    siblingBlur(state) {
      const threads = (state.threads || []).concat([state.folder])
      threads.forEach((loopItem) => {
        loopItem.iFocused = false
        loopItem.iTop = false
      })
    },
    focusingLastActiveThread(state) {
      const threads = (state.threads || []).concat([state.folder])
      if (threads.length > 0) {
        let len = threads.length
        while(len --) {
          const curThread = threads[len]
          if (curThread.iActived) {
            this.dispatch('doFocus', curThread)
            break
          }
        }
      }
    },
    sequeueLayer(state) {
      const threads = (state.threads || []).concat([state.folder])
      threads.forEach((threadItem, index) => {
        if (threadItem.iFocused) {
          threadItem.zIndex = state.maxZIndex
        } else {
          threadItem.zIndex = index
        }
      })
    }
  },
  actions: {
    doActivedFolder () {
      this.commit('updateFolder', true)
      this.commit('focusingLastActiveThread')
      this.commit('sequeueLayer')
    },
    doMinimizedFolder () {
      this.commit('updateFolder', false)
      this.commit('focusingLastActiveThread')
      this.commit('sequeueLayer')
    },
    doMinimized(store, threadItem) {
      threadItem.iActived = false
      threadItem.iMinimized = true
      threadItem.iFocused = false
      threadItem.iTop = false
      this.commit('focusingLastActiveThread')
      this.commit('sequeueLayer')
    },
    reActive(store, threadItem) {
      threadItem.iActived = true
      threadItem.iMinimized = false
      store.dispatch('doFocus', threadItem)
    },
    doFocus(store, threadItem) {
      this.commit('siblingBlur')
      threadItem.iFocused = true
      threadItem.iTop = true
      this.commit('sequeueLayer')
    },
    doClose(store, threadItem) {
      // 加一个延迟，操作感比较真实
      setTimeout(() => {
        threadItem.iStarted = false
        threadItem.iActived = false
        threadItem.iMinimized = false
        threadItem.iDestoryed = true
        threadItem.iFocused = false
        threadItem.iTop = false
        let whillDestoryPosition = 0
        let isEmptyThread = true
        this.state.threads.forEach((loopItem, loopIndex)=>{
          if(loopItem.threadId === threadItem.threadId){
            whillDestoryPosition = loopIndex
            isEmptyThread = false
          }
        })
        if (isEmptyThread) this.commit('resetThreads')
        else this.commit('threadsDelete', whillDestoryPosition)
      }, 150)
    },
    doActive(store, threadItem) {
      if (threadItem.href) {
        // 为了远程项目可以开两个相同线程进行测试
        const cloneItem = JSON.parse(JSON.stringify(threadItem))
        cloneItem.iStarted = true
        cloneItem.iActived = true
        cloneItem.iMinimized = false
        cloneItem.iDestoryed = false
        this.commit('threadsCreate', cloneItem)
      }
    }
  },
  modules: {}
})
