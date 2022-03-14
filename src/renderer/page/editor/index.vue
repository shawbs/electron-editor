<template>
    <div class="editor-page" :class="[`${theme}-theme`]">
        <div class="side-box">
            <div class="side-hd p-10">
                <div>
                    <el-upload
                    ref="upload"
                    action=""
                    :on-change="openFile"
                    :show-file-list="false"
                    :auto-upload="false">
                        <el-button size="small" slot="trigger" class="mb-10" type="primary" accept="*.txt">打开文件</el-button>
                    </el-upload>
                    
                </div>
                <div>
                    <el-button size="small" type="success" @click="openFolder">打开文件夹</el-button>
                </div>
            </div>
            

            <div class="side-body">
                <div class="catalogue-box" v-if="myFiles.length>0">
                    <div v-for="(item,index) in myFiles" :key="item.id" class="file-item" :class="{'is-on':item.id == currenFile.id}" >
                        <span @click="clickFile(item)">{{item.name}}
                            <span v-if="item.isChange" class="icon-change ml-10"></span>
                        </span>
                        <span class="el-icon-close" @click="removeFile(index)"></span>
                    </div>
                </div>

                <div v-if="myFolder" class="catalogue-box">
                    
                    <div class="folder-title">
                        <span>{{myFolder.name}}</span>
                        <span class="el-icon-close" @click="removeFolder()"></span>
                    </div>
                    <div v-for="(item,index) in myFolder.files" :key="index" class="file-item" :class="{'is-on':item.id == currenFile.id}" >
                        <span @click="clickFile2(item)">{{item.name}}
                            <span v-if="item.isChange" class="icon-change ml-10"></span>
                        </span>
                    </div>
                </div>
            </div>

            <div class="side-fd">
                <div class="p-10">
                    <el-switch
                    v-model="theme"
                    active-value="light"
                    inactive-value="dark"
                    active-color="#ccc"
                    inactive-color="#111"
                    active-text=""
                    inactive-text=""
                    >
                    </el-switch>
                </div>
            </div>
        </div>
        <div class="main-box">
            <editor v-if="currenFile.id" v-model="currenFile.content" @change="changeHandle" @save="saveFile"/>
            <welcome v-else/>
            {{currenFile.content}}
        </div>
    </div>
</template>

