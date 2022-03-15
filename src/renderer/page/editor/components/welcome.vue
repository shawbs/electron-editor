<template>
    <div class="home-page">
        <div class="fs-big mb-20">欢迎使用{{appName}}！</div>
        <!-- <div class="mb-20">
            <img src="~@/assets/1.jpg" alt="" width="150">
        </div> -->
        
    </div>
</template>

<script>
import {mapState} from 'vuex'
    export default {
        computed: {
            ...mapState('editor',['appName'])
        },
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