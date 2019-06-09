<template>
   
    <div ref='_cabinet' @dragstart='drag($event)' @drop='drop($event)' @dragover='allowDrop($event)'>    
       
        <Row v-for='(rowItem,key) in this.renderIcons' :key='key'>      
            <Col span='1' v-for='(colItem,colKey) in rowItem' :style='iconStyle' :key='colKey' @click='testHover()'>
                <AppIcon :icon='colItem.favicon' :href='colItem.href' draggable='true'>
                </AppIcon>
            </Col>
        </Row>

        <Button ref='_iconConsult' type="info" style='position:fixed;top:0;left:-9999px;opacity:0'>
            <!--当前元素只是作用计算屏幕容量的-->
            <Icon type="ios-disc" />
        </Button>
    </div>
</template>

<script>
import emulationData from '_pub/apps.info.json';
import AppIcon from '_comps/Cabinet/AppIcon/AppIcon';
import util from '_pub/Util';
import storage from '_pub/Storage';

export default {
  name: 'Cabinet',
  components:{AppIcon},
  data () {
    return {
        appList:storage.getItem('_appContainerModel') || emulationData,
        iconStyle:{
            height:'',
            width:''
        },
        dragCordinate:{x:0,y:0},
        dropCordinate:{x:0,y:0},
    }
  },
  props:{
      parentBox:{
          type:Object
      }
  },
  methods:{
      testHover(e){
          console.log('is hover on this element',e);
      },
      drag(e){
        let target = e.target;        
        this.dragCordinate = this.countCordinate(target);
        console.log('drag:',target.className,this.dragCordinate)
      },
      drop(e){
        let target = e.target;
        this.dropCordinate = this.countCordinate(target);
        this.dropTransfer(this.dragCordinate,this.dropCordinate);
        console.log('drag:',target.className,this.dropCordinate)
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
      dropTransfer(dragCordinate,dropCordinate){
          // 交换位置，并存储到本地
          const dragItem = this.appList[dragCordinate.y][dragCordinate.x] || {};
          const dropItem = this.appList[dropCordinate.y][dropCordinate.x] || {};
          this.appList[dropCordinate.y][dropCordinate.x] = dragItem;
          this.appList[dragCordinate.y][dragCordinate.x] = dropItem;
          this.appList = this.appList.slice();
          storage.setItem('_appContainerModel',this.appList);
      },
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
                const curContainerModel = util.fillArray(util.rowToCol(emulationData,rows),{},rows,cols);
                if(!chcheContainerModel){
                    // 如果没有缓存，就使用默认的盒子模型
                    this.appList = curContainerModel.slice();
                }else{
                    // 如果有缓存了，需要根据当前的屏幕尺寸，重新规划盒子模型
                    // 分两种情况:
                    // 1. 窗口缩小了，需要裁掉缓存的模型，
                    // 裁掉的部分，如果有APP，就把它塞进附近位置
                    // todo 如果所有盒子都装满了App，缩小屏幕后，有溢出的部分，用另一个列表装起来，放在底部栏
                    const contentContainers = rows * cols;
                    const cacheCols = chcheContainerModel[0].length;
                    const cacheRows = chcheContainerModel.length;
                    if(rows * cols < cacheCols * cacheRows){
                        let overStackStore = [];
                        let y = cacheRows;
                        // 裁剪行
                        while(y-- > rows){
                            if(chcheContainerModel[y]){
                                let cuttingRow = chcheContainerModel.splice(y,1)[0];
                                cuttingRow.forEach(function(item){
                                    if(Object.keys(item).length){
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
                                if(isObj(latestRow[loop]) && isEmptyObj(latestRow[loop])){
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
                                if(isObj(latestItem) && !isEmptyObj(latestItem)){
                                    backRollInsert_col(latestItem, chcheContainerModel, yAfterCutted, cols);
                                }
                            }
                        }

                        function backRollInsert_col(latestItem, chcheContainerModel, loopY, fixedX){                    
                            const latestRow = chcheContainerModel[loopY];
                            let isInsert = false;
                            let loopX = fixedX;
                            while(loopX--){
                                if(isObj(latestRow[loopX]) && isEmptyObj(latestRow[loopX])){
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
                    if(rows * cols > cacheCols * cacheRows){
                            
                        let thisLayerY = rows;
                        while(thisLayerY--){
                            if(!chcheContainerModel[thisLayerY]) chcheContainerModel[thisLayerY] = new Array(rows).fill({});
                            let thisLayerX = cols;
                            while(thisLayerX--){                        
                                if(!chcheContainerModel[thisLayerY][thisLayerX]) chcheContainerModel[thisLayerY][thisLayerX] = {};
                            }
                        }
                    }

                    function isEmptyObj(target){
                        return isObj(target) && !Object.keys(target).length
                    }

                    function isObj(target){
                        return Object.prototype.toString.call(target) === '[object Object]'
                    }

                    this.appList = chcheContainerModel.slice();
                }
            });  
      }
  },
  computed:{     
      renderIcons(){          
          return this.appList;
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
            that.appList = []; //避免重复填充   
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
