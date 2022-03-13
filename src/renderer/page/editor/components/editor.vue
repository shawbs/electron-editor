<template>
    <div class="editor-box">
        <div class="editor-tools">
            <el-button size="mini">一键格式化</el-button>
        </div>
        <div class="editor-body" contenteditable="true">
            <div v-for="item in 100">123</div>
        </div>
        <div class="editor-fd">
            字数：111字
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.editor-box{
    background: #111;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .editor-tools{
        flex: none;
        padding: 10px;
        border-bottom: 1px solid #222;
        color: #ccc;
    }
    .editor-body{
        height: 100%;
        flex: 1;
        padding: 10px;
        overflow: auto;
        outline: none;
        color: #ccc;
        line-height: 1.5;
        font-size: 15px;
    }
    .editor-fd{
        flex: none;
        border-top: 1px solid #222;
        padding: 10px;
        color: #ccc;
    }
}
</style>