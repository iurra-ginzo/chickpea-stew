import chalk from 'chalk';
import Listr from 'listr';
import { generateGarbanzoProject } from './generateChickpeaProject/generateGarbanzoProject';
import { jhipsterToGarbanzo } from './fromJHipsterToGarbanzo/jhipsterToGarbanzo';
import { checkJhipsterApplicationJdl, execJhipster, importJhipsterJdl } from './utils/jhipster';

export let stewOptions;

export async function stew (options) {
    stewOptions = { ...options, targetDirectory: options.targetDirectory || process.cwd() };
    
    let tasks = [
        {
            title: `Buying JHipster cubes (creating JHipster application from JHipster JDL)`,
            task: () => importJhipsterJdl(),
            enabled: () => stewOptions.jhipster && checkJhipsterApplicationJdl()
        },
        {
            title: `Cooking Garbanzo stew (generating Garbanzo ${stewOptions.concern} project)`,
            task: () => generateGarbanzoProject()
        },
        {
            title: `Serving Garbanzo stew (from JHipster to Garbanzo)`,
            task: () => jhipsterToGarbanzo()
        }
    ];
    
    await (new Listr(tasks)).run().then(ctx => {
        console.log('%s Garbanzo stew is ready to eat', chalk.green.bold('DONE'));
    }).catch(err => {
        // console.error('%s %s', chalk.red.bold('ERROR'), err);
    });
    
    return true;
}
