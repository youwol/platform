
const runTimeDependencies = {
    "externals": {
        "@youwol/fv-tabs": "^0.2.1",
        "@youwol/os-core": "^0.1.2",
        "@youwol/fv-group": "^0.2.1",
        "@youwol/flux-view": "^1.0.3",
        "@youwol/http-clients": "^1.0.3",
        "rxjs": "^6.5.5",
        "uuid": "^8.3.2",
        "@youwol/cdn-client": "^1.0.2",
        "codemirror": "^5.52.0",
        "@youwol/fv-code-mirror-editors": "^0.2.1"
    },
    "includedInBundle": {}
}
const externals = {
    "@youwol/fv-tabs": "window['@youwol/fv-tabs_APIv02']",
    "@youwol/os-core": "window['@youwol/os-core_APIv01']",
    "@youwol/fv-group": "window['@youwol/fv-group_APIv02']",
    "@youwol/flux-view": "window['@youwol/flux-view_APIv1']",
    "@youwol/http-clients": "window['@youwol/http-clients_APIv1']",
    "rxjs": "window['rxjs_APIv6']",
    "uuid": "window['uuid_APIv8']",
    "@youwol/cdn-client": "window['@youwol/cdn-client_APIv1']",
    "codemirror": "window['CodeMirror_APIv5']",
    "@youwol/fv-code-mirror-editors": "window['@youwol/fv-code-mirror-editors_APIv02']",
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
    "uuid": {
        "apiKey": "8",
        "exportedSymbol": "uuid"
    },
    "@youwol/cdn-client": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/cdn-client"
    },
    "codemirror": {
        "apiKey": "5",
        "exportedSymbol": "CodeMirror"
    },
    "@youwol/fv-code-mirror-editors": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/fv-code-mirror-editors"
    }
}

// eslint-disable-next-line @typescript-eslint/ban-types -- allow to allow no secondary entries
const mainEntry : Object = {
    "entryFile": "./app/index.html",
    "loadDependencies": [
        "@youwol/fv-tabs",
        "@youwol/os-core",
        "@youwol/fv-group",
        "@youwol/flux-view",
        "@youwol/http-clients",
        "rxjs",
        "uuid",
        "@youwol/cdn-client"
    ]
}

// eslint-disable-next-line @typescript-eslint/ban-types -- allow to allow no secondary entries
const secondaryEntries : Object = {}
const entries = {
     '@youwol/platform': './app/index.html',
    ...Object.values(secondaryEntries).reduce( (acc,e) => ({...acc, [`@youwol/platform/${e.name}`]:e.entryFile}), {})
}
export const setup = {
    name:'@youwol/platform',
        assetId:'QHlvdXdvbC9wbGF0Zm9ybQ==',
    version:'0.1.4-wip',
    shortDescription:"OS like frontend application of YouWol platform.",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/platform',
    npmPackage:'https://www.npmjs.com/package/@youwol/platform',
    sourceGithub:'https://github.com/youwol/platform',
    userGuide:'https://l.youwol.com/doc/@youwol/platform',
    apiVersion:'01',
    runTimeDependencies,
    externals,
    exportedSymbols,
    entries,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    },

    installMainModule: ({cdnClient, installParameters}:{cdnClient, installParameters?}) => {
        const parameters = installParameters || {}
        const scripts = parameters.scripts || []
        const modules = [
            ...(parameters.modules || []),
            ...mainEntry['loadDependencies'].map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/platform_APIv01`]
        })
    },
    installAuxiliaryModule: ({name, cdnClient, installParameters}:{name: string, cdnClient, installParameters?}) => {
        const entry = secondaryEntries[name]
        const parameters = installParameters || {}
        const scripts = [
            ...(parameters.scripts || []),
            `@youwol/platform#0.1.4-wip~dist/@youwol/platform/${entry.name}.js`
        ]
        const modules = [
            ...(parameters.modules || []),
            ...entry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        if(!entry){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/platform/${entry.name}_APIv01`]
        })
    }
}
