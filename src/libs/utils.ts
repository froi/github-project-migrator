import path from 'path';
import fs from 'fs';

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
