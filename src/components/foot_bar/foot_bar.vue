<template>
  <Row>
    <Col span="1">
        <Button class="task-container">
            <Icon type="md-folder" size="22"/>
        </Button>
    </Col>
    <Col span="1" v-for="task in activedThreads" :key="'id_' + task.threadId">
        <TaskController :taskItem="task" class="task-container"></TaskController>
    </Col>
  </Row>
</template>

<script>
import { mapActions } from 'vuex'
import TaskController from './task_controller/task_controller'
export default {
  name: 'FootBar',
  data () {
    return {
    }
  },
  components: {
    TaskController
  },
  computed:{
    activedThreads() {
      const res = []
      this.$store.state.threads.forEach((task) => {
        if (task.threadId !== null && task.threadId !== undefined) {
          res.push(task)
        }
      })
      return res
    }
  },
  methods: {
    ...mapActions(['reActive', 'doMinimized'])
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .task-container{
      width: 2.6rem;
      height: 2.6rem;
      padding:0;
    }
    
    .ivu-col.ivu-col-span-1 {
      min-width: 2.8rem;
    }
</style>
