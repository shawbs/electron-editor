<template>
    <div class="editor-box">
        <div class="editor-tools">
            <el-button size="mini" @click="formatTxt">一键格式化</el-button>
        </div>
        <div class="editor-body" contenteditable="true" v-html="value">
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
            content: String
        },
        data(){
            return {
                value: ''
            }
        },
        computed:{
            size(){
                return this.content ? this.content.length : 0
            }
        },
        watch: {
            content(){
                this.value = this.content
            }
        },
        methods: {
            formatTxt(){
                // console.log(this.value)

                // console.log(this.LayOut(this.value))

                this.value = this.LayOut(this.value)
            }, 
            LayOut(text){
                var newLineChar="\r\n";
                var segHead="    ";
                var text = text;
                var textContainer = new Array();
                var ContainerArrayIndex = 0;
                var startIndex=0;
                var endIndex=0;
                var textLength=text.length;
                var returnString="";
                var isRubbish=true;
                var rubbish=new String(" \t　\r\n");
                
                for(var count = 0; count < textLength; count++)
                {
                    if(rubbish.indexOf(text.charAt(count))==-1) isRubbish=false;
                    
                    if(count==textLength-1&&isRubbish==false)
                    {
                        textContainer[ContainerArrayIndex]=this.Trim(text.substring(startIndex,textLength));
                        ContainerArrayIndex++;
                    }
                    else
                    {
                        if(text.substring(count,count+2)==newLineChar)
                        {
                            endIndex=count+2;
                            if(endIndex-startIndex>2&&isRubbish==false)
                            {
                                textContainer[ContainerArrayIndex]=this.Trim(text.substring(startIndex,endIndex-2))+text.substring(endIndex-2,endIndex);
                                ContainerArrayIndex++;
                            }
                            startIndex=endIndex;
                            count++;
                            isRubbish=true;
                        }
                    }
                }
                
                for(var count = 0; count < ContainerArrayIndex; count++)
                {
                    returnString+=segHead+textContainer[count]+newLineChar;
                }

                return returnString;
            },
            LTrim(str){
                var whitespace = new String(" \t　");
                var s = new String(str);
                if (whitespace.indexOf(s.charAt(0)) != -1)
                {
                    var j=0, i = s.length;
                    while (j < i && whitespace.indexOf(s.charAt(j)) != -1)
                    {
                        j++;
                    }
                    s = s.substring(j, i);
                }
                return s;
            },
            RTrim(str){
                var whitespace = new String(" \t　");
                var s = new String(str);
                if (whitespace.indexOf(s.charAt(s.length-1)) != -1)
                {
                    var i = s.length - 1;
                    while (i >= 0 && whitespace.indexOf(s.charAt(i)) != -1)
                    {
                        i--;
                    }
                    s = s.substring(0, i+1);
                }
                return s;
            },
            Trim(str){
                return this.RTrim(this.LTrim(str));
            }
        }
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
        color: #666;
    }
    .editor-body{
        height: 100%;
        flex: 1;
        padding: 10px;
        overflow: auto;
        outline: none;
        color: #666;
        line-height: 1.8;
        font-size: 15px;
        white-space: pre-wrap;
    }
    .editor-fd{
        flex: none;
        border-top: 1px solid #222;
        padding: 10px;
        color: #666;
    }
}
</style>