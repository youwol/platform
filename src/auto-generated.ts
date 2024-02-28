
const runTimeDependencies = {
    "externals": {
        "marked": "^4.2.3",
        "@youwol/os-core": "^0.2.0",
        "@youwol/http-clients": "^3.0.1",
        "uuid": "^8.3.2",
        "codemirror": "^5.52.0",
        "@youwol/rx-context-menu-views": "^0.2.0",
        "@youwol/rx-tab-views": "^0.3.0",
        "@youwol/rx-group-views": "^0.3.0",
        "@youwol/rx-vdom": "^1.0.1",
        "rxjs": "^7.5.6",
        "@youwol/rx-code-mirror-editors": "0.5.0",
        "@youwol/webpm-client": "^3.0.0"
    },
    "includedInBundle": {}
}
const externals = {
    "marked": "window['marked_APIv4']",
    "@youwol/os-core": "window['@youwol/os-core_APIv02']",
    "@youwol/http-clients": "window['@youwol/http-clients_APIv3']",
    "uuid": "window['uuid_APIv8']",
    "codemirror": "window['CodeMirror_APIv5']",
    "@youwol/rx-context-menu-views": "window['@youwol/rx-context-menu-views_APIv02']",
    "@youwol/rx-tab-views": "window['@youwol/rx-tab-views_APIv03']",
    "@youwol/rx-group-views": "window['@youwol/rx-group-views_APIv03']",
    "@youwol/rx-vdom": "window['@youwol/rx-vdom_APIv1']",
    "rxjs": "window['rxjs_APIv7']",
    "@youwol/rx-code-mirror-editors": "window['@youwol/rx-code-mirror-editors_APIv05']",
    "@youwol/webpm-client": "window['@youwol/webpm-client_APIv3']",
    "rxjs/operators": "window['rxjs_APIv7']['operators']"
}
const exportedSymbols = {
    "marked": {
        "apiKey": "4",
        "exportedSymbol": "marked"
    },
    "@youwol/os-core": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/os-core"
    },
    "@youwol/http-clients": {
        "apiKey": "3",
        "exportedSymbol": "@youwol/http-clients"
    },
    "uuid": {
        "apiKey": "8",
        "exportedSymbol": "uuid"
    },
    "codemirror": {
        "apiKey": "5",
        "exportedSymbol": "CodeMirror"
    },
    "@youwol/rx-context-menu-views": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/rx-context-menu-views"
    },
    "@youwol/rx-tab-views": {
        "apiKey": "03",
        "exportedSymbol": "@youwol/rx-tab-views"
    },
    "@youwol/rx-group-views": {
        "apiKey": "03",
        "exportedSymbol": "@youwol/rx-group-views"
    },
    "@youwol/rx-vdom": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/rx-vdom"
    },
    "rxjs": {
        "apiKey": "7",
        "exportedSymbol": "rxjs"
    },
    "@youwol/rx-code-mirror-editors": {
        "apiKey": "05",
        "exportedSymbol": "@youwol/rx-code-mirror-editors"
    },
    "@youwol/webpm-client": {
        "apiKey": "3",
        "exportedSymbol": "@youwol/webpm-client"
    }
}

const mainEntry : {entryFile: string,loadDependencies:string[]} = {
    "entryFile": "./app/index.html",
    "loadDependencies": [
        "@youwol/rx-tab-views",
        "@youwol/os-core",
        "@youwol/rx-group-views",
        "@youwol/rx-vdom",
        "@youwol/http-clients",
        "rxjs",
        "uuid",
        "@youwol/webpm-client",
        "@youwol/rx-context-menu-views"
    ]
}

const secondaryEntries : {[k:string]:{entryFile: string, name: string, loadDependencies:string[]}}= {}

const entries = {
     '@youwol/platform': './app/index.html',
    ...Object.values(secondaryEntries).reduce( (acc,e) => ({...acc, [`@youwol/platform/${e.name}`]:e.entryFile}), {})
}
export const setup = {
    name:'@youwol/platform',
        assetId:'QHlvdXdvbC9wbGF0Zm9ybQ==',
    version:'0.2.2',
    shortDescription:"OS like frontend application of YouWol platform.",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/platform&tab=doc',
    npmPackage:'https://www.npmjs.com/package/@youwol/platform',
    sourceGithub:'https://github.com/youwol/platform',
    userGuide:'https://l.youwol.com/doc/@youwol/platform',
    apiVersion:'02',
    runTimeDependencies,
    externals,
    exportedSymbols,
    entries,
    secondaryEntries,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    },

    installMainModule: ({cdnClient, installParameters}:{
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const parameters = installParameters || {}
        const scripts = parameters.scripts || []
        const modules = [
            ...(parameters.modules || []),
            ...mainEntry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/platform_APIv02`]
        })
    },
    installAuxiliaryModule: ({name, cdnClient, installParameters}:{
        name: string,
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const entry = secondaryEntries[name]
        if(!entry){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const parameters = installParameters || {}
        const scripts = [
            ...(parameters.scripts || []),
            `@youwol/platform#0.2.2~dist/@youwol/platform/${entry.name}.js`
        ]
        const modules = [
            ...(parameters.modules || []),
            ...entry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/platform/${entry.name}_APIv02`]
        })
    },
    getCdnDependencies(name?: string){
        if(name && !secondaryEntries[name]){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const deps = name ? secondaryEntries[name].loadDependencies : mainEntry.loadDependencies

        return deps.map( d => `${d}#${runTimeDependencies.externals[d]}`)
    }
}
