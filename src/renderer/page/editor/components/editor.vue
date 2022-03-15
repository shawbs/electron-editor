<template>
    <div class="editor-box" v-if="file">
        <div class="editor-tools">
            <el-button size="mini" @click="formatTxt">一键格式化</el-button>
        </div>
        <div class="editor-path">
            {{file.path}}
        </div>
        <div ref="input" class="editor-body" contenteditable="true" v-html="content" @input="changeHandle" @blur="blurHandle">
            <!-- <div v-for="item in 100">123</div> -->
        </div>
        <div class="editor-fd">
            字数：{{size}}字
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            data: Object
        },
        data(){
            return {
                file: null
            }
        },
        computed:{
            
            content(){
                return this.file ? this.file.content : ''
            },
            size(){
                return this.content ? this.content.replace(/\s+/g,'').length : 0
            },
        },
        watch: {
            data(){
                this.file = this.data
            }
        },
        mounted(){
            this.file = this.data

            window.addEventListener('keyup', e => {
                // console.log(e)
                if(e.ctrlKey && e.key === 's'){
                    console.log('ctrl+s')
                    if(this.$refs.input){
                        let str = this.$refs.input.innerText
                        this.$emit('save', str)
                    }
                    
                }
            }, true)
        },
        methods: {

            formatTxt(){
                // console.log(this.content)
                let content = this.test(this.content)
                this.$emit('change',content)
                this.$emit('changestatus',true)  

                this.autoEmitSave()
            }, 

            trim(str){
                return str.replace(/^\s+|\s+$/g,'')
            },

            blurHandle(e){
                // console.log(1,e.target.innerText)
                let str = e.target.innerText
                this.$emit('change',str)
                this.autoEmitSave()
            },
            changeHandle(){
                this.$emit('changestatus',true)  
            },

            test(text){
                let arr = text.split('\n')
                let arr2 = []
                arr.forEach(item => {
                    let str = this.trim(item)
                    if(str){
                        arr2.push(str)
                    }
                })

                let newStr = ''
                arr2.forEach(item => {
                    newStr += "\t" + item + "\n\n"
                })
                // console.log(newStr)
                return newStr
            }
        }
}
</script>

<style lang="scss">
.editor-box{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .editor-path{
        background: rgba(0,0,0,.1);
        flex: none;
        padding: 10px;
    }
    .editor-tools{
        flex: none;
        padding: 10px;
        // background: rgba(0,0,0,.1);
        // color: #666;
    }
    .editor-body{
        height: 100%;
        flex: 1;
        padding: 10px;
        overflow: auto;
        outline: none;
        line-height: 1.8;
        font-size: 15px;
        white-space: pre-wrap;
        letter-spacing: 2px;
    }
    .editor-fd{
        flex: none;
        // border-top: 1px solid #222;
        // background: rgba(0,0,0,.1);
        padding: 10px;
    }
}
</style>