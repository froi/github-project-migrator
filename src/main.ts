import * as dotenv from 'dotenv';

import {graphql} from '@octokit/graphql';
import {
  AddProjectCardInput,
  AddProjectCardResponse,
  AddProjectColumnInput,
  AddProjectColumnResponse,
  GetOrgProjectInput,
  GetRepoProjectInput,
  GetOrgProjectResponse,
  GetRepoProjectResponse,
  ID,
  GraphQlQueries
} from './libs/types';
import {getGraphqlQuery} from './libs/utils';

dotenv.config();
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_TOKEN}`
  }
});

async function addProjectColumn(input: AddProjectColumnInput): Promise<AddProjectColumnResponse> {
  const mutation = getGraphqlQuery(GraphQlQueries.ADD_PROJECT_COLUMN);
  const result: AddProjectColumnResponse = await graphqlWithAuth(mutation, input);
  return result;
}
async function addProjectCard(input: AddProjectCardInput): Promise<AddProjectCardResponse> {
  const mutation = getGraphqlQuery(GraphQlQueries.ADD_PROJECT_CARD);
  const result: AddProjectCardResponse = await graphqlWithAuth(mutation, input);
  return result;
}
async function getOrgProject(input: GetOrgProjectInput): Promise<GetOrgProjectResponse> {
  const query = getGraphqlQuery(GraphQlQueries.GET_ORG_PROJECT);
  const result: GetOrgProjectResponse = await graphqlWithAuth(query, input);
  return result;
}
async function getRepoProject(input: GetRepoProjectInput): Promise<GetRepoProjectResponse> {
  const query = getGraphqlQuery(GraphQlQueries.GET_REPO_PROJECT);
  const result: GetRepoProjectResponse = await graphqlWithAuth(query, input);
  return result;
}
async function main(): Promise<void> {
  const org: string | undefined = process.env.GITHUB_ORG;
  const sourceRepo: string | undefined = process.env.SOURCE_REPO;
  const sourceProjectNumber: string = process.env.SOURCE_PROJECT_NUMBER || '';
  const targetProjectNumber: string = process.env.TARGET_PROJECT_NUMBER || '';

  if (!org) {
    throw Error("[ERROR] organization doesn't have a value.");
  }
  if (!sourceRepo) {
    throw Error("[ERROR] sourceRepo doesn't have a value.");
  }
  if (!sourceProjectNumber) {
    throw Error("[ERROR] sourceProjectNumber doesn't have a value.");
  }
  if (!targetProjectNumber) {
    throw Error("[ERROR] targetProjectNumber doesn't have a value.");
  }
  const repoProjectInput: GetRepoProjectInput = {
    owner: org,
    projectNumber: parseInt(sourceProjectNumber),
    repo: sourceRepo
  } as GetRepoProjectInput;
  const orgProjectInput: GetOrgProjectInput = {
    org,
    projectNumber: parseInt(targetProjectNumber)
  } as GetOrgProjectInput;
  const orgProjectResponse: GetOrgProjectResponse = await getOrgProject(orgProjectInput);
  const {id: targetProjectId} = orgProjectResponse.organization.project;

  const repoProjectResponse: GetRepoProjectResponse = await getRepoProject(repoProjectInput);
  const {columns} = repoProjectResponse.repository.project;

  for (const column of columns.nodes) {
    const cards = column.cards.nodes;
    const input: AddProjectColumnInput = {
      columnName: column.name,
      projectId: targetProjectId
    } as AddProjectColumnInput;
    let targetColumnResponse: AddProjectColumnResponse;
    try {
      targetColumnResponse = await addProjectColumn(input);
    } catch (error) {
      console.error(`[ERROR] There was an error adding a project column`, error);
      continue;
    }
    for (const card of cards) {
      const cardContentId: ID | null = card.content ? card.content.id : null;
      const cardNote: string | null = card.note ? card.note : null;
      const addProjectCardInput: AddProjectCardInput = {
        contentId: cardContentId,
        note: cardNote,
        projectColumnId: targetColumnResponse.addProjectColumn.columnEdge.node.id
      };
      const addProjectCardResponse: AddProjectCardResponse = await addProjectCard(addProjectCardInput);

      console.log(`Project Card added: ${addProjectCardResponse}`);
    }
  }
}

if(require.main === module) {
  main();
}

module.exports = main;
