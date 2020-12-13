import * as inquirer from 'inquirer';
import {validateProjectNumberInput, validateRepoInput, splitRepo} from './libs/utils';
import {WorkItem, WorkItemType, DefaultCliAnswers, OrgToOrgCliAnswers} from './libs/types';
import {migrate} from './main';

async function main(): Promise<void> {
  const {action} = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      choices: [
        {
          name:'Migrate from repository to organization level',
          value: 'repoToOrg'
        },
        {
          name: 'Migrate from an organization to a repository',
          value: 'orgToRepo'
        },
        {
          name: 'Migrate between repositories',
          value: 'repoToRepo'
        }
      ]
    }
  ]);

  let source: WorkItem;
  let target: WorkItem;
  let answers: DefaultCliAnswers | OrgToOrgCliAnswers;
  switch(action) {
    case 'repoToOrg':
      answers = await inquirer.prompt([
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
      ]) as DefaultCliAnswers;
      source = {
        type: WorkItemType.REPO,
        value: splitRepo(answers.source),
        project: parseInt(answers.sourceProjectNumber)
      };
      target = {
        type: WorkItemType.ORG,
        value: {
          name: answers.target,
        },
        project: parseInt(answers.targetProjectNumber)
      };
      for await(const result of migrate(source, target)){
        console.log(JSON.stringify(result, null, 2));
      }
      break;
    case 'orgToRepo':
      answers = await inquirer.prompt([
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
        }
      ]) as DefaultCliAnswers;
      source = {
        type: WorkItemType.ORG,
        value: {
          name: answers.source,
        },
        project: parseInt(answers.sourceProjectNumber)
      };
      target = {
        type: WorkItemType.REPO,
        value: splitRepo(answers.target),
        project: parseInt(answers.targetProjectNumber)
      };
      for await(const result of migrate(source, target)){
        console.log(JSON.stringify(result, null, 2));
      }
      break;
    case 'repoToRepo':
      answers = await inquirer.prompt([
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
        }
      ]) as DefaultCliAnswers;

      source = {
        type: WorkItemType.REPO,
        value: splitRepo(answers.source),
        project: parseInt(answers.sourceProjectNumber)
      };
      target = {
        type: WorkItemType.REPO,
        value: splitRepo(answers.target),
        project: parseInt(answers.targetProjectNumber)
      };
      for await(const result of migrate(source, target)){
        console.log(JSON.stringify(result, null, 2));
      }
      break;
    case 'orgToOrg':
      answers = await inquirer.prompt([
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
      ]) as OrgToOrgCliAnswers;
      source = {
        type: WorkItemType.ORG,
        value: {
          name: answers.org
        },
        project: parseInt(answers.sourceProjectNumber)
      };
      target = {
        type: WorkItemType.ORG,
        value: {
          name: answers.org
        },
        project: parseInt(answers.targetProjectNumber)
      };
      for await(const result of migrate(source, target)){
        console.log(JSON.stringify(result, null, 2));
      }
      break;
    default:
      console.log("Nope");
  }
}

main()
  .catch(error => console.error(error));
