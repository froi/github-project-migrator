import { RequestParameters } from "@octokit/types";

export type HTML = string;
export type ID = string;
export type URI = string;
export type DateTime = Date;

// export interface ProjectCard {
//     column: ProjectColumn;
//     content: ProjectCardItem;
//     createdAt: DateTime;
//     creator: Actor;
//     databaseId: number;
//     id: ID;
//     isArchived: Boolean;
//     note: String;
//     project: Project;
//     resourcePath: URI;
//     state: ProjectCardState;
//     updatedAt: DateTime;
//     url: URI;
// }
export interface ProjectColumn {
  createdAt: DateTime;
  databaseId: number;
  id: ID;
  name: string;
  project: Project;
  purpose: ProjectColumnPurpose;
  resourcePath: URI;
  updatedAt: DateTime;
  url: URI;
  cards: [];
}
export interface Actor {
  login: string;
  resourcePath: URI;
  url: URI;
}
export interface Project {
  body: String;
  bodyHTML: HTML;
  closed: boolean;
  closedAt: DateTime;
  createdAt: DateTime;
  creator: Actor;
  databaseId: number;
  id: ID;
  name: string;
  number: number;
  owner: ProjectOwner;
  resourcePath: URI;
  state: ProjectState;
  updatedAt: DateTime;
  url: URI;
  viewerCanUpdate: boolean;
}
export interface ProjectOwner {
  id: ID;
  projectsResourcePath: URI;
  projectsUrl: URI;
  viewerCanCreateProject: boolean;
}
export enum ProjectState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
}
export enum ProjectColumnPurpose {
  DONE = "DONE",
  IN_PROGRESS = "IN_PROGRESS",
  TODO = "TODO",
}
export interface ProjectCard {
  note: string;
  content: {
    __typename: string;
    id: ID;
    number: number;
  };
}
export interface RepoProjectColumns {
  name: string;
  cards: {
    nodes: ProjectCard[];
  };
}

export interface GetRepoProjectResponse {
  repository: {
    project: {
      id: ID;
      name: string;
      columns: {
        nodes: RepoProjectColumns[];
      };
    };
  };
}
export interface GetOrgProjectResponse {
  organization: {
    project: {
      id: ID;
      name: string;
    };
  };
}
export interface AddProjectColumnResponse {
  addProjectColumn: {
    columnEdge: {
      node: {
        id: ID;
        name: string;
      };
    };
    project: {
      id: ID;
    };
  };
}
export interface AddProjectCardResponse {
  addProjectCard: {
    cardEdge?: {
      node: {
        id: ID;
        column: {
          id: ID;
          name: string;
          url: string;
          project: {
            id: ID;
            name: string;
            url: string;
          }
        };
        creator: {
          url: string;
          login: string;
        };
        note?: string;
        content?: {
          url: string;
          title: string;
          number: number;
        }
      };
    projectColumn?: {
      id: ID;
    };
  };
}
export interface AddProjectCardInput extends RequestParameters {
  clientMutationId?: string;
  contentId?: ID | null;
  note?: string | null;
  projectColumnId: ID;
}
export interface AddProjectColumnInput extends RequestParameters {
  projectId: ID;
  columnName: string;
}
export interface GetOrgProjectInput extends RequestParameters {
  org: string;
  projectNumber: number;
}
export interface GetRepoProjectInput extends RequestParameters {
  owner: string;
  repo: string;
  projectNumber: number;
}

export enum GraphQlQueries {
  ADD_PROJECT_CARD = "add-project-card.graphql",
  GET_ORG_PROJECT = "get-org-project.graphql",
  GET_REPO_PROJECT = "get-repo-project.graphql",
  ADD_PROJECT_COLUMN = "add-project-column.graphql"
}

export enum WorkItemType {
  REPO,
  ORG
}
export interface Repo {
  name: string;
  owner: string;
}
export interface Org {
  name: string;
}
export interface WorkItem {
  project: number;
  type: WorkItemType
  value: Repo | Org;
}

export interface DefaultCliAnswers {
  source: string;
  sourceProjectNumber: string;
  target: string;
  targetProjectNumber: string;
}

export interface OrgToOrgCliAnswers {
   org: string;
   sourceProjectNumber: string;
   targetProjectNumber: string;
}
