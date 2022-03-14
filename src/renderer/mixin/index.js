
import { Loading } from 'element-ui'
export default {
    data() {
        return {
            myLoadingInstance: null
        }
    },
    methods: {
        $$showLoading(text) {
            this.myLoadingInstance = Loading.service({
                fullscreen: true,
                text
            })
        },
        $$hideLoading() {
            this.myLoadingInstance && this.myLoadingInstance.close()
        },
    }
}