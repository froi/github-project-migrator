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
import * as GitHub from './libs/github';

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

async function getProjectData(item: WorkItem): Promise<ProjectResponse> {

  switch(item.type) {
    case WorkItemType.REPO:
      {
        const {owner, name} = item.value as Repo;
        const input: GetRepoProjectInput = {
          owner: owner,
          repo: name,
          projectNumber: item.project
        } as GetRepoProjectInput;
        const sourceProjectResponse: GetRepoProjectResponse = await getRepoProject(input);
        return sourceProjectResponse.repository.project;
      }
    case WorkItemType.ORG:
      {
        const input: GetOrgProjectInput = {
          org: (item.value as Org).name,
          projectNumber: item.project
        } as GetOrgProjectInput;
        const sourceProjectResponse: GetOrgProjectResponse = await getOrgProject(input);
        return sourceProjectResponse.organization.project;
      }
  }
}
export async function* migrate(source: WorkItem, target: WorkItem): AsyncGenerator<AddProjectCardResponse> {

  // Get all the column data for our source project
  const sourceProject = await getProjectData(source);
  const {columns: sourceColumns} = sourceProject;

  // Get all the column data for our target project along with the project ID
  // The project ID is needed later on to add missing columns (if needed)
  const targetProject = await getProjectData(target);
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
        targetColumnId = (await addProjectColumn(input)).addProjectColumn.columnEdge.node.id;
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
      const addProjectCardResponse: AddProjectCardResponse = await addProjectCard(addProjectCardInput);
      yield addProjectCardResponse;
    }
  }
}
