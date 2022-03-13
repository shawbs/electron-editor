<template>
    <div class="editor-page">
        <div class="side-box">
            <div>
                <el-button class="mb-10" type="primary">打开文件</el-button>
            </div>
            <div>
                <el-button type="success">打开文件夹</el-button>
            </div>
        </div>
        <div class="main-box">
            <editor />
        </div>
    </div>
</template>

<script>
import editor from './components/editor.vue'
    export default {
        components: {editor}
    }
</script>

<style lang="scss">
.editor-page{
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .side-box{
        padding: 10px;
        flex: none;
        width: 200px;
        height: 100%;
        overflow: auto;
        background: #333;
    }
    .main-box{
        flex: 1;
        width: 100%;
        height: 100%;
    }
    
}
</style>