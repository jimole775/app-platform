<template>
    <div class='iframe-box'>
        <header class='hand-bar'>
            <ButtonGroup class='hand-btns'>
                <Button icon="ios-remove"></Button>
                <Button class='btn-close' icon="ios-close"></Button>
            </ButtonGroup>
        </header>  
        <iframe class='iframe-default' :src='href' :style='style'></iframe> 
    </div>    
</template>
<script>
// 使用iframe用作每个App的容器
// 每个容器必须要实时获取App的尺寸，以调整自身的状态

import Drag from '_pub/Drag';
export default {
    name:'appContainer',
    data(){
        return{

        }
    },
    props:{
        href:{
            type:String,
            default:'http://localhost:80'
        },
        style:{
            type:Object,
            default:{
            }
        }
    },
    computed:{
        mixinStyle(){
            const defaultStyle = {      
            };

            return Object.assign(this.style,defaultStyle);
        }
    },
    mounted(){
        this.$nextTick(()=>{
            new Drag({dragBox:'.iframe-box',dragHandle:'.hand-bar'});
        });
    }
}


</script> 
<style type='less'>
    .iframe-box{
        height: 75%;
        width: 280px;
        position: fixed;
        top: 55px;
        left: 52px;
        border-radius: 4px;
        border: 0;
        box-shadow: 0px 0px 12px #211e1e;
    }
    .hand-bar{
        height: 6%;
        width: 100%;
        position:relative;
    }
    .iframe-default{
        width: 100%;
        height: 94%;
        border: 0;
        border-radius: 0 0 4px 4px;
        position:relative;
    }
    .hand-btns{
        float:right;
    }
    .hand-btns button{
        border-radius: 0;
        background: none;
        border: 0;
        color: #fff;
        outline:0;
    }
    
    .hand-btns button:hover{        
        background: rgba(197, 197, 197, 0.7);
    }

    .hand-btns button.btn-close:hover{
        background: rgba(253, 0, 0, 0.7);
    }
</style> 