<script>
import editor from './components/editor.vue'
import welcome from './components/welcome.vue'
import {remote   } from 'electron'
import {mapState} from 'vuex'
    export default {
        components: {editor,welcome},
        data(){
            return {
                theme: 'dark',
                currenFile: {},

                myFiles: [],
                myFolder: null
                // folder: { name: '',files: []}
            }
        },
        computed: {
            ...mapState('editor',['files','folder'])
        },
        mounted(){
            console.log(this.files,this.folder)
            this.myFiles = [...this.files]
            this.myFolder = this.myFolder ? {...this.myFolder} : null

            ipcRenderer.on('selectedItem', (event, files)=>{

                console.log(files);//输出选择的文件
            })
        },
        methods: {
            openFile(file){
                if(file.raw.type != 'text/plain'){
                    return this.$$error("仅支持txt格式")
                }
                
                console.log(file)
                let path = file.raw.path

                this.readFile(path, content => {
                    let data = {
                        id: path,
                        name: file.name,
                        path: path,
                        content: content,
                        isChange:false
                    }

                    let index = this.myFiles.findIndex(item => item.id == data.id)
                    if(index>-1){
                        this.myFiles[index] = data
                    }else{
                        this.myFiles.push(data)
                    }
                    
                    this.clickFile(data)

                    this.$store.dispatch('editor/set_files', this.myFiles)
                })
                
                
            },
            openFolder(){
                remote.dialog.showOpenDialog({
                    properties: ['openDirectory'],
                }, res => {
                    console.log(res)
                    if(res){
                        let pathName = res[0]
                        this.readDir(pathName, files => {
                            let path = require('path')
                            
                            let arr = files.map(item => {
                                return {
                                    'id': path.join(item),
                                    'name': item,
                                    'path': path.join(item),
                                    'content': '',
                                    'isChange':false
                                }
                            })
                            console.log(files)
                            this.myFolder = {
                                name: pathName,
                                files: arr
                            }

                            this.$store.dispatch('editor/set_folders', this.myFolder)
                        })
                    }
                })
            },
            readDir(pathName,cb){
                console.log('open ',pathName)
                let fs = require("fs");
                fs.readdir(pathName, (err, data) => {
                    if (err) {
                        this.$$hideLoading()
                        return console.error(err);
                    }
                    this.$$hideLoading()
                    cb && cb(data)
                });
            },
            changeHandle(){
                this.setChangeStatus(true)
            },
            setChangeStatus(isChange){
                this.myFiles = this.myFiles.map(item => {
                    if(item.id === this.currenFile.id){
                        item.isChange = isChange
                    }
                    return {
                        ...item
                    }
                })
            },
            readFile(path,cb){
                this.$$showLoading()
                console.log('open ',path)
                let fs = require("fs");
                fs.readFile(path, (err, data) => {
                    if (err) {
                        this.$$hideLoading()
                        return console.error(err);
                    }
                    this.$$hideLoading()
                    cb && cb(data.toString())
                });
            },
            saveFile(content){
                this.setChangeStatus(false)
                this.$$showLoading()
                console.log('save ',this.currenFile.path)
                // console.log('save ',content)
                let fs = require("fs");
                fs.writeFile(this.currenFile.path,content, (err) => {
                    if (err) {
                        this.$$hideLoading()
                        return console.error(err);
                    }
                    this.$$hideLoading()
                    
                    console.log('save end')
                });
            },
            clickFile(file){
                if(this.currenFile.id){
                    let arr = this.files.map(item => {
                        return {
                            ...item,
                            content: this.currenFile.content
                        }
                    })
                    this.myFiles = arr
                }
                this.currenFile = file
            },
            clickFile2(file){
                
                this.currenFile = file

                if(this.currenFile.id){
                    let arr = this.folder.files.map(item => {
                        return {
                            ...item,
                            content: this.currenFile.content
                        }
                    })
                    let data = {
                        ...this.folder,
                        files: arr
                    }
                    this.myFolder = data
                }
                if(file.content && file.path.indexOf('txt') > -1){
                    this.readFile(file.path, e => {
                        this.$set(this.currenFile,'content',e)
                    })
                }
            },
            removeFile(index){
                this.myFiles.splice(index,1)
                this.$store.dispatch('editor/set_files',this.myFiles)
                if(this.myFiles[index]){
                    if(this.myFiles[index].id === this.currenFile.id){
                        this.currenFile = {}
                    }
                }
            },
            removeFolder(){
                this.myFolder = null
                this.$store.dispatch('editor/set_folders',null)

                let index = this.myFiles.find(item => item.id === this.currenFile.id)
                if(!index){
                    this.currenFile = {}
                }
            },

        }
    }
</script>

<style lang="scss">
$dark-color: #222;
$light-color: #f2f2f2;
.editor-page{
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .side-box{
        flex: none;
        width: 200px;
        height: 100%;
        overflow: hidden;
        background: $dark-color;
        color: #fff;
        display: flex;
        flex-direction: column;
        .side-hd{
            border-bottom: 1px solid lighten($dark-color, 10);
            flex: none;
        }
        .side-body{
            border-bottom: 1px solid lighten($dark-color, 10);
            flex: 1;
        }
        .side-fd{
            flex: none;
        }

        .catalogue-box{
            border-bottom: 1px solid lighten($dark-color, 10);
            padding: 5px;
            line-height: 1.5;
            font-size: 15px;
        }
        .file-item{
            cursor: pointer;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1px;
            .icon-change{
                display: inline-block;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background-color: #f2f2f2;
            }
            &:hover,&.is-on{
                background-color: lighten($dark-color, 10);
            }
            .el-icon-close:hover{
                background-color: lighten($dark-color, 6);
            }
        }

        

    }

    .editor-box{
        .editor-tools{
            background: rgba(0,0,0,.2);
        }
        .editor-fd{
            background: rgba(0,0,0,.2);
        }
    }

    .main-box{
        flex: 1;
        width: 100%;
        height: 100%;
        background-color: darken($dark-color,1);
        color: #fff;
    }
    &.light-theme{
        .side-box{
            background: $light-color;
            color: #222;
            .side-hd{
                border-bottom: 1px solid darken($light-color, 20);
            }
            .side-body{
                border-bottom: 1px solid darken($light-color, 20);
            }
            .catalogue-box{
                border-bottom: 1px solid darken($light-color, 20);
            }
            .file-item{
                .icon-change{
                    background-color: #666;
                }
                &:hover,&.is-on{
                    background-color: darken($light-color, 20);
                }
                .el-icon-close:hover{
                    background-color: darken($light-color, 10);
                }
            }

        }
        .main-box{
            background-color: darken($light-color,10);
            color: #222;
        }
        
    }
}
</style>