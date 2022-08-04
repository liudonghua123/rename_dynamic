// export all the builtin filter functions from './filters/index.ts'
export * from './filters/index';
const debug = require('debug')('filters');

// @TODO Not work with dynamic imports in ncc
// dynamic imports, from https://javascript.tutorialink.com/import-and-execute-all-files-on-folder-with-es6/
import { promises as fs } from 'fs';
import { join, basename } from 'path';
import { config_filter_path } from './config';

export default async function* (): AsyncGenerator<Function, void, unknown> {
    debug(`try to load filters from ${config_filter_path}`);
    for (const module of await fs.readdir(config_filter_path)) {
        const modulePath = join(config_filter_path, module);
        debug(`loading filter ${module} of ${modulePath}`);
        const {default: filter_function} = await import(modulePath);
        debug(`filter_function ${filter_function}, typeof ${typeof filter_function}`);
        yield filter_function;
    }
}
