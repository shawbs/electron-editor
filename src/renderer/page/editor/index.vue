<template>
    <div class="editor-page" :class="[`${theme}-theme`]" >
        <div class="drag-mask" v-if="draging" @mouseup="onmouseup" @mousemove="onmousemove"></div>
        <div class="side-box" :style="{width:width + 'px'}">
            <div class="drag-btn" @mousedown="onmousedown" ></div>

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
                    <el-button size="small" type="danger" @click="closeAll">关闭所有</el-button>
                    
                </div>
            </div>
            

            <div class="side-body">
                <div class="catalogue-box" v-if="myFiles.length>0">
                    <div v-for="(item,index) in myFiles" :key="item.id" class="file-item" :class="{'is-on':item.id == currenFile.id}" @contextmenu="contextmenu($event,item,index)" @click="clickFile(item)">
                        <span class="file-name" >{{item.filename}}
                            <span v-if="item.isChange" class="icon-change ml-10"></span>
                        </span>
                    </div>
                </div>

                <div v-if="myFolder" class="folder-box">
                    
                    <div class="folder-title">
                        <span>{{myFolder.name}}</span>
                        <div>
                            <span class="el-icon-plus" @click="addHandle()" title="新建"></span>
                            <span class="el-icon-refresh" @click="refreshFolder()" title="刷新"></span>
                            <span class="el-icon-close" @click="removeFolder()" title="关闭"></span>
                        </div>
                    </div>

                    <div class="file-item new-file" v-if="newFile">
                        <input type="text" v-model="newFile.name" />
                        <span class="el-icon-check" @click="saveAddFile"></span>
                        <span class="el-icon-close" @click="cancleAddFile"></span>
                    </div>

                    <div v-for="(item,index) in myFolder.files" :key="index" class="file-item" :class="{'is-on':item.id == currenFile.id}" @contextmenu="contextmenu($event,item,index)" @click="clickFile2(item)">
                        <span class="file-name" v-if="item.renameing">
                            <input type="text" v-model="item.name" />
                            <span class="el-icon-check" @click="saveRename(item)"></span>
                            <span class="el-icon-close" @click="cancleRename(item)"></span>
                        </span>
                        <span class="file-name" v-else>
                            {{item.name}}
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
            <!-- {{draging}}{{width}} -->
            <editor v-if="currenFile.id" :data="currenFile" @changestatus="changestatus" @change="changeHandle" @save="saveFile"/>
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
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const Path = require('path')
const Fs = require("fs");
    export default {
        components: {editor,welcome},
        data(){
            return {
                draging: false,

                width: 300,
                theme: 'light', // dark light
                currenFile: {},

                myFiles: [], 
                myFolder: null, // folder: { name: '',files: []}

                newFile: null
                
            }
        },
        computed: {
            ...mapState('editor',['files','folder'])
        },
        mounted(){
            console.log(this.files,this.folder)
            this.myFiles = [...this.files]
            if(this.folder){
                this.initFolder(this.folder)
            }

            ipcRenderer.on('selectedItem', (event, files)=>{

                console.log(files);//输出选择的文件
            })

            
        },
        methods: {
            closeAll(){
                this.$store.dispatch('editor/set_files',[])
                this.$store.dispatch('editor/set_folder','')
            },
            contextmenu(e,data,index){
                console.log(e,data,e.x,e.y)
                const menu = new Menu();

                var menuItem1 = new MenuItem({label:'重命名',click:()=>{
                    console.log(data)
                    data.renameing = true
                    // this.removeFile(index)
                }});//创建一个子菜单项
                var menuItem2 = new MenuItem({label:'删除',click:()=>{
                    this.removeFile(index)   
                }});//创建一个子菜单项
                var menuItem3 = new MenuItem({label:'删除文件',click:()=>{
                    this.removeFileLocal(data.path) 
                }});

                if(data.type == 1){
                    menu.append(menuItem2);//将菜单项添加到menu中
                }
                if(data.type == 2){
                    menu.append(menuItem1);//将菜单项添加到menu中
                    menu.append(menuItem3);//将菜单项添加到menu中
                }                

                e.preventDefault();//阻止默认行为
                var x = e.x;//鼠标右键点击的横坐标
                var y = e.y;//鼠标右键点击的纵坐标
                menu.popup({x:x,y:y});
                return false;
            },
            onmousedown(e){
                // console.log('down',e)
                this.draging = true
            },
            onmousemove(e){
                if(this.draging){
                    // console.log('move',e.clientX)
                    if(e.clientX < 500 && e.clientX > 200){
                        this.width = e.clientX
                    }
                }
            },
            onmouseup(e){
                if(this.draging){
                    // console.log('up',e)
                    this.draging = false
                }
            },
            openFile(file){
                if(file.raw.type != 'text/plain'){
                    return this.$$error("仅支持txt格式")
                }
                
                console.log(file)
                let path = file.raw.path

                this.readFile(path, content => {
                    let name = file.name.substring(0,file.name.lastIndexOf('.txt'))
                    let data = {
                        id: path,
                        filename: file.name,
                        name: name,
                        path: path,
                        content: content,
                        isChange:false,
                        renameing:false,
                        type: 1 //1单独文件 2目录文件
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
                        this.initFolder(res[0])
                    }
                })
            },
            initFolder(pathName){
                let folderName = Path.parse(pathName).name
                this.readDir(pathName, files => {
                    let arr = files.map(item => {
                        let name = item.substring(0,item.lastIndexOf('.txt'))
                        return {
                            'id': Path.join(pathName,item),
                            'filename': item,
                            'name': name,
                            'path': Path.join(pathName,item),
                            'content': '',
                            'isChange':false,
                            'renameing':false,
                            'type': 2
                        }
                    })
                    // console.log(files)
                    this.myFolder = {
                        name: folderName,
                        path: pathName,
                        files: arr
                    }

                    this.$store.dispatch('editor/set_folder', pathName)
                })
            },
            readDir(pathName,cb){
                console.log('open ',pathName)
                Fs.readdir(pathName,{ withFileTypes: true }, (err, data) => {
                    if (err) {
                        this.$$hideLoading()
                        return console.error(err);
                    }
                    this.$$hideLoading()
                    console.log(data)

                    //过滤非.txt文件
                    let arr = data.filter(item => {
                        let str = item.substring(item.lastIndexOf('.'))
                        // console.log(str)
                        return str === '.txt'
                    })

                    cb && cb(data)
                });
            },
            changeHandle(content){
                this.$set(this.currenFile,'content',content)
            },
            changestatus(){
                this.$set(this.currenFile,'isChange', true)
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
                Fs.readFile(path, (err, data) => {
                    if (err) {
                        this.$$hideLoading()
                        return console.error(err);
                    }
                    this.$$hideLoading()
                    cb && cb(data.toString())
                });
            },
            saveFile(content){
                console.log('save ',this.currenFile.path)
                this.$set(this.currenFile,'isChange', false)
                this.$set(this.currenFile,'content',content)
                // this.setChangeStatus(false)
                this.$$showLoading()
                
                // console.log(this.currenFile)

                if(this.currenFile.type === 1){
                    this.$store.dispatch('editor/set_files',this.myFiles)
                }

                Fs.writeFile(this.currenFile.path,content, (err) => {
                    if (err) {
                        this.$$hideLoading()
                        return console.error(err);
                    }
                    this.$$hideLoading()
                    
                    console.log('save end')
                });
            },
            clickFile(file){
                if(file.filename.indexOf('.txt') === -1){
                    return this.$$error("格式不支持")
                }

                if(file.isChange){
                    this.currenFile = file
                }else{
                    this.readFile(file.path, res => {
                        file.content = res
                        this.currenFile = file
                    })
                }
            },
            clickFile2(file){
                if(file.filename.indexOf('.txt') === -1){
                    return this.$$error("格式不支持")
                }
                if(file.isChange){
                    this.currenFile = file
                }else{
                    this.readFile(file.path, res => {
                        file.content = res
                        this.currenFile = file
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
            removeFileLocal(path){
                console.log('rm',path)
                Fs.rm(path);
                this.refreshFolder()
            },
            
            removeFolder(){
                this.myFolder = null
                this.$store.dispatch('editor/set_folder','')

                let index = this.myFiles.find(item => item.id === this.currenFile.id)
                if(!index){
                    this.currenFile = {}
                }
            },
            addHandle(){
                this.newFile = {
                    name: ''
                }
            },
            saveAddFile(){
                let name = this.newFile.name + '.txt'
                let path = Path.join(this.myFolder.path,name)

                if(Fs.existsSync(path)){
                    return this.$$error("文件已存在")
                }

                console.log('save',path)
                Fs.writeFile(path,'',err => {
                    if (err) {
                        return console.error(err);
                    }

                    this.newFile = null

                    this.refreshFolder()
                })
                
            },
            cancleAddFile(){
                this.newFile = null
            },
            refreshFolder(){
                this.initFolder(this.myFolder.path)
            },
            saveRename(data){
                console.log(data)
                
                let oldPath = data.path
                let newPath = Path.join(this.myFolder.path, data.name + '.txt')

                // console.log(oldPath,'->',newPath)

                if(Fs.existsSync(newPath)){
                    return this.$$error("文件已存在")
                }

                Fs.rename(oldPath,newPath);

                data.renameing=false

                // this.refreshFolder()
            },
            cancleRename(data){
                data.renameing=false
            }

        }
    }
</script>

<style lang="scss">
$dark-color: #222;
$light-color: #f2f2f2;
.drag-mask{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    cursor: col-resize;
}
.editor-page{
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .side-box{
        padding-right: 5px;
        flex: none;
        width: 200px;
        height: 100%;
        overflow: hidden;
        background: $dark-color;
        color: #fff;
        display: flex;
        flex-direction: column;
        transition: width .1s linear;

        position: relative;
        .drag-btn{
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 5px;
            z-index: 2;
            background: rgba(0,0,0,.2);
            // -webkit-app-region: drag;
            cursor: col-resize;
        }

        .side-hd{
            // border-bottom: 1px solid lighten($dark-color, 10);
            flex: none;
        }
        .side-body{
            border-top: 1px solid lighten($dark-color, 10);
            flex: 1;
            overflow: auto;
        }
        .side-fd{
            border-top: 1px solid lighten($dark-color, 10);
            flex: none;
        }

        .catalogue-box{
            // border-top: 1px solid lighten($dark-color, 10);
            padding: 5px;
            line-height: 1.5;
            font-size: 15px;
        }
        .folder-box{
            border-top: 1px solid lighten($dark-color, 10);
            padding: 5px;
            line-height: 1.5;
            font-size: 15px;
            .folder-title{
                cursor: pointer;
                padding: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1px;
                
                [class^="el-icon"]:hover{
                    background-color: lighten($dark-color, 6);
                }
            }
            .file-item{
                padding-left: 25px;
            }
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
            [class^="el-icon"]:hover{
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
                // border-bottom: 1px solid darken($light-color, 20);
            }
            .side-body{
                border-top: 1px solid darken($light-color, 20);
            }
            .side-fd{
                border-top: 1px solid darken($light-color, 10);
            }
            .catalogue-box{
                // border-top: 1px solid darken($light-color, 20);
            }
            .folder-box{
                border-top: 1px solid darken($light-color, 10);
            }
            
            .folder-title{
                [class^="el-icon"]:hover{
                    background-color: darken($light-color, 10);
                }
            }
            .file-item{
                .icon-change{
                    background-color: #666;
                }
                &:hover,&.is-on{
                    background-color: darken($light-color, 20);
                }
                [class^="el-icon"]:hover{
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