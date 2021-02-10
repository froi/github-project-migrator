#!/usr/bin/env node

import * as inquirer from 'inquirer';
import {splitRepo, getConfig} from './libs/utils';
import {WorkItem, WorkItemType, DefaultCliAnswers, OrgToOrgCliAnswers, ActionsTypes} from './libs/types';
import * as prompts from './libs/prompts';
import {migrate} from './main';
import {auth} from './libs/auth';
import {program} from 'commander';

async function repoToOrg(gitHubHost: string): Promise<void> {
  const answers: DefaultCliAnswers | OrgToOrgCliAnswers = await inquirer.prompt(prompts.REPO_TO_ORG_PROMPTS) as DefaultCliAnswers;
  const source: WorkItem = {
    type: WorkItemType.REPO,
    value: splitRepo(answers.source),
    project: parseInt(answers.sourceProjectNumber)
  };
  const target: WorkItem = {
    type: WorkItemType.ORG,
    value: {
      name: answers.target,
    },
    project: parseInt(answers.targetProjectNumber)
  };
  for await(const result of migrate(source, target, gitHubHost)){
    const column = result.addProjectCard.cardEdge.node.column;
    const messsage = `Card created for project ${column.project.name} in column ${column.name}`;

    console.log(messsage);
  }
}
async function orgToRepo(gitHubHost: string): Promise<void> {
  const answers: DefaultCliAnswers | OrgToOrgCliAnswers = await inquirer.prompt(prompts.ORG_TO_REPO_PROMPTS) as DefaultCliAnswers;
  const source: WorkItem = {
    type: WorkItemType.ORG,
    value: {
      name: answers.source,
    },
    project: parseInt(answers.sourceProjectNumber)
  };
  const target: WorkItem = {
    type: WorkItemType.REPO,
    value: splitRepo(answers.target),
    project: parseInt(answers.targetProjectNumber)
  };
  for await(const result of migrate(source, target, gitHubHost, answers.transferIssues)){
    const column = result.addProjectCard.cardEdge.node.column;
    const messsage = `Card created for project ${column.project.name} in column ${column.name}`;

    console.log(messsage);
  }
}
async function repoToRepo(gitHubHost: string): Promise<void> {
  const answers: DefaultCliAnswers | OrgToOrgCliAnswers = await inquirer.prompt(prompts.REPO_TO_REPO_PROMPTS) as DefaultCliAnswers;
  const source: WorkItem = {
    type: WorkItemType.REPO,
    value: splitRepo(answers.source),
    project: parseInt(answers.sourceProjectNumber)
  };
  const target: WorkItem = {
    type: WorkItemType.REPO,
    value: splitRepo(answers.target),
    project: parseInt(answers.targetProjectNumber)
  };
  for await(const result of migrate(source, target, gitHubHost, answers.transferIssues)){
    const column = result.addProjectCard.cardEdge.node.column;
    const messsage = `Card created for project ${column.project.name} in column ${column.name}`;

    console.log(messsage);
  }
}
async function orgToOrg(gitHubHost: string): Promise<void> {
  const answers: DefaultCliAnswers | OrgToOrgCliAnswers = await inquirer.prompt(prompts.ORG_TO_ORG_PROMPTS) as OrgToOrgCliAnswers;
  const source: WorkItem = {
    type: WorkItemType.ORG,
    value: {
      name: answers.org
    },
    project: parseInt(answers.sourceProjectNumber)
  };
  const target: WorkItem = {
    type: WorkItemType.ORG,
    value: {
      name: answers.org
    },
    project: parseInt(answers.targetProjectNumber)
  };
  for await(const result of migrate(source, target, gitHubHost)){
    const column = result.addProjectCard.cardEdge.node.column;
    const messsage = `Card created for project ${column.project.name} in column ${column.name}`;

    console.log(messsage);
  }
}

async function main(): Promise<void> {

  program
    .command('migrate')
    .action(async () => {
      const gitHubHost = 'github.com';
      let config = getConfig(gitHubHost);

      if(!config || !config.oauth_token) {
        config = await auth(gitHubHost);
      }

      const { action } = await inquirer.prompt(prompts.ACTIONS_PROMPTS);

      switch(action) {
        case ActionsTypes.REPO_TO_ORG:
          await repoToOrg(gitHubHost);
          break;
        case ActionsTypes.ORG_TO_REPO:
          await orgToRepo(gitHubHost);
          break;
        case ActionsTypes.REPO_TO_REPO:
          await repoToRepo(gitHubHost);
          break;
        case ActionsTypes.ORG_TO_ORG:
          await orgToOrg(gitHubHost);
          break;
        default:
          console.log("🧐 This is an unrecognized option. 🤭");
      }
    });
    program.command('auth')
      .action(async () => {
        // const homeDir = homedir();
        const gitHubHost = 'github.com';
        const config = getConfig(gitHubHost);
        let execAuth = true;

        if(config && config.oauth_token) {
          const {reAuth} = await inquirer.prompt([{
            type: 'confirm',
            message: `⚠️ You've already authenticated. Do you wish to do so again?`,
            name: 'reAuth'
          }]) as { reAuth: boolean};
          execAuth = reAuth;
        }
        if( execAuth ) {
          await auth(gitHubHost);
        } else {
          console.log('OK, have a good one! 😊');
        }
      });

    program.parseAsync(process.argv);
}

main()
  .catch(error => console.error(error));
