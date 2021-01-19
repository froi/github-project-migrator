import path from 'path';
import fs from 'fs';
import os from 'os';
import { Repo, Config, HostConfig } from './types';
import yaml from 'yaml';

const CONFIG_FILE_PATH = path.join(os.homedir(), '.github-project-migrator');

/**
 *
 * @param fileName Name of the GraphQL query file
 * @returns Contents of the supplied file
 */
export function getGraphqlQuery(graphqlQueriesPath: string, fileName: string): string {
  const queryPath = path.join(graphqlQueriesPath, fileName);

  try {
    return  fs.readFileSync(queryPath, {encoding: 'utf-8', flag: 'r'}).toString();
  } catch(error) {
    throw new Error(`There was an error opening ${queryPath} - ${error}`);
  }
}

export async function validateProjectNumberInput(input: string): Promise<boolean> {
  const value = parseInt(input);
  if(isNaN(value) || value <= 0){
    return false;
  } else {
    return true;
  }
}

export async function validateRepoInput(input: string): Promise<boolean> {
  if(input.match(/^.+\/.+/)) {
    return true;
  } else {
    return false;
  }
}

/**
 * Splits up a GitHub repository full_name into the owner and repo name values.
 * @param repo {string} The GitHub repo in the owner/name format
 */
export function splitRepo(repo: string): Repo {
  const [owner, name] = repo.split('/');
  return {
    owner,
    name
  };
}

export async function wait(seconds: number): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => resolve('done!'), seconds * 1000);
  });
}

export function getConfig(gitHubHost: string | null = null): Config | HostConfig | null {
  try {
    const config = fs.readFileSync(CONFIG_FILE_PATH).toString();
    const parsedConfig: Config = yaml.parse(config);

    if(parsedConfig) {
      if(gitHubHost && gitHubHost in parsedConfig) {
        return parsedConfig[gitHubHost];
      }
      return parsedConfig;
    }
    return null;
  } catch(error) {
    return null;
  }
}

export function writeConfig(gitHubHost = 'github.com', config: HostConfig): void {
  let currentConfig: Config | null = null;
  try {
    currentConfig = getConfig() as Config;
  } catch(error) {
    console.log('Config file not found and that is ok.');
  }
  if(currentConfig) {
    currentConfig[gitHubHost] = config;
  } else {
    currentConfig = {};
    currentConfig[gitHubHost] = config;
  }
  try {
    fs.writeFileSync(CONFIG_FILE_PATH, yaml.stringify(currentConfig));
  } catch(error) {
    throw new Error(`Error while writing config file - ${error}`);
  }
}
