<template>
  <Button @click="visibleSwitch(taskItem)" :class="focus(taskItem)">
    <img :src="taskItem.favicon" :width="22" :height="22">
  </Button>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'TaskController',
  props: {
    taskItem: {
      type: Object
    }
  },
  methods: {
    ...mapActions(['reActive', 'doMinimized', 'doFocus']),
    focus(thread) {
      return thread.iFocused ? 'focus-style' : 'normal-style'
    },
    visibleSwitch(taskItem) {
      if (taskItem.iActived) {
        if (taskItem.iFocused) {
          this.doMinimized(taskItem)
        } else {
          this.doFocus(taskItem)
        }
      } else {
        this.reActive(taskItem)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.focus-style{
    border: 1px solid #8298ec;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);
}
.normal-style{
    border: 1px solid #dcdee2;
    box-shadow: none;
}

</style>
