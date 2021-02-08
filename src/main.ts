import {
  AddProjectCardInput,
  AddProjectCardResponse,
  AddProjectColumnInput,
  AddProjectColumnResponse,
  GetOrgProjectInput,
  GetRepoProjectInput,
  GetOrgProjectResponse,
  GetRepoProjectResponse,
  GraphQlQueries,
  WorkItem,
  WorkItemType,
  Repo,
  Org,
  TransferIssueInput,
  TransferIssueResponse,
  CardContentType,
  Content,
  ID
} from './libs/types';
import {getGraphqlQuery} from './libs/utils';
import {createClient} from './libs/github';
import { graphql as GraphQL } from '@octokit/graphql/dist-types/types';
import path from "path";

const GRAPHQL_QUERIES_PATH = path.join(path.dirname(__filename), 'graphql');

async function addProjectColumn(input: AddProjectColumnInput, gitHubClient: GraphQL): Promise<AddProjectColumnResponse> {
  const mutation = getGraphqlQuery(GRAPHQL_QUERIES_PATH, GraphQlQueries.ADD_PROJECT_COLUMN);
  const result: AddProjectColumnResponse = await gitHubClient(mutation, input);
  return result;
}
async function addProjectCard(input: AddProjectCardInput, gitHubClient: GraphQL): Promise<AddProjectCardResponse> {
  const mutation = getGraphqlQuery(GRAPHQL_QUERIES_PATH, GraphQlQueries.ADD_PROJECT_CARD);
  const result: AddProjectCardResponse = await gitHubClient(mutation, input);
  return result;
}
async function transferIssue(input: TransferIssueInput, gitHubClient: GraphQL): Promise<Content> {
  const mutation = getGraphqlQuery(GRAPHQL_QUERIES_PATH, GraphQlQueries.TRANSFER_ISSUE);
  const result: TransferIssueResponse = await gitHubClient(mutation, input);
  return {
    __typename: CardContentType.ISSUE,
    id: result.transferIssue.issue.id,
    number: result.transferIssue.issue.number,
    url: result.transferIssue.issue.url
  };
}
async function getOrgProject(input: GetOrgProjectInput, gitHubClient: GraphQL): Promise<GetOrgProjectResponse> {
  const query = getGraphqlQuery(GRAPHQL_QUERIES_PATH, GraphQlQueries.GET_ORG_PROJECT);
  const result: GetOrgProjectResponse = await gitHubClient(query, input);
  return result;
}
async function getRepoProject(input: GetRepoProjectInput, gitHubClient: GraphQL): Promise<GetRepoProjectResponse> {
  const query = getGraphqlQuery(GRAPHQL_QUERIES_PATH, GraphQlQueries.GET_REPO_PROJECT);
  const result: GetRepoProjectResponse = await gitHubClient(query, input);
  return result;
}

async function getProjectData(item: WorkItem, gitHubClient: GraphQL): Promise<GetRepoProjectResponse | GetOrgProjectResponse> {

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
        return sourceProjectResponse;
      }
    case WorkItemType.ORG:
      {
        const input: GetOrgProjectInput = {
          org: (item.value as Org).name,
          projectNumber: item.project
        } as GetOrgProjectInput;
        const sourceProjectResponse: GetOrgProjectResponse = await getOrgProject(input, gitHubClient);
        return sourceProjectResponse;
      }
  }
}
export async function* migrate(source: WorkItem, target: WorkItem, gitHubHost: string, transferIssues = false): AsyncGenerator<AddProjectCardResponse> {

  const gitHubClient = createClient(gitHubHost);
  // Get all the column data for our source project
  const sourceProject = await getProjectData(source, gitHubClient);
  const {columns: sourceColumns} = source.type === WorkItemType.REPO
    ? (sourceProject as GetRepoProjectResponse).repository.project
    : (sourceProject as GetOrgProjectResponse).organization.project;

  // Get all the column data for our target project along with the project ID
  // The project ID is needed later on to add missing columns (if needed)
  const targetProject = await getProjectData(target, gitHubClient);
  const {id: targetProjectId, columns: targetColumns} = target.type === WorkItemType.REPO
  ? (targetProject as GetRepoProjectResponse).repository.project
  : (targetProject as GetOrgProjectResponse).organization.project;

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

    for (const card of sourceColumn.cards.nodes) {
      let cardContent = card.content ? card.content : null;
      let cardNote: string | null = card.note ? card.note : null;

      if(transferIssues) { // TODO; Should this be moved into transferIssue????
        if(cardContent && target.type === WorkItemType.REPO) { // Content is either a Pull Request or an Issue
          if(cardContent.__typename == CardContentType.ISSUE) {
            const issueId: ID = cardContent.id;
            const repositoryId: ID = (targetProject as GetRepoProjectResponse).repository.id;
            const input: TransferIssueInput = {
              issueId,
              repositoryId
            };
            cardContent = await transferIssue(input, gitHubClient);
          } else {
            cardNote = ":rotating_light: The source content was a __Pull Request__. :rotating_light:\n\n" +
              "Pull Requests can't be transferred. The migrator has added the URL to the source PR to this note.\n\n" +
              ":octocat:\n" +
              `${cardContent?.url}`;
          }
        }
      } else {
        if(cardContent && target.type === WorkItemType.REPO) {
          cardNote = ":rotating_light: The source content was not transferred :rotating_light:\n\n" +
            "The migrator has added the source content URL to this note." +
            ":octocat:\n" +
            `${cardContent?.url}`;
          cardContent = null;
        }
      }

      const addProjectCardInput: AddProjectCardInput = {
        contentId: cardContent?.id,
        note: cardNote,
        projectColumnId: targetColumnId
      };
      const addProjectCardResponse: AddProjectCardResponse = await addProjectCard(addProjectCardInput, gitHubClient);
      yield addProjectCardResponse;
    }
  }
}
