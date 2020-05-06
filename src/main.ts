require("dotenv").config();

import { graphql } from '@octokit/graphql';
import {
    AddProjectColumnInput,
    GetOrgProjectInput,
    GetRepoProjectInput,
    GetOrgProjectResponse,
    GetRepoProjectResponse
} from './interfaces'

const graphqlWithAuth = graphql.defaults({
    headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
    }
});


async function addProjectColumn(input: AddProjectColumnInput) {
    const mutation = `mutation($projectId: ID!, $columnName: String! ) {
      addProjectColumn(input: { name: $columnName, projectId: $projectId }) {
        columnEdge {
          node {
            id
            name
          }
        }
        project {
          id
        }
      }
    }`;
    const result = await graphqlWithAuth(mutation, input);
    return result;
}

async function getOrgProject(input: GetOrgProjectInput): Promise<GetOrgProjectResponse> {
    const query = `query ($org: String!, $projectNumber: Int!){
      organization(login:$org) {
        project(number:$projectNumber) {
          id
          name
        }
      }
    }`
    return <GetOrgProjectResponse> await graphqlWithAuth(query, input);
}
async function getRepoProject(input: GetRepoProjectInput): Promise<GetRepoProjectResponse> {
    const query = `query ($owner: String!, $repo: String!, $projectNumber: Int!){
      repository(name:$repo, owner:$owner) {
        project(number:$projectNumber) {
          name
          columns(first:100){
            nodes {
              name
              cards(first:100){
                nodes {
                  content {
                    __typename
                    ...on Issue {
                      id
                      number
                    }
                    ...on PullRequest {
                      id
                      number
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`
  
    return <GetRepoProjectResponse> await graphqlWithAuth(query, input);
  }
async function main() {
    const result: GetOrgProjectResponse = await getOrgProject({
        org: 'department-of-veterans-affairs',
        projectNumber: 143
    });
    const { id: targetProjectId, name: targetProjectName } = result.organization.project;



    console.log(result);
}

main();
