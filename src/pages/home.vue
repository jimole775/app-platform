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
    import FootBar from '_comps/FootBar/FootBar';
    import Cabinet from '_comps/Cabinet/Cabinet';
    export default {
        name:'home',
        components:{FootBar,Cabinet}
    }
</script>
