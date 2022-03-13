<template>
    <div class="home-page">
        <div class="fs-big mb-10">欢迎使用！</div>
        <div>
            <el-button class="mb-10" type="primary" @click="$router.push('/editor')">打开文件</el-button>
        </div>
        <div><el-button type="success">打开文件夹</el-button></div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.home-page{
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>