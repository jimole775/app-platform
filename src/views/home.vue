<template>
  <Layout class="home-layout">
    <Content style="background:#333" id="_content" class="home-content">
      <Matrices />
    </Content>
    <Footer class="home-footer">
      <Folder />
      <FootBar />
    </Footer>
  </Layout>
</template>
<script>
  import FootBar from '@views/foot_bar/index'
  import Folder from '@views/folder/index'
  import Matrices from '@views/matrices/index'
  export default {
    name: 'home',
    components: { FootBar, Matrices, Folder }
  }
</script>
<style scoped>
.home-layout {
  height:100%;overflow: hidden;
}
.home-content {
  background:#333;
  z-index: 0;
}
.home-footer {
  z-index: 1;
  box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.3);
  padding: 12px 24px 6px 24px;
}
</style>
