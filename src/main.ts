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
  GraphQlQueries,
  WorkItem,
  WorkItemType,
  Repo,
  Org,
  ProjectResponse
} from './libs/types';
import {getGraphqlQuery} from './libs/utils';
import {createClient} from './libs/github';
import { graphql as GraphQL } from '@octokit/graphql/dist-types/types';

async function addProjectColumn(input: AddProjectColumnInput, gitHubClient: GraphQL): Promise<AddProjectColumnResponse> {
  const mutation = getGraphqlQuery(GraphQlQueries.ADD_PROJECT_COLUMN);
  const result: AddProjectColumnResponse = await gitHubClient(mutation, input);
  return result;
}
async function addProjectCard(input: AddProjectCardInput, gitHubClient: GraphQL): Promise<AddProjectCardResponse> {
  const mutation = getGraphqlQuery(GraphQlQueries.ADD_PROJECT_CARD);
  const result: AddProjectCardResponse = await gitHubClient(mutation, input);
  return result;
}
async function getOrgProject(input: GetOrgProjectInput, gitHubClient: GraphQL): Promise<GetOrgProjectResponse> {
  const query = getGraphqlQuery(GraphQlQueries.GET_ORG_PROJECT);
  const result: GetOrgProjectResponse = await gitHubClient(query, input);
  return result;
}
async function getRepoProject(input: GetRepoProjectInput, gitHubClient: GraphQL): Promise<GetRepoProjectResponse> {
  const query = getGraphqlQuery(GraphQlQueries.GET_REPO_PROJECT);
  const result: GetRepoProjectResponse = await gitHubClient(query, input);
  return result;
}

async function getProjectData(item: WorkItem, gitHubClient: GraphQL): Promise<ProjectResponse> {

  switch(item.type) {
    case WorkItemType.REPO:
      {
        const {owner, name} = item.value as Repo;
        const input: GetRepoProjectInput = {
          owner: owner,
          repo: name,
          projectNumber: item.project
        } as GetRepoProjectInput;
        const sourceProjectResponse: GetRepoProjectResponse = await getRepoProject(input, gitHubClient);
        return sourceProjectResponse.repository.project;
      }
    case WorkItemType.ORG:
      {
        const input: GetOrgProjectInput = {
          org: (item.value as Org).name,
          projectNumber: item.project
        } as GetOrgProjectInput;
        const sourceProjectResponse: GetOrgProjectResponse = await getOrgProject(input, gitHubClient);
        return sourceProjectResponse.organization.project;
      }
  }
}
export async function* migrate(source: WorkItem, target: WorkItem, gitHubHost: string): AsyncGenerator<AddProjectCardResponse> {

  const gitHubClient = createClient(gitHubHost);
  // Get all the column data for our source project
  const sourceProject = await getProjectData(source, gitHubClient);
  const {columns: sourceColumns} = sourceProject;

  // Get all the column data for our target project along with the project ID
  // The project ID is needed later on to add missing columns (if needed)
  const targetProject = await getProjectData(target, gitHubClient);
  const {id: targetProjectId, columns: targetColumns} = targetProject;

  for (const sourceColumn of sourceColumns.nodes) {
    let targetColumnId: string;

    // Filter targetColumns array to the column that matches the name of the current source column
    // This is later used to determine if we need to add the column to the target project.
    const filteredTargetColumns = targetColumns.nodes.filter(column => column.name === sourceColumn.name);
    if(filteredTargetColumns.length === 0) {
      try {
        const input: AddProjectColumnInput = {
          columnName: sourceColumn.name,
          projectId: targetProjectId
        } as AddProjectColumnInput;
        targetColumnId = (await addProjectColumn(input, gitHubClient)).addProjectColumn.columnEdge.node.id;
      } catch (error) {
        console.error(`[ERROR] There was an error adding a project column`, error);
        continue;
      }
    } else {
      targetColumnId = filteredTargetColumns[0].id;
    }

    const cards = sourceColumn.cards.nodes;
    for (const card of cards) {
      const cardContentId: ID | null = card.content ? card.content.id : null;
      const cardNote: string | null = card.note ? card.note : null;
      const addProjectCardInput: AddProjectCardInput = {
        contentId: cardContentId,
        note: cardNote,
        projectColumnId: targetColumnId
      };
      const addProjectCardResponse: AddProjectCardResponse = await addProjectCard(addProjectCardInput, gitHubClient);
      yield addProjectCardResponse;
    }
  }
}
