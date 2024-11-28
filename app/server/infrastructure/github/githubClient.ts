export class GithubClient {
  constructor(
    private readonly owner: string,
    private readonly repo: string,
    private readonly githubToken: string,
  ) {}

  public downloadArtifact = async (artifactId: string): Promise<Buffer> => {
    const artifactUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/actions/artifacts/${artifactId}/zip`;

    const response = await fetch(artifactUrl, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to download artifact: ${errorText}`);
    }

    return Buffer.from(await response.arrayBuffer());
  };
}
