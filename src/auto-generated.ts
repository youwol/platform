
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
const exportedSymbols = {
    "@youwol/fv-tabs": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/fv-tabs"
    },
    "@youwol/os-core": {
        "apiKey": "01",
        "exportedSymbol": "@youwol/os-core"
    },
    "@youwol/fv-group": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/fv-group"
    },
    "@youwol/flux-view": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/flux-view"
    },
    "@youwol/http-clients": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/http-clients"
    },
    "rxjs": {
        "apiKey": "6",
        "exportedSymbol": "rxjs"
    },
    "@youwol/cdn-client": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/cdn-client"
    },
    "@youwol/fv-code-mirror-editors": {
        "apiKey": "01",
        "exportedSymbol": "@youwol/fv-code-mirror-editors"
    }
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
    externals,
    exportedSymbols
}

export function getExportedSymbolName(module:string){
    return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
}
