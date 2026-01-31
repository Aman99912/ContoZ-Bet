module.exports = {
    resolver: {
        assetExts: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'ttf', 'wav', 'mp3'],
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
