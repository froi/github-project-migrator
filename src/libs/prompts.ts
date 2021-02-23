import {validateProjectNumberInput, validateRepoInput} from './utils';
import {ActionsTypes} from './types';

const TRANSFER_ISSUES = {
  type: "confirm",
  message: "Do you wish to transfer issues where necessary? (Labels will not be transferred)",
  name: "transferIssues"
};

export const ACTIONS_PROMPTS = [{
  type: 'list',
  name: 'action',
  choices: [
    {
      name:'Migrate from repository to organization level',
      value: ActionsTypes.REPO_TO_ORG
    },
    {
      name: 'Migrate from an organization to a repository',
      value: ActionsTypes.ORG_TO_REPO
    },
    {
      name: 'Migrate between repositories',
      value: ActionsTypes.REPO_TO_REPO
    }
  ]
}];

export const REPO_TO_ORG_PROMPTS = [
  {
    type: "input",
    message: "What is the source repository (owner/repo_name)?",
    name: "source",
    validate: validateRepoInput
  },
  {
    type: "input",
    message: "What is the project number you wish to migrate?",
    name: "sourceProjectNumber",
    validate: validateProjectNumberInput
  },
  {
    type: "input",
    message: "What is the organization you wish to migrate to?",
    name: "target",
    validate: (input: string) => {
      return input ? true : false;
    }
  },
  {
    type: "input",
    message: "What is the target project number?",
    name: "targetProjectNumber",
    validate: validateProjectNumberInput
  }
];

export const ORG_TO_REPO_PROMPTS = [
  {
    type: "input",
    message: "What is the source organization?",
    name: "source",
    validate: async (input: string) => {
      return input ? true : false;
    }
  },
  {
    type: "input",
    message: "What is the project number you wish to migrate?",
    name: "sourceProjectNumber",
    validate: validateProjectNumberInput
  },
  {
    type: "input",
    message: "What is the repository you wish to migrate to (owner/repo)?",
    name: "target",
    validate: validateRepoInput
  },
  {
    type: "input",
    message: "What is the target project number?",
    name: "targetProjectNumber",
    validate: validateProjectNumberInput
  },
  TRANSFER_ISSUES
];

export const REPO_TO_REPO_PROMPTS = [
  {
    type: "input",
    message: "What is the repository you wish to migrate from (owner/repo)?",
    name: "source",
    validate: validateRepoInput
  },
  {
    type: "input",
    message: "What is the project number you wish to migrate?",
    name: "sourceProjectNumber",
    validate: validateProjectNumberInput
  },
  {
    type: "input",
    message: "What is the repository you wish to migrate to (owner/repo)?",
    name: "target",
    validate: validateRepoInput
  },
  {
    type: "input",
    message: "What is the target project number?",
    name: "targetProjectNumber",
    validate: validateProjectNumberInput
  },
  TRANSFER_ISSUES
];

export const ORG_TO_ORG_PROMPTS = [
  {
    type: "input",
    message: "What organization are the projects in?",
    name: "org"
  },
  {
    type: "input",
    message: "What is the project number you wish to migrate?",
    name: "sourceProjectNumber",
    validate: validateProjectNumberInput
  },
  {
    type: "input",
    message: "What is the project number you wish to migrate to?",
    name: "targetProjectNumber",
    validate: validateProjectNumberInput
  },
];

export const AUTH_PROMPTS = [
  {
    type: "input",
    message: "What is the source repository (owner/repo_name)?",
    name: "source",
    validate: validateRepoInput
  },
  {
    type: "input",
    message: "What is the project number you wish to migrate?",
    name: "sourceProjectNumber",
    validate: validateProjectNumberInput
  },
  {
    type: "input",
    message: "What is the organization you wish to migrate to?",
    name: "target",
    validate: (input: string) => {
      return input ? true : false;
    }
  },
  {
    type: "input",
    message: "What is the target project number?",
    name: "targetProjectNumber",
    validate: validateProjectNumberInput
  }
];
