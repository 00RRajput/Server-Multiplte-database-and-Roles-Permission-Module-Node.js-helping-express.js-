const { error } = require('console');
const { readdir } = require('fs/promises');
const { exec } = require('node:child_process');
const path = require('path');



const init = async (file_name, current_directory) => {
    const seeder_directory = path.join(current_directory + '/Database/Seeder');
    const files = await readdir(seeder_directory);

    //checking in file is present in the directory
    if (files.includes(`${file_name}.js`)) {
        console.log("Seeder Found");
        console.log("Executing Seeder");
        exec(`node --max-old-space-size=4096 ${path.join(seeder_directory + `/${file_name}.js`)}`, (error,stdout, stderr) => {
            if (error) {
                console.log("error executing seeder", error);
                return;
            }
          
            console.log("child process exited !");
            console.log('main',stdout);
            console.log('stderr',stderr)
        });
    }
    else {
        console.log("Seeder does not exist");
        if (files.length) {
            console.log('Available seeder names: ');
            files.map((seederFile) => {
                console.log('> ' + (seederFile.replace('.js', '')) + '\n');
            });
        } else console.log('No seeders yet, create seeders first');
    }
}
module.exports = { init };