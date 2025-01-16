export interface RedditTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface RedditUserData {
  name: string;
  id: string;
  created: number;
  verified: boolean;
}

export interface RedditFlairResponse {
  json: {
    errors: string[];
    ok?: boolean;
  };
}

export interface RedditClientConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  subreddit: string;
  modUsername: string;
  modPassword: string;
  modScriptId: string;
  modScriptSecret: string;
}
