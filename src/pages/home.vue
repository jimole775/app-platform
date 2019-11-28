<template>
    <Layout class="home-layout">
        <Content id="_content" class="home-content">
            <Cabinet :parentBox="this.$refs"></Cabinet>
        </Content>
        <Footer class="home-footer">
            <FootBar></FootBar>
        </Footer>  
    </Layout> 
</template>
<script>
    import FootBar from '_comps/foot_bar/foot_bar';
    import Cabinet from '_comps/cabinet/cabinet';
    export default {
        name:'home',
        components:{FootBar,Cabinet}
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
}
</style>
