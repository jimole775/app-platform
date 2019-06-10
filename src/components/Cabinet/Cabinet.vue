<template>
   
    <div ref='_cabinet' @dragstart='drag($event)' @drop='drop($event)' @dragover='allowDrop($event)'>    
       
        <Row v-for='(rowItem,key) in renderIcons' :key='key'>      
            <Col span='1' v-for='(colItem,colKey) in rowItem' :style='iconStyle' :key='colKey'>
                <AppIcon :icon='colItem.favicon' :iframeHref='colItem.href' draggable='true'>
                </AppIcon>
            </Col>
        </Row>

        <Button ref='_iconConsult' type="info" style='position:fixed;top:0;left:-9999px;opacity:0'>
            <!--当前元素只是作用计算屏幕容量的-->
            <Icon type="ios-disc" />
        </Button>

        <div v-for='app in appActiveds'>
            <AppContainer :show='app.iShow' :if='app.isActive'></AppContainer>
        </div>

    </div>
</template>

<script>

import AppContainer from '_comps/Cabinet/AppContainer/AppContainer';
import {mapMutations} from 'vuex';
import emulationData from '_pub/Apps.info.json';
import AppIcon from '_comps/Cabinet/AppIcon/AppIcon';
import util from '_pub/Util';
import storage from '_pub/Storage';

