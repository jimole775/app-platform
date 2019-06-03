<template>
    <Layout style='height:100%'>
        <Content>
            <router-view/>
        </Content>
        <Footer>
            <FootBar></FootBar>
        </Footer>  
    </Layout> 
</template>
<script>
    import FootBar from '_comps/FootBar/FootBar';
    export default {
        name:'home',
        components:{FootBar}
    }
</script>
