<template>
    <div class="editor-page">
        <div class="side-box">
            <div class="catalogue-box">
                <div>
                    <el-upload
                    ref="upload"
                    action=""
                    :on-change="changeFile"
                    :show-file-list="false"
                    :auto-upload="false">
                        <el-button slot="trigger" class="mb-10" type="primary" accept="*.txt">打开文件</el-button>
                    </el-upload>
                    
                </div>
                <div>
                    <el-button type="success">打开文件夹</el-button>
                </div>
            </div>
            

            <div class="catalogue-box" v-if="file.name">
                <div v-if="file.name" class="file-item">
                    {{file.name}}
                </div>
            </div>

            <div v-if="folder.name" class="catalogue-box">
                {{folder.name}}
                <div v-for="(item,index) in folder.files" :key="index" class="file-item">
                    {{item.name}}
                </div>
            </div>
        </div>
        <div class="main-box">
            <editor :content="file.content"/>
        </div>
    </div>
</template>

<script>
import editor from './components/editor.vue'
    export default {
        components: {editor},
        data(){
            return {
                folder: {
                    name: '',
                    files: []
                },
                file: {
                    name: '',
                    path: '',
                    content: ''
                }
            }
        },
        methods: {
            changeFile(file){
                // console.log(file)
                let path = file.raw.path
                this.$set(this.file,'name',file.name)
                this.$set(this.file,'path',path)
                this.openFile(path)
            },
            openFile(path){
                let fs = require("fs");

                fs.readFile(path, (err, data) => {
                    if (err) return console.error(err);
                    // console.log(data);
                    // console.log(data.toString());
                    this.$set(this.file,'content',data.toString())
                });
            }
        }
    }
</script>

<style lang="scss">
.editor-page{
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .side-box{
        flex: none;
        width: 200px;
        height: 100%;
        overflow: auto;
        background: #333;
        color: #666;

        .catalogue-box{
            border-bottom: 1px solid #222;
            padding: 10px;
            line-height: 1.5;
            font-size: 15px;
        }
        .file-item{
            cursor: pointer;
            padding: 10px;
            &:hover{
                background-color: #ccc;
            }
        }

    }
    .main-box{
        flex: 1;
        width: 100%;
        height: 100%;
    }
    
}
</style>