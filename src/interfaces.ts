import { RequestParameters } from '@octokit/types';

export interface GetOrgProjectResponse {
    organization: {
        project: {
            id: string;
            name: string;
        }
    }
}
interface RepoProjectCard {
    content: {
        __typename: string;
        id: string;
        number: number;
    }
}
interface RepoProjectColumns {
    name: string;
    cards: {
        nodes: RepoProjectCard[];
    }
}
export interface GetRepoProjectResponse {
    repository: {
        project: {
            name: string;
            columns: {
                nodes: RepoProjectColumns[];
            }
        }
    }
}
export interface AddProjectColumnInput extends RequestParameters {
    projectId: number;
    columnName: string;
}
export interface GetOrgProjectInput extends RequestParameters {
    org: string;
    projectNumber: number;
}
export interface GetRepoProjectInput extends RequestParameters {
    owner: string;
    repo: string;
    projectNumber: string;
}