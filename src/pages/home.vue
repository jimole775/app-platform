<template>
    <Layout style='height:100%'>
        <Content style='background:#333' id='_content'>
            <Cabinet :parentBox='this.$refs'></Cabinet>
            <AppContainer></AppContainer>
            <AppContainer></AppContainer>
        </Content>
        <Footer>
            <FootBar></FootBar>
        </Footer>  
    </Layout> 
</template>
<script>
    import FootBar from '_comps/FootBar/FootBar';
    import Cabinet from '_comps/Cabinet/Cabinet';
    import AppContainer from '_comps/AppContainer/AppContainer';
    export default {
        name:'home',
        components:{FootBar,Cabinet,AppContainer}
    }
</script>
