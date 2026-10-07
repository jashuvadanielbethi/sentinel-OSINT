import crypto from 'crypto';
import type {
  UsernameProfileFinding,
  ConfidenceTier,
  ProfileStatus,
  CorrelationGraphData,
  CorrelationNode,
  CorrelationLink,
  EvidenceItem,
} from '../../types/osint.ts';

export function normalizeUsername(input: string): string {
  if (!input) return '';
  return input.trim().replace(/^@+/, '').toLowerCase();
}

export function getConfidenceTier(score: number): ConfidenceTier {
  if (score >= 90) return 'Very High';
  if (score >= 75) return 'High';
  if (score >= 50) return 'Medium';
  if (score >= 25) return 'Low';
  return 'Very Low';
}

export function createSha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export interface ProviderCheckOptions {
  scope: string;
  isDemoMode: boolean;
}

export class UsernameDiscoveryEngine {
  async executeInvestigation(
    username: string,
    options: ProviderCheckOptions
  ): Promise<{
    findings: UsernameProfileFinding[];
    graph: CorrelationGraphData;
    evidence: EvidenceItem[];
    overallConfidence: number;
  }> {
    const cleanUsername = normalizeUsername(username);
    const findings: UsernameProfileFinding[] = [];
    const evidenceList: EvidenceItem[] = [];

    // Synthetic Demo profile templates if in demo mode or demo username
    const isDemoTarget = cleanUsername.includes('demo') || cleanUsername.includes('test') || options.isDemoMode;

    // Platform 1: GitHub (Code Platform)
    if (this.scopeMatches(options.scope, ['All Supported Sources', 'Code Platforms'])) {
      const ghResult = await this.checkGitHub(cleanUsername, isDemoTarget);
      findings.push(ghResult.finding);
      if (ghResult.evidence) evidenceList.push(ghResult.evidence);
    }

    // Platform 2: Reddit (Forums / Social)
    if (this.scopeMatches(options.scope, ['All Supported Sources', 'Forums', 'Social Platforms'])) {
      const redditResult = await this.checkReddit(cleanUsername, isDemoTarget);
      findings.push(redditResult.finding);
      if (redditResult.evidence) evidenceList.push(redditResult.evidence);
    }

    // Platform 3: Hacker News (Forums / Code)
    if (this.scopeMatches(options.scope, ['All Supported Sources', 'Forums', 'Code Platforms'])) {
      const hnResult = await this.checkHackerNews(cleanUsername, isDemoTarget);
      findings.push(hnResult.finding);
      if (hnResult.evidence) evidenceList.push(hnResult.evidence);
    }

    // Platform 4: Mastodon / Fediverse (Social / Public Fediverse)
    if (this.scopeMatches(options.scope, ['All Supported Sources', 'Social Platforms', 'Fediverse'])) {
      const mastodonResult = await this.checkMastodon(cleanUsername, isDemoTarget);
      findings.push(mastodonResult.finding);
      if (mastodonResult.evidence) evidenceList.push(mastodonResult.evidence);
    }

    // Platform 5: GitLab / Code Repositories (Code Platform)
    if (this.scopeMatches(options.scope, ['All Supported Sources', 'Code Platforms'])) {
      const gitlabResult = await this.checkGitLab(cleanUsername, isDemoTarget);
      findings.push(gitlabResult.finding);
      if (gitlabResult.evidence) evidenceList.push(gitlabResult.evidence);
    }

    // Platform 6: Public Developer Portfolio / Website (Public Web)
    if (this.scopeMatches(options.scope, ['All Supported Sources', 'Public Web'])) {
      const webResult = await this.checkPublicWeb(cleanUsername, isDemoTarget);
      findings.push(webResult.finding);
      if (webResult.evidence) evidenceList.push(webResult.evidence);
    }

    // Calculate aggregated confidence (weighted average of matched profiles)
    const validScores = findings
      .filter((f) => f.profileStatus === 'Potential Match' || f.profileStatus === 'Username Correlation')
      .map((f) => f.confidenceScore);

    const overallConfidence = validScores.length > 0
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : 15;

    // Generate evidence correlation graph
    const graph = this.buildCorrelationGraph(cleanUsername, findings);

    return {
      findings,
      graph,
      evidence: evidenceList,
      overallConfidence,
    };
  }

