require('./style.css')
export {}
import * as cdnClient from '@youwol/cdn-client'
import { setup } from '../auto-generated'

await setup.installMainModule({
    cdnClient,
    installParameters: {
        css: [
            'bootstrap#^5.3.0~bootstrap.min.css',
            'fontawesome#5.12.1~css/all.min.css',
            '@youwol/fv-widgets#latest~dist/assets/styles/style.youwol.css',
        ],
        displayLoadingScreen: true,
    },
})

await import('./on-load')
