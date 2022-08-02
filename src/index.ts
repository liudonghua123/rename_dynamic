#!/usr/bin/env node

import { program } from 'commander';
import mustache from 'mustache';
import template from 'es6-template-strings';
const debug = require('debug')('main')
import fs from 'fs';

// Error [ERR_REQUIRE_ESM]: require() of ES Module
// see https://github.com/sindresorhus/globby/issues/193#issuecomment-991556042
import globby from 'globby';
import { dirname, basename, join } from 'path';

// import { version } from '../package.json';

// see https://github.com/janl/mustache.js#custom-delimiters
mustache.tags = ['${', '}'];

program
  .name('rename_dynamic utilities')
  .description('CLI utilities to rename files according to regexp and data from csv')
  // .version(version)
  .argument('[files]', 'files to rename', '*')
  .option('-r, --run', 'rename files, do not just dry run')
  .option('-s, --source-field-name <char>', 'the source field name which is unique in input data', 'id')
  .option('-c, --csv <char>', 'csv data file path', 'sample.csv')
  .option('-i, --input <char>', 'source filename pattern', String.raw`.*(?<id>\d+)\.(?<extension>.*)`)
  .option('-o, --output <char>', 'target filename pattern', "${id:name}.\${extension}")

program.parse();

const options = program.opts();
debug(`options: ${JSON.stringify(options)}, files: ${program.args}`);

// check input options
if (!fs.existsSync(options.csv)) {
  console.error(`csv file ${options.csv} does not exist`);
  process.exit(1);
}

const ID_FIELD = options.sourceFieldName;

function csvToJson(csv_file: string) {
  const csv_data = fs.readFileSync(csv_file, 'utf8');
  const lines: string[] = csv_data.split(/\r?\n/);
  const headers: string[] = lines[0].split(',');
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    const obj: { [key: string]: string } = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = values[i];
    }
    return obj;
  });
  return data;
}

const data = csvToJson(options.csv);
debug(`data: ${JSON.stringify(data)}`);

const consumed_data: Set<string> = new Set();

const source_regexp = /\?<(?<field>\w+)>/gm;
const target_regexp = /(?<all>\${(?<source>\w+):(?<target>\w+)})/;

const get_target_field_names = () => {
  const match = target_regexp.exec(options.output);
  if (match) {
    return match?.groups!;
  }
}
const get_source_field_names = () => {
  let match;
  const source_field_names: { [key: string]: string }[] = [];
  while ((match = source_regexp.exec(options.input)) != null) {
    source_field_names.push({ [Object.keys(match.groups!)[0]]: match[1] });
  }
  return source_field_names;
}

const source_field_names = get_source_field_names()!;
debug(`source_field_names ${JSON.stringify(source_field_names)}`)
if (!source_field_names) {
  console.error(`input regexp ${options.input} could not be parsed`)
  process.exit(1);
}
const is_valid_input_regexp = source_field_names.some(source_field_name => source_field_name.field === ID_FIELD);
if (!is_valid_input_regexp) {
  console.error(`field ${ID_FIELD} not found in input regexp`);
  process.exit(1);
}

const target_field_names = get_target_field_names()!;
debug(`target_field_names: ${JSON.stringify(target_field_names)}`)
if (!target_field_names && target_field_names["source"] !== ID_FIELD) {
  console.error(`output regexp format is invalid, should include \${id:<otherField>}`);
  process.exit(1);
}


function find_related_data(data: { [key: string]: string }[], source_field_name: string, source_field_value: string, target_field_name: string) {
  for (const record of data) {
    if (record[source_field_name] == source_field_value) {
      return record[target_field_name];
    }
  }
}

function rename(data: { [key: string]: string }[], original_filename: string) {
  const regexp = new RegExp(options.input);
  const match = regexp.exec(original_filename);
  let renamed_filename = null;
  if (match) {
    debug(`found input regexp matched filename ${original_filename}`);
    debug(`the match is ${JSON.stringify(match)}, match.groups: ${JSON.stringify(match.groups)}`);
    const source_field_value = match!.groups![ID_FIELD];
    const { all, source, target } = target_field_names;
    if (source !== ID_FIELD) {
      console.error(`target regexp does not contain \${id:<otherField>}`);
      process.exit(1);
    }
    const target_field_value = find_related_data(data, source, source_field_value, target);
    if (!target_field_value) {
      console.info(`no data found for ${source}=${source_field_value} in data`);
      return null;
    }
    consumed_data.add(source_field_value);
    renamed_filename = options.output.replace(all, target_field_value);
    // renamed_filename = mustache.render(renamed_filename, match.groups!);
    renamed_filename = template(renamed_filename, match.groups!);
    console.info(`prepare rename ${original_filename} to ${renamed_filename}`);
  }
  else {
    console.info(`filename ${original_filename} does not match input regexp, skipped `);
  }
  return renamed_filename;
}

(async () => {
  const files_to_handle = await globby(program.args);
  debug(`files_to_handle: ${files_to_handle}`);
  const processed_files: string[] = []
  for (const file_path of files_to_handle) {
    const dir = dirname(file_path);
    const filename = basename(file_path);
    const renamed_filename = rename(data, filename);
    if (!renamed_filename) {
      continue;
    }
    const renamed_file_path = join(dir, renamed_filename);
    processed_files.push(file_path);
    if (renamed_filename && options.run) {
      console.info(`renaming ${file_path} to ${renamed_file_path}`);
      fs.renameSync(file_path, renamed_file_path);
    }
  }
  // output summary info
  console.info(`----------summary info----------`);
  console.info(`processed ${processed_files.length} files, skipped ${files_to_handle.length - processed_files.length} files`);
  console.info(`skipped files: ${files_to_handle.filter(file_path => !processed_files.includes(file_path))}`);
  console.info(`consumed data: ${consumed_data.size} items, skipped ${data.length - consumed_data.size} items`);
  console.info(`skipped data: ${JSON.stringify(data.filter(record => !consumed_data.has(record[ID_FIELD])))}`);
})();
