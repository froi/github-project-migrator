import {graphql} from '@octokit/graphql';
import { getConfig } from './utils';
import { HostConfig } from './types';
import { graphql as GraphQL } from '@octokit/graphql/dist-types/types';

export function createClient(githubHost: string): GraphQL {
  const {oauth_token} = getConfig(githubHost) as HostConfig;
  return graphql.defaults({
    headers: {
      authorization: `token ${oauth_token}`
    }
  });
}