  private scopeMatches(currentScope: string, allowedScopes: string[]): boolean {
    if (currentScope === 'All Supported Sources') return true;
    return allowedScopes.includes(currentScope);
  }

  private async checkGitHub(
    username: string,
    isDemo: boolean
  ): Promise<{ finding: UsernameProfileFinding; evidence?: EvidenceItem }> {
    const now = new Date().toISOString();
    const profileUrl = `https://github.com/${username}`;

    if (isDemo) {
      const score = 87;
      const finding: UsernameProfileFinding = {
        id: `finding-gh-${username}`,
        platform: 'GitHub',
        platformCategory: 'Code',
        username,
        profileUrl,
        profileStatus: 'Potential Match',
        confidenceScore: score,
        confidenceTier: getConfidenceTier(score),
        evidence: [
          'DEMO DATA: Exact public handle registration detected',
          'DEMO DATA: Public profile metadata includes cybersecurity/research keywords',
          'DEMO DATA: Public repository activity correlated with handle',
        ],
        lastChecked: now,
        source: 'GitHub Public API (Demo Sandbox)',
        rawMetadata: { public_repos: 14, followers: 42, created_at: '2023-04-12T00:00:00Z' },
        isRelevant: true,
      };

      const evidence: EvidenceItem = {
        id: `ev-gh-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        investigationId: '',
        source: 'GitHub Public Profile Endpoint',
        type: 'profile',
        url: profileUrl,
        title: `GitHub Potential Profile: @${username}`,
        description: `Discovered public GitHub handle with verified public contributions. Identity cannot be definitively linked without secondary verification.`,
        confidence: score,
        timestamp: now,
        hash: createSha256(`${profileUrl}:${username}:${now}`),
        isRelevant: true,
        isFalsePositive: false,
        chainOfCustodyRecord: {
          collectorAgent: 'Username OSINT Agent',
          acquisitionMethod: 'Public REST API Check (Read-Only)',
          verifiedIntegrity: true,
        },
      };

      return { finding, evidence };
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers: { 'User-Agent': 'OSINT-Sentinel-Research-Platform' },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.status === 200) {
        const data = await res.json();
        const score = 85;
        const finding: UsernameProfileFinding = {
          id: `finding-gh-${username}`,
          platform: 'GitHub',
          platformCategory: 'Code',
          username,
          profileUrl,
          profileStatus: 'Potential Match',
          confidenceScore: score,
          confidenceTier: getConfidenceTier(score),
          evidence: [
            `Exact public handle verified (${data.login})`,
            data.bio ? `Public bio: "${data.bio.slice(0, 100)}"` : 'Public profile active without custom bio',
            `Public repositories: ${data.public_repos}`,
          ],
          lastChecked: now,
          source: 'GitHub Public API',
          rawMetadata: { public_repos: data.public_repos, followers: data.followers },
          isRelevant: true,
        };

        const evidence: EvidenceItem = {
          id: `ev-gh-${Date.now()}`,
          investigationId: '',
          source: 'GitHub Public API',
          type: 'profile',
          url: profileUrl,
          title: `GitHub Match for @${username}`,
          description: `Verified public profile exists on GitHub with ${data.public_repos} public repositories. Potential match; cannot verify real-world legal identity.`,
          confidence: score,
          timestamp: now,
          hash: createSha256(`${profileUrl}:${data.id}:${now}`),
          isRelevant: true,
          isFalsePositive: false,
          chainOfCustodyRecord: {
            collectorAgent: 'Username OSINT Agent',
            acquisitionMethod: 'Live Public Endpoint Inspection',
            verifiedIntegrity: true,
          },
        };
        return { finding, evidence };
      }

      if (res.status === 404) {
        return {
          finding: {
            id: `finding-gh-${username}`,
            platform: 'GitHub',
            platformCategory: 'Code',
            username,
            profileUrl,
            profileStatus: 'No Match Found',
            confidenceScore: 0,
            confidenceTier: 'Very Low',
            evidence: ['Public profile does not exist on platform'],
            lastChecked: now,
            source: 'GitHub Public API',
            isRelevant: false,
          },
        };
      }

      // Rate limit or unavailable
      return {
        finding: {
          id: `finding-gh-${username}`,
          platform: 'GitHub',
          platformCategory: 'Code',
          username,
          profileUrl,
          profileStatus: 'Provider Unavailable',
          confidenceScore: 0,
          confidenceTier: 'Very Low',
          evidence: ['Upstream public API rate limit reached or service temporarily unavailable'],
          lastChecked: now,
          source: 'GitHub Public API',
          isRelevant: false,
        },
      };
    } catch {
      return {
        finding: {
          id: `finding-gh-${username}`,
          platform: 'GitHub',
          platformCategory: 'Code',
          username,
          profileUrl,
          profileStatus: 'Provider Unavailable',
          confidenceScore: 0,
          confidenceTier: 'Very Low',
          evidence: ['Source could not be verified due to outbound network timeout'],
          lastChecked: now,
          source: 'GitHub Public API',
        },
      };
    }
  }

  private async checkReddit(
    username: string,
    isDemo: boolean
  ): Promise<{ finding: UsernameProfileFinding; evidence?: EvidenceItem }> {
    const now = new Date().toISOString();
    const profileUrl = `https://www.reddit.com/user/${username}`;

    if (isDemo) {
      const score = 68;
      const finding: UsernameProfileFinding = {
        id: `finding-reddit-${username}`,
        platform: 'Reddit',
        platformCategory: 'Forums',
        username,
        profileUrl,
        profileStatus: 'Username Correlation',
        confidenceScore: score,
        confidenceTier: getConfidenceTier(score),
        evidence: [
          'DEMO DATA: Public user profile page exists in Reddit directory',
          'DEMO DATA: Public activity observed in tech/security discussion boards',
          'DEMO DATA: Handle matches candidate naming convention',
        ],
        lastChecked: now,
        source: 'Reddit Public JSON (Demo Mode)',
        isRelevant: true,
      };

      const evidence: EvidenceItem = {
        id: `ev-reddit-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        investigationId: '',
        source: 'Reddit User Directory',
        type: 'profile',
        url: profileUrl,
        title: `Reddit Handle: u/${username}`,
        description: `Correlated public user profile exists on Reddit. Potential shared naming convention across platforms.`,
        confidence: score,
        timestamp: now,
        hash: createSha256(`${profileUrl}:${username}:${now}`),
        isRelevant: true,
        isFalsePositive: false,
        chainOfCustodyRecord: {
          collectorAgent: 'Username OSINT Agent',
          acquisitionMethod: 'Public Metadata Lookup',
          verifiedIntegrity: true,
        },
      };

      return { finding, evidence };
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`https://www.reddit.com/user/${encodeURIComponent(username)}/about.json`, {
        headers: { 'User-Agent': 'OSINT-Sentinel/1.0 (academic research robot)' },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.status === 200) {
        const data = await res.json();
        if (data && data.data && !data.data.is_suspended) {
          const score = 72;
          return {
            finding: {
              id: `finding-reddit-${username}`,
              platform: 'Reddit',
              platformCategory: 'Forums',
              username,
              profileUrl,
              profileStatus: 'Username Correlation',
              confidenceScore: score,
              confidenceTier: getConfidenceTier(score),
              evidence: [
                'Public Reddit profile is active',
                `Created: ${new Date((data.data.created_utc || 0) * 1000).toLocaleDateString()}`,
                `Total karma: ${data.data.total_karma || 0}`,
              ],
              lastChecked: now,
              source: 'Reddit Public JSON',
              isRelevant: true,
            },
          };
        }
      }

      if (res.status === 404) {
        return {
          finding: {
            id: `finding-reddit-${username}`,
            platform: 'Reddit',
            platformCategory: 'Forums',
            username,
            profileUrl,
            profileStatus: 'No Match Found',
            confidenceScore: 0,
            confidenceTier: 'Very Low',
            evidence: ['Public user profile not found or shadow-restricted'],
            lastChecked: now,
            source: 'Reddit Public JSON',
          },
        };
      }

      return {
        finding: {
          id: `finding-reddit-${username}`,
          platform: 'Reddit',
          platformCategory: 'Forums',
          username,
          profileUrl,
          profileStatus: 'Provider Unavailable',
          confidenceScore: 0,
          confidenceTier: 'Very Low',
          evidence: ['Reddit API request blocked or restricted from current IP block'],
          lastChecked: now,
          source: 'Reddit Public JSON',
        },
      };
    } catch {
      return {
        finding: {
          id: `finding-reddit-${username}`,
          platform: 'Reddit',
          platformCategory: 'Forums',
          username,
          profileUrl,
          profileStatus: 'Provider Unavailable',
          confidenceScore: 0,
          confidenceTier: 'Very Low',
          evidence: ['Source could not be verified due to network constraint'],
          lastChecked: now,
          source: 'Reddit Public JSON',
        },
      };
    }
  }

  private async checkHackerNews(
    username: string,
    isDemo: boolean
  ): Promise<{ finding: UsernameProfileFinding; evidence?: EvidenceItem }> {
    const now = new Date().toISOString();
    const profileUrl = `https://news.ycombinator.com/user?id=${username}`;

    if (isDemo) {
      const score = 60;
      return {
        finding: {
          id: `finding-hn-${username}`,
          platform: 'Hacker News',
          platformCategory: 'Forums',
          username,
          profileUrl,
          profileStatus: 'Username Correlation',
          confidenceScore: score,
          confidenceTier: getConfidenceTier(score),
          evidence: [
            'DEMO DATA: Public account registered on YCombinator Hacker News',
            'DEMO DATA: Public karma registered; submissions related to software engineering',
          ],
          lastChecked: now,
          source: 'Hacker News Public Firebase API (Demo)',
          isRelevant: true,
        },
      };
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`https://hacker-news.firebaseio.com/v0/user/${encodeURIComponent(username)}.json`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.status === 200) {
        const data = await res.json();
        if (data && data.id) {
          const score = 65;
          return {
            finding: {
              id: `finding-hn-${username}`,
              platform: 'Hacker News',
              platformCategory: 'Forums',
              username,
              profileUrl,
              profileStatus: 'Username Correlation',
              confidenceScore: score,
              confidenceTier: getConfidenceTier(score),
              evidence: [
                'Public Hacker News account active',
                `Karma: ${data.karma}`,
                data.about ? `About text: "${data.about.slice(0, 80)}"` : 'No public about text',
              ],
              lastChecked: now,
              source: 'Hacker News Public Firebase API',
              isRelevant: true,
            },
          };
        }
        return {
          finding: {
            id: `finding-hn-${username}`,
            platform: 'Hacker News',
            platformCategory: 'Forums',
            username,
            profileUrl,
            profileStatus: 'No Match Found',
            confidenceScore: 0,
            confidenceTier: 'Very Low',
            evidence: ['Public user record returns null on Hacker News API'],
            lastChecked: now,
            source: 'Hacker News Public Firebase API',
          },
        };
      }

      return {
        finding: {
          id: `finding-hn-${username}`,
          platform: 'Hacker News',
          platformCategory: 'Forums',
          username,
          profileUrl,
          profileStatus: 'Provider Unavailable',
          confidenceScore: 0,
          confidenceTier: 'Very Low',
          evidence: ['Service unavailable'],
          lastChecked: now,
          source: 'Hacker News Public Firebase API',
        },
      };
    } catch {
      return {
        finding: {
          id: `finding-hn-${username}`,
          platform: 'Hacker News',
          platformCategory: 'Forums',
          username,
          profileUrl,
          profileStatus: 'Provider Unavailable',
          confidenceScore: 0,
          confidenceTier: 'Very Low',
          evidence: ['Source could not be verified'],
          lastChecked: now,
          source: 'Hacker News Public Firebase API',
        },
      };
    }
  }

  private async checkMastodon(
    username: string,
    isDemo: boolean
  ): Promise<{ finding: UsernameProfileFinding; evidence?: EvidenceItem }> {
    const now = new Date().toISOString();
    const profileUrl = `https://mastodon.social/@${username}`;

    if (isDemo) {
      const score = 52;
      return {
        finding: {
          id: `finding-masto-${username}`,
          platform: 'Mastodon (Fediverse)',
          platformCategory: 'Fediverse',
          username,
          profileUrl,
          profileStatus: 'Potential Match',
          confidenceScore: score,
          confidenceTier: getConfidenceTier(score),
          evidence: [
            'DEMO DATA: Public Mastodon instance record matching handle',
            'DEMO DATA: Public federation link to developer web presence',
          ],
          lastChecked: now,
          source: 'Mastodon Public Search API (Demo)',
          isRelevant: true,
        },
      };
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`https://mastodon.social/api/v1/accounts/lookup?acct=${encodeURIComponent(username)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.status === 200) {
        const data = await res.json();
        const score = 62;
        return {
          finding: {
            id: `finding-masto-${username}`,
            platform: 'Mastodon (Fediverse)',
            platformCategory: 'Fediverse',
            username,
            profileUrl: data.url || profileUrl,
            profileStatus: 'Potential Match',
            confidenceScore: score,
            confidenceTier: getConfidenceTier(score),
            evidence: [
              'Public Fediverse account resolved on mastodon.social',
              `Followers count: ${data.followers_count || 0}`,
            ],
            lastChecked: now,
            source: 'Mastodon Public Lookup API',
            isRelevant: true,
          },
        };
      }

      return {
        finding: {
          id: `finding-masto-${username}`,
          platform: 'Mastodon (Fediverse)',
          platformCategory: 'Fediverse',
          username,
          profileUrl,
          profileStatus: 'No Match Found',
          confidenceScore: 0,
          confidenceTier: 'Very Low',
          evidence: ['Account lookup returned 404 on default federation instance'],
          lastChecked: now,
          source: 'Mastodon Public Lookup API',
        },
      };
    } catch {
      return {
        finding: {
          id: `finding-masto-${username}`,
          platform: 'Mastodon (Fediverse)',
          platformCategory: 'Fediverse',
          username,
          profileUrl,
          profileStatus: 'Provider Unavailable',
          confidenceScore: 0,
          confidenceTier: 'Very Low',
          evidence: ['Provider unavailable or federation timed out'],
          lastChecked: now,
          source: 'Mastodon Public Lookup API',
        },
      };
    }
  }

  private async checkGitLab(
    username: string,
    isDemo: boolean
  ): Promise<{ finding: UsernameProfileFinding; evidence?: EvidenceItem }> {
    const now = new Date().toISOString();
    const profileUrl = `https://gitlab.com/${username}`;

    if (isDemo) {
      const score = 48;
      return {
        finding: {
          id: `finding-gitlab-${username}`,
          platform: 'GitLab',
          platformCategory: 'Code',
          username,
          profileUrl,
          profileStatus: 'Insufficient Evidence',
          confidenceScore: score,
          confidenceTier: getConfidenceTier(score),
          evidence: [
            'DEMO DATA: Public profile placeholder discovered',
            'DEMO DATA: Insufficient public commit history to verify correlation',
          ],
          lastChecked: now,
          source: 'GitLab Public Profile Lookup (Demo)',
          isRelevant: false,
        },
      };
    }

    // Default polite public lookup or unavailable
    return {
      finding: {
        id: `finding-gitlab-${username}`,
        platform: 'GitLab',
        platformCategory: 'Code',
        username,
        profileUrl,
        profileStatus: 'Provider Unavailable',
        confidenceScore: 0,
        confidenceTier: 'Very Low',
        evidence: ['GitLab public user search requires token authentication; provider unavailable in anonymous mode'],
        lastChecked: now,
        source: 'GitLab Provider Adapter',
      },
    };
  }

  private async checkPublicWeb(
    username: string,
    isDemo: boolean
  ): Promise<{ finding: UsernameProfileFinding; evidence?: EvidenceItem }> {
    const now = new Date().toISOString();
    const profileUrl = `https://${username}.github.io`;

    if (isDemo) {
      const score = 78;
      const finding: UsernameProfileFinding = {
        id: `finding-web-${username}`,
        platform: 'Public GitHub Pages / Personal Website',
        platformCategory: 'Web',
        username,
        profileUrl,
        profileStatus: 'Potential Match',
        confidenceScore: score,
        confidenceTier: getConfidenceTier(score),
        evidence: [
          `DEMO DATA: Static site hosting namespace resolved at ${profileUrl}`,
          'DEMO DATA: Matches handle footprint and portfolio references',
        ],
        lastChecked: now,
        source: 'Public Web DNS/HTTP Inspection (Demo)',
        isRelevant: true,
      };

      const evidence: EvidenceItem = {
        id: `ev-web-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        investigationId: '',
        source: 'Public Web Namespace',
        type: 'url_syntax',
        url: profileUrl,
        title: `Public Web Namespace: ${username}.github.io`,
        description: `Discovered developer web footprint hosted under candidate handle. Correlates with code profile.`,
        confidence: score,
        timestamp: now,
        hash: createSha256(`${profileUrl}:${now}`),
        isRelevant: true,
        isFalsePositive: false,
        chainOfCustodyRecord: {
          collectorAgent: 'Username OSINT Agent',
          acquisitionMethod: 'Passive DNS & Host Header Validation',
          verifiedIntegrity: true,
        },
      };

      return { finding, evidence };
    }

    return {
      finding: {
        id: `finding-web-${username}`,
        platform: 'Public Developer Footprint',
        platformCategory: 'Web',
        username,
        profileUrl,
        profileStatus: 'Cannot Verify Identity',
        confidenceScore: 25,
        confidenceTier: 'Low',
        evidence: ['Public web search requires search engine API key; limited passive correlation available'],
        lastChecked: now,
        source: 'Public Web Adapter',
      },
    };
  }

  private buildCorrelationGraph(username: string, findings: UsernameProfileFinding[]): CorrelationGraphData {
    const targetNodeId = `target-${username}`;
    const now = new Date().toISOString();

    const nodes: CorrelationNode[] = [
      {
        id: targetNodeId,
        label: `@${username}`,
        type: 'target',
        source: 'User Query',
        confidence: 100,
        evidence: 'Primary investigation subject handle',
        timestamp: now,
      },
    ];

    const links: CorrelationLink[] = [];

    findings.forEach((finding) => {
      if (finding.profileStatus === 'Potential Match' || finding.profileStatus === 'Username Correlation') {
        const nodeId = `node-${finding.id}`;
        nodes.push({
          id: nodeId,
          label: `${finding.platform}`,
          type: 'platform' as const,
          source: finding.source,
          confidence: finding.confidenceScore,
          evidence: finding.evidence.join('; '),
          timestamp: finding.lastChecked,
        });

        links.push({
          source: targetNodeId,
          target: nodeId,
          relationship: finding.profileStatus === 'Potential Match' ? 'Direct Match' : 'Handle Reuse',
          strength: finding.confidenceScore / 100,
        });

        // Add sub-nodes if public repo or website is correlated
        if (finding.platform === 'GitHub' && finding.rawMetadata?.public_repos) {
          const repoNodeId = `node-repo-${username}`;
          nodes.push({
            id: repoNodeId,
            label: `${finding.rawMetadata.public_repos} Public Repositories`,
            type: 'repository' as const,
            source: 'GitHub Metadata',
            confidence: 85,
            evidence: 'Public source code contributions and repository metadata',
            timestamp: now,
          });
          links.push({
            source: nodeId,
            target: repoNodeId,
            relationship: 'Authored Artifacts',
            strength: 0.85,
          });
        }
      }
    });

    return { nodes, links };
  }
}
