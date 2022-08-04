import { existsSync, mkdirSync } from "fs";
import { join } from "path";

// set the default config root path to <HOME_DIR>/.rename_dynamic, fallback to the current directory
export const config_root_path = join(process.env.HOME || process.env.USERPROFILE || '', '.rename_dynamic');
export const config_filter_path = join(config_root_path, 'filters');
export function init_config_dir() {
    if (!existsSync(config_root_path)) {
        mkdirSync(config_root_path);
    }
    if (!existsSync(config_filter_path)) {
        mkdirSync(config_filter_path);
    }
}