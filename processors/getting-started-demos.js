const fs = require('fs');
const path = require('path');

const fsPromises = fs.promises;

(function() {
    generateGettingStartedSampleDemos();
})();

async function generateGettingStartedSampleDemos() {
    try {
        console.log('\x1b[32m%s\x1b[0m', '--------------------------------------');
        console.log('\x1b[32m%s\x1b[0m', 'START GENERATING GETTING STARTED DEMOS!');
        console.log('\x1b[32m%s\x1b[0m', '--------------------------------------');

        const entryPoint = joinPaths('..' , 'demos', 'getting-started');

        // get the widget folders
        const widgetFolders = await readDir(entryPoint);
    
        for (const widgetFolder of widgetFolders) {
            const widgetFolderPath = joinPaths(entryPoint, widgetFolder);

            // get the demos folders
            const demo = await readDir(widgetFolderPath);
            
            if (demo[0]) {
                const demoPath = joinPaths(widgetFolderPath, demo[0]);

                const destinationPath = joinPaths('..', 'release', 'documentation', 'documentation', 'jqx' + widgetFolder, 'demo.htm');
                await fsPromises.copyFile(demoPath, destinationPath);

                console.log('\x1b[36m%s\x1b[0m', widgetFolder);
            }
        }

        console.log('\x1b[32m%s\x1b[0m', '--------------------------------------');
        console.log('\x1b[32m%s\x1b[0m', 'DONE GENERATING GETTING STARTED DEMOS!');
        console.log('\x1b[32m%s\x1b[0m', '--------------------------------------');
    }
    catch (error) {
        console.error(error);
    }
}

async function readDir(path) {
    return await fsPromises.readdir(path);
}

function joinPaths(...paths) {
    return path.join(...paths).replace(/\\/g, '/');
}