export default {
  name: 'Cabinet',
  components:{AppIcon,AppContainer},
  data () {
    return {
        // appInfo:storage.getItem('_appContainerModel') || emulationData,
        appActiveds:[],
        iconStyle:{
            height:'',
            width:''
        },
        cordinate:{
            drag:{x:0,y:0},
            drop:{x:0,y:0},
        }
        // dragCordinate:{x:0,y:0},
        // dropCordinate:{x:0,y:0},
    }
  },
  props:{
      parentBox:{
          type:Object
      }
  },
  methods:{
      ...mapMutations(['appInfoUpdate','dropTransfer','resetAppInfo']),
      drag(e){
        let target = e.target;        
        this.cordinate.drag = this.countCordinate(target);
      },
      drop(e){
        let target = e.target;
        this.cordinate.drop = this.countCordinate(target);
        this.dropTransfer(this.cordinate);
      },
      allowDrop(e){
        e.preventDefault();
      },
      countCordinate(target){
          // 获取坐标的逻辑
        let theRow = target.parentElement;
        let rowContainer = theRow.parentElement;
        if(target.className.includes('ivu-btn')){
            target = target.parentElement;
            theRow = target.parentElement;
            rowContainer = theRow.parentElement;
        }
        return {
            x:Array.prototype.indexOf.call(theRow.children,target),
            y:Array.prototype.indexOf.call(rowContainer.children,theRow)
        }
      },
    //   dropTransfer(dragCordinate,dropCordinate){
          // 交换位置，并存储到本地
        //   const dragItem = this.appInfo[dragCordinate.y][dragCordinate.x] || {};
        //   const dropItem = this.appInfo[dropCordinate.y][dropCordinate.x] || {};
        //   this.appInfo[dropCordinate.y][dropCordinate.x] = dragItem;
        //   this.appInfo[dragCordinate.y][dragCordinate.x] = dropItem;
        //   this.appInfoUpdate(curContainerModel.slice());

        //   this.appInfo = this.appInfo.slice();
        //   storage.setItem('_appContainerModel',this.appInfo);
    //   },
      refreshCabinet(){
           this.$nextTick(()=>{
                const contentContainer = document.querySelector('#_content') || document.body;
                const contentClientRect = contentContainer.getBoundingClientRect();
                const iconConsult = this.$refs._iconConsult.$el || {getBoundingClientRect:()=>{''}};
                const iconClientRect = iconConsult.getBoundingClientRect();
                const iconHeight = iconClientRect ? iconClientRect.height : 32;
                const iconWidth = iconClientRect ? iconClientRect.width : 32;
                const capacityHeight = iconHeight + iconHeight/2;
                const capacityWidth = iconWidth + iconWidth/2;
                const moHeight = contentClientRect.height % capacityHeight;
                const moWidth = contentClientRect.width % capacityWidth;
                const rows = (contentClientRect.height - moHeight) / capacityHeight;
                const cols = (contentClientRect.width - moWidth) / capacityWidth;

                this.iconStyle.height = (moHeight / rows + capacityHeight) + 'px';
                this.iconStyle.width = (moWidth / cols + capacityWidth) + 'px';
                const chcheContainerModel = storage.getItem('_appContainerModel');
                debugger;
                if(!chcheContainerModel || !chcheContainerModel.length){
                    // 如果没有缓存，就使用默认的盒子模型
                    const defaultContainerModel = util.fillArray(util.rowToCol(emulationData,rows),{},rows,cols);
                    this.appInfoUpdate(defaultContainerModel);
                }else{
                    
                    const contentContainers = rows * cols;
                    const cacheCols = chcheContainerModel[0].length;
                    const cacheRows = chcheContainerModel.length;
                    // 如果有缓存了，需要根据当前的屏幕尺寸，重新规划盒子模型
                    // 分两种情况:
                    // 1. 窗口缩小了，需要裁掉缓存的模型，
                    // 裁掉的部分，如果有APP，就把它塞进附近位置
                    // todo 如果所有盒子都装满了App，缩小屏幕后，有溢出的部分，用另一个列表装起来，放在底部栏
                    if(contentContainers < cacheCols * cacheRows){
                        let overStackStore = [];
                        let y = cacheRows;
                        // 裁剪行
                        while(y-- > rows){
                            if(chcheContainerModel[y]){
                                let cuttingRow = chcheContainerModel.splice(y,1)[0];
                                cuttingRow.forEach(function(item){
                                    if(!util.isEmptyObj(item)){
                                        backRollInsert_row(item,y-1);
                                    }                
                                });
                            }
                        };

                        function backRollInsert_row(item,latestRowIndex){
                            const latestRow = chcheContainerModel[latestRowIndex] ? chcheContainerModel[latestRowIndex] : [];
                            let isInsert = false;
                            let loop = latestRow.length;
                            while(loop--){
                                if(util.isObj(latestRow[loop]) && util.isEmptyObj(latestRow[loop])){
                                    isInsert = true;
                                    latestRow[loop] = item;
                                }
                                if(isInsert) break;
                            }
                            
                            if(!isInsert){
                                backRollInsert_row(item,latestRowIndex-1);
                            }
                        }

                        // 裁剪列
                        let yAfterCutted = chcheContainerModel.length;
                        while(yAfterCutted--){
                            const yAfterCuttedRow = chcheContainerModel[yAfterCutted];                    
                            let x = cacheCols;
                            while(x-- > cols){
                                const latestItem = yAfterCuttedRow.splice(x,1)[0];
                                if(util.isObj(latestItem) && !util.isEmptyObj(latestItem)){
                                    backRollInsert_col(latestItem, chcheContainerModel, yAfterCutted, cols);
                                }
                            }
                        }

                        function backRollInsert_col(latestItem, chcheContainerModel, loopY, fixedX){ 
                            const latestRow = chcheContainerModel[loopY];
                            let isInsert = false;
                            let loopX = fixedX;
                            while(loopX--){
                                if(util.isObj(latestRow[loopX]) && util.isEmptyObj(latestRow[loopX])){
                                    latestRow[loopX] = latestItem;
                                    isInsert = true;
                                }
                                if(isInsert) break;
                            }
                            
                            if(!isInsert){
                                backRollInsert_col(latestItem, chcheContainerModel, loopY - 1, fixedX);
                            }
                        }

                    }
                    
                    // 2. 窗口扩大了，需要填充模型
                    if(contentContainers > cacheCols * cacheRows){
                            
                        let thisLayerY = rows;
                        while(thisLayerY--){

                            // 直接填充整行
                            if(!chcheContainerModel[thisLayerY]) {
                                chcheContainerModel[thisLayerY] = new Array(cols).fill({});
                            } 
                            // 检查填充行内的空盒子
                            else {
                                let thisLayerX = cols;
                                while(thisLayerX--){                        
                                    if(!chcheContainerModel[thisLayerY][thisLayerX]) chcheContainerModel[thisLayerY][thisLayerX] = {};
                                }
                            }
                           
                        }
                    }

                    this.appInfoUpdate(chcheContainerModel);
                }
            });  
      }
  },
  computed:{     
      renderIcons(){          
          return this.$store.state.appInfo;
      }
  },

  watch:{
  },
  mounted(){
    const that = this;      
    that.refreshCabinet();       
    let resizeSwitch = true; 
    window.onresize = function(){  
        if(resizeSwitch){
            resizeSwitch = false;     
            that.resetAppInfo() //避免重复填充  
            that.refreshCabinet();
            setTimeout(function(){ 
                resizeSwitch = true; //避免刷新过快，性能浪费 
            },500);        
            console.log('屏幕尺寸刷新了'); 
        }             
    }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
