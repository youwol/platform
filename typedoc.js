module.exports = {
    entryPoints: [
        './src/app/index.ts',
        './src/app/top-banner/user/ts-code-editor/index.ts',
    ],
    exclude: ['./src/tests', './src/app/top-banner'],
    out: 'dist/docs',
    theme: 'default',
    categorizeByGroup: false,
    categoryOrder: [
        'Getting Started',
        'State',
        'View',
        'View.Tab',
        'View.TopBanner',
        'Configuration',
        'HTTP',
        '*',
    ],
    excludeExternals: true,
    sort: 'source-order',
}
