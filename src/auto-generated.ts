
const runTimeDependencies = {
    "load": {
        "@youwol/fv-tabs": "^0.2.0",
        "@youwol/os-core": "^0.1.0",
        "@youwol/fv-group": "^0.2.0",
        "@youwol/flux-view": "^1.0.0",
        "@youwol/http-clients": "^1.0.0",
        "rxjs": "^6.5.5",
        "@youwol/cdn-client": "^1.0.0"
    },
    "differed": {
        "@youwol/fv-code-mirror-editors": "^0.1.0"
    },
    "includedInBundle": []
}
const externals = {
    "@youwol/fv-tabs": "window['@youwol/fv-tabs_APIv02']",
    "@youwol/os-core": "window['@youwol/os-core_APIv01']",
    "@youwol/fv-group": "window['@youwol/fv-group_APIv02']",
    "@youwol/flux-view": "window['@youwol/flux-view_APIv1']",
    "@youwol/http-clients": "window['@youwol/http-clients_APIv1']",
    "rxjs": "window['rxjs_APIv6']",
    "@youwol/cdn-client": "window['@youwol/cdn-client_APIv1']",
    "@youwol/fv-code-mirror-editors": "window['@youwol/fv-code-mirror-editors_APIv01']",
    "rxjs/operators": "window['rxjs_APIv6']['operators']"
}

export const setup = {
    name:'@youwol/platform',
        assetId:'QHlvdXdvbC9wbGF0Zm9ybQ==',
    version:'0.1.0',
    shortDescription:"OS like frontend application of YouWol platform.",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/platform',
    npmPackage:'https://www.npmjs.com/package/@youwol/platform',
    sourceGithub:'https://github.com/youwol/platform',
    userGuide:'https://l.youwol.com/doc/@youwol/platform',
    apiVersion:'01',
    runTimeDependencies,
    externals
}
