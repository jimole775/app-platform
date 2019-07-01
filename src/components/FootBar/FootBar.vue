<template>
  <Row>
    <Col span="1">
        <Button class="task-container">
            <Icon type="md-folder" size="22"/>
        </Button>
    </Col>
    <Col span="1" v-for='task in activedThreads' :key='task.threadId' v-if="task.threadId || task.threadId === 0">
        <TaskController :taskItem='task' class="task-container"></TaskController>
    </Col>
  </Row>
</template>

<script>
import {mapActions} from 'vuex'
import TaskController from './TaskController/TaskController'
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
      return this.$store.state.threads
    }
  },
  methods: {
    ...mapActions(['doExtend', 'doMinimized'])
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
</style>
