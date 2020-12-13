import path from 'path';
import fs from 'fs';
import { Repo } from './types';

const GRAPHQL_QUERIES_PATH = path.join(path.dirname(__dirname), 'graphql');

/**
 *
 * @param fileName Name of the GraphQL query file
 * @returns Contents of the supplied file
 */
export function getGraphqlQuery(fileName: string): string {
  const queryPath = path.join(GRAPHQL_QUERIES_PATH, fileName);

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
