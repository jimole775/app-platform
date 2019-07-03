<template>
    <Layout style='height:100%;overflow: hidden;'>
        <Content style='background:#333' id='_content'>
            <Cabinet :parentBox='this.$refs'></Cabinet>
        </Content>
        <Footer>
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
