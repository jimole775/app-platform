<template>
    <div>    
        <Button ref='_iconConsult' type="info" style='position:fixed;top:0;left:-9999px;opacity:0'>
            <!--当前元素只是作用计算屏幕容量的-->
            <Icon type="ios-disc" />
        </Button>
        <Row v-for='(rowItem,key) in this.appList' :key='key'>      
            <Col span='1' v-for='(colItem,colKey) in rowItem' :key='colKey' :style='iconStyle' @click='testHover()'>
                <AppIcon :icon='colItem.favicon' :href='colItem.href'></AppIcon>
            </Col>
        </Row>
    </div>
</template>

<script>
import emulationData from '_pub/apps.info.json';
import AppIcon from '_comps/Cabinet/AppIcon/AppIcon';
import util from 'util';

export default {
  name: 'Cabinet',
  components:{AppIcon},
  data () {
    return {
        appList:emulationData,
        iconStyle:{
        }
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
      }
  },
  computed:{     
      renderIcons(){
            return this.appList;
      }
  },

  watch:{
      renderIcons(newVal,oldVal){          
          console.log('new:', newVal, 'old:', oldVal);
      }
  },
  mounted(){
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
        this.appList = util.rowToCol(emulationData,rows);  
        this.appList = util.fillArray(this.appList,rows,cols,{});
        
        console.log('peer col capacity:',this.iconStyle);
     });  
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
