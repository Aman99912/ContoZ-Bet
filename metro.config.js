module.exports = {
    resolver: {
        assetExts: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'ttf'],
    },
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
};
