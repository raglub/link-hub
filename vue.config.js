module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                appId: "dev.szyma.link-hub",
                productName: 'Link Hub',
                copyright: "Copyright © 2021 ${author}",
                publish: {
                    provider: "github",
                    owner: "raglub",
                    repo: "link-hub"
                },
                nsis: {
                    oneClick: false,
                    artifactName: "link-hub-${version}-${os}64-setup.${ext}",
                    perMachine: false,
                    createStartMenuShortcut: true,
                    runAfterFinish: true
                },
                linux: {
                    icon: 'assets/icons/linux/icon.icns',
                    target: [
                        {
                          target: "deb",
                          arch: [
                            "x64"
                          ]
                        }
                    ],
                    category: "Utility",
                    packageCategory: "Utility"
                }
            }
        }
    }
}