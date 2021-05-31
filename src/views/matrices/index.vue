<template>
  <div ref="MatricesRef" @dragstart="drag($event)" @drop="drop($event)" @dragover="allowDrop($event)">
    <Row v-for="(rowItem, rowKey) in appInfo" :key="rowKey" style="display: table">
      <Col span="1" v-for="(colItem, colKey) in rowItem" :style="iconStyle" :key="colKey" class="icon-box">
        <AppIcon :appItem="colItem" />
      </Col>
    </Row>
    <Button ref="_iconConsult" type="info" class="kick-out">
      <!--当前元素只是作用计算屏幕容量的-->
      <Icon type="ios-disc" />
    </Button>
    <div v-for="threadItem in activeThreads" :key="'id_' + threadItem.threadId">
      <ThreadController :threadItem="threadItem">
        <iframe class="iframe-default" :src="threadItem.href"></iframe>
      </ThreadController>
    </div>
  </div>
</template>

<script>
import ThreadController from "@comp/thread_controller/index"
import { mapActions, mapMutations } from "vuex"
import emulationData from "@public/apps.info.json"
import AppIcon from "@comp/app_icon/index"
import {
  isEmptyObj,
  rowToCol,
  fillArray,
  isObj,
  starFlash
} from "@public/util"
import storage from "@public/storage"
export default {
  name: "Matrices",
  components: {
    AppIcon,
    ThreadController
  },
  data() {
    return {
      iconStyle: {
        height: '',
        width: ''
      },
      cordinate: {
        drag: {
          x: 0,
          y: 0
        },
        drop: {
          x: 0,
          y: 0
        }
      }
    };
  },
  computed: {
    appInfo() {
      return this.$store.state.appInfo
    },
    activeThreads() {
      return this.$store.state.threads
    }
  },
  mounted() {
    const that = this
    that.refreshMatrices()
    starFlash(that.$refs.MatricesRef)
    window.onresize = function() {
      console.log("window resize!")
      that.$nextTick(() => {
        that.resetAppInfo() //避免重复填充
        that.refreshMatrices()
      })
    }
  },
  created() {},
  methods: {
    ...mapMutations(["appInfoUpdate", "dropTransfer", "resetAppInfo"]),
    ...mapActions(["doActive", "doClose", "doFocus"]),
    queryRightElement(src, targetSign) {
      if (src) {
        let srcElement = src
        if (srcElement.className.includes(targetSign)) {
          return srcElement
        } else {
          return this.queryRightElement(srcElement.parentElement, targetSign)
        }
      }
    },
    drag(e) {
      let target = e.target
      this.cordinate.drag = this.countCordinate(target)
    },
    drop(e) {
      let target = e.target
      this.cordinate.drop = this.countCordinate(target)
      this.dropTransfer(this.cordinate)
    },
    allowDrop(e) {
      e.preventDefault()
    },
    countCordinate(src) {
      // 获取坐标的逻辑
      let target = this.queryRightElement(src, "ivu-col")
      let theRow = this.queryRightElement(target, "ivu-row")
      let rowContainer = theRow.parentElement
      return {
        x: Array.prototype.indexOf.call(theRow.children, target),
        y: Array.prototype.indexOf.call(rowContainer.children, theRow)
      }
    },
    isModelUpdated() {
      const old_model_version = storage.getItem("_appContainerModel_version")
      return old_model_version !== emulationData.version
    },
    refreshMatrices() {
      const doc = document
      const contentContainer = doc.querySelector("#_content") || doc.body
      const footer = doc.querySelector(".ivu-layout-footer") || {
        clientHeight: 89
      }
      const contentClientRect = {
        width: doc.body.clientWidth,
        height: doc.body.clientHeight - footer.clientHeight
      }

      const iconConsult = this.$refs._iconConsult.$el || {
        getBoundingClientRect: () => {
          return {
            height: 32,
            width: 32
          }
        }
      }
      const iconClientRect = iconConsult.getBoundingClientRect()
      const capacityHeight = iconClientRect.height + iconClientRect.height / 2
      const capacityWidth = iconClientRect.width + iconClientRect.width / 2
      const moHeight = contentClientRect.height % capacityHeight
      const moWidth = contentClientRect.width % capacityWidth
      const rows = (contentClientRect.height - moHeight) / capacityHeight
      const cols = (contentClientRect.width - moWidth) / capacityWidth

      this.iconStyle.height = moHeight / rows + capacityHeight + "px"
      this.iconStyle.width = moWidth / cols + capacityWidth + "px"
      const chcheContainerModel = storage.getItem("_appContainerModel")
      if (
        !chcheContainerModel ||
        !chcheContainerModel.length ||
        this.isModelUpdated()
      ) {
        // 如果没有缓存，或者数据有更新，就使用默认的盒子模型
        const defaultContainerModel = fillArray(
          rowToCol(emulationData.items, rows),
          {},
          rows,
          cols
        )
        this.appInfoUpdate({
          items: defaultContainerModel,
          version: emulationData.version
        })
      } else {
        const contentContainers = rows * cols
        const cacheCols = chcheContainerModel[0].length
        const cacheRows = chcheContainerModel.length
        // 如果有缓存了，需要根据当前的屏幕尺寸，重新规划盒子模型
        // 分两种情况:
        // 1. 窗口缩小了，需要裁掉缓存的模型，
        // 裁掉的部分，如果有APP，就把它塞进附近位置
        // todo 如果所有盒子都装满了App，缩小屏幕后，有溢出的部分，用另一个列表装起来，放在底部栏
        if (contentContainers < cacheCols * cacheRows) {
          let overStackStore = []
          let y = cacheRows
          // 裁剪行
          while (y-- > rows) {
            if (chcheContainerModel[y]) {
              let cuttingRow = chcheContainerModel.splice(y, 1)[0]
              cuttingRow.forEach(function(item) {
                if (!isEmptyObj(item)) {
                  backRollInsert_row(item, y - 1)
                }
              });
            }
          }

          function backRollInsert_row(item, latestRowIndex) {
            const latestRow = chcheContainerModel[latestRowIndex]
              ? chcheContainerModel[latestRowIndex]
              : []
            let isInsert = false
            let loop = latestRow.length
            while (loop--) {
              if (isObj(latestRow[loop]) && isEmptyObj(latestRow[loop])) {
                isInsert = true
                latestRow[loop] = item
              }
              if (isInsert) break
            }
            if (!isInsert) {
              return backRollInsert_row(item, latestRowIndex - 1)
            }
          }

          // 裁剪列
          let yAfterCutted = chcheContainerModel.length
          while (yAfterCutted--) {
            const yAfterCuttedRow = chcheContainerModel[yAfterCutted]
            let x = cacheCols
            while (x-- > cols) {
              const latestItem = yAfterCuttedRow.splice(x, 1)[0]
              if (isObj(latestItem) && !isEmptyObj(latestItem)) {
                backRollInsert_col(
                  latestItem,
                  chcheContainerModel,
                  yAfterCutted,
                  cols
                )
              }
            }
          }

          function backRollInsert_col(
            latestItem,
            chcheContainerModel,
            loopY,
            fixedX
          ) {
            const latestRow = chcheContainerModel[loopY]
            let isInsert = false
            let loopX = fixedX;
            while (loopX--) {
              if (isObj(latestRow[loopX]) && isEmptyObj(latestRow[loopX])) {
                latestRow[loopX] = latestItem
                isInsert = true
              }
              if (isInsert) break
            }
            if (!isInsert) {
              return backRollInsert_col(
                latestItem,
                chcheContainerModel,
                loopY - 1,
                fixedX
              )
            }
          }
        }

        // 2. 窗口扩大了，需要填充模型
        if (contentContainers > cacheCols * cacheRows) {
          let thisLayerY = rows
          while (thisLayerY--) {
            // 直接填充整行
            if (!chcheContainerModel[thisLayerY]) {
              chcheContainerModel[thisLayerY] = new Array(cols).fill({})
            }
            // 检查填充行内的空盒子
            else {
              let thisLayerX = cols
              while (thisLayerX--) {
                if (!chcheContainerModel[thisLayerY][thisLayerX])
                  chcheContainerModel[thisLayerY][thisLayerX] = {}
              }
            }
          }
        }

        this.appInfoUpdate({ items: chcheContainerModel })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.kick-out {
  position: fixed;
  top: 0;
  left: -9999px;
  opacity: 0;
}
.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.iframe-default {
  height: 94%;
  width: 100%;
  border: 0;
  border-radius: 0 0 4px 4px;
  position: relative;
}
</style>
