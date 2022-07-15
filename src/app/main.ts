export {}
require('./style.css')
const cdn = window['@youwol/cdn-client']

await cdn.install(
    {
        modules: [
            'lodash',
            'rxjs',
            '@youwol/flux-view',
            '@youwol/fv-group',
            '@youwol/fv-tabs',
            '@youwol/os-core',
        ],
        css: [
            'bootstrap#4.4.1~bootstrap.min.css',
            'fontawesome#5.12.1~css/all.min.css',
            '@youwol/fv-widgets#latest~dist/assets/styles/style.youwol.css',
        ],
    },
    {
        displayLoadingScreen: true,
    },
)

await import('./on-load')
