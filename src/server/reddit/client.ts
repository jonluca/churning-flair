import type { RedditClientConfig, RedditTokenResponse, RedditUserData, RedditFlairResponse } from "./types";

export class RedditClient {
  private static readonly OAUTH_URL = "https://www.reddit.com/api/v1/authorize";
  private static readonly TOKEN_URL = "https://www.reddit.com/api/v1/access_token";
  private static readonly API_URL = "https://oauth.reddit.com";

  private config: RedditClientConfig;

  constructor(config: RedditClientConfig) {
    this.config = config;
  }

  generateAuthUrl(state: string): string {
    return `${RedditClient.OAUTH_URL}?client_id=${this.config.clientId}&response_type=code&state=${state}&redirect_uri=${this.config.redirectUri}&duration=temporary&scope=identity`;
  }

  private createBasicAuth(clientId: string, clientSecret: string): string {
    return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
  }

  async getAccessToken(code: string): Promise<RedditTokenResponse> {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.config.redirectUri,
    });

    const response = await fetch(RedditClient.TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: this.createBasicAuth(this.config.clientId, this.config.clientSecret),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to get access token: ${data.error}`);
    }

    return data as RedditTokenResponse;
  }

  async getUserData(accessToken: string): Promise<RedditUserData> {
    const response = await fetch(`${RedditClient.API_URL}/api/v1/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to get user data: ${data.error}`);
    }

    if (!data.name) {
      throw new Error("No user data found");
    }
    return data as RedditUserData;
  }

  async getModAccessToken(): Promise<RedditTokenResponse> {
    const params = new URLSearchParams({
      grant_type: "password",
      username: this.config.modUsername,
      password: this.config.modPassword,
    });

    const response = await fetch(RedditClient.TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: this.createBasicAuth(this.config.modScriptId, this.config.modScriptSecret),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const data = await response.json();
    if (!response.ok || !data.access_token) {
      throw new Error(`Failed to get mod access token: ${data.error}`);
    }

    return data as RedditTokenResponse;
  }

  async setUserFlair(modAccessToken: string, username: string, flairText: string): Promise<RedditFlairResponse> {
    const response = await fetch(`${RedditClient.API_URL}/r/${this.config.subreddit}/api/flair`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${modAccessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        api_type: "json",
        name: username,
        text: flairText,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to set user flair: ${JSON.stringify(data)}`);
    }

    return data as RedditFlairResponse;
  }
}
