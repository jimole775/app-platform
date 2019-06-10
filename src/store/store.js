import Vuex from 'vuex';
import Vue from 'vue';
import storage from '_pub/Storage'; 
import emulationData from '_pub/Apps.info.json';
Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        appInfo:storage.getItem('_appContainerModel') || emulationData
    },
    mutations:{
        appInfoUpdate(state,newInfo){
            console.log('appInfo update:',newInfo);
            this.state.appInfo = newInfo;
            storage.setItem('_appContainerModel',this.state.appInfo);
        }, 
        dropTransfer(state,cordinate){
            // 交换位置，并存储到本地
            const dragItem = this.state.appInfo[cordinate.drag.y][cordinate.drag.x] || {};
            const dropItem = this.state.appInfo[cordinate.drop.y][cordinate.drop.x] || {};
            this.state.appInfo[cordinate.drop.y][cordinate.drop.x] = dragItem;
            this.state.appInfo[cordinate.drag.y][cordinate.drag.x] = dropItem;
            this.commit('appInfoUpdate',this.state.appInfo.slice());
        },
        resetAppInfo(state){
            this.state.appInfo = [];
        }
    },
    actions:{  
       
    },
    modules:{

    }
});


