<template>
  <div>
    <Row>
      <Col span="1">
        <Button class="task-container" @dblclick.native="doActivedFolder">
          <Icon type="md-folder" size="22" />
        </Button>
      </Col>
      <Col span="1" v-for="task in activedThreads" :key="'id_' + task.threadId">
        <TaskController :taskItem="task" class="task-container" />
      </Col>
    </Row>
    <Row>
      <Col span="24" class="copy-right">
        © 2019-2025 727346595@qq.com 版权所有 备案号：<a href="https://beian.miit.gov.cn">浙ICP备19013138号-1</a>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TaskController from '@comp/task_controller/index'
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
    ...mapActions(['reActive', 'doMinimized', 'doActivedFolder', 'doMinimizedFolder'])
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .task-container {
    width: 2.6rem;
    height: 2.6rem;
    padding:0;
  }
  .ivu-col.ivu-col-span-1 {
    min-width: 2.8rem;
  }
  .copy-right {
    font-size: 0.8rem;
  }
  .copy-right > a {
    font-size: 0.8rem;
    text-align: right;
  }
</style>
