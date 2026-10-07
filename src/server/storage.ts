import type { Investigation, EvidenceItem, InvestigationReport } from '../types/osint.ts';

class InMemoryStorage {
  private investigations: Map<string, Investigation> = new Map();
  private evidenceLocker: Map<string, EvidenceItem> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const inv1: Investigation = {
      id: 'INV-2026-001',
      type: 'username',
      target: 'cyberhunter_demo',
      normalizedTarget: 'cyberhunter_demo',
      scope: 'All Supported Sources',
      status: 'completed',
      startedAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      isDemoMode: true,
      riskScore: 35,
      riskLevel: 'GUARDED',
      confidenceScore: 82,
      confidenceTier: 'High',
      agents: [
        {
          id: 'task-1',
          agentName: 'Investigation Planner Agent',
          agentRole: 'Deconstructs inquiry into defensive subtasks',
          task: 'Intent classification and workflow scoping',
          status: 'completed',
          executionTimeMs: 42,
          evidenceCount: 0,
          reasoning: 'Scoped investigation to public profile handle searches.',
          outputSummary: 'Scheduled 5 provider checks.',
          timestamp: '14:20:00',
        },
        {
          id: 'task-2',
          agentName: 'Username OSINT Agent',
          agentRole: 'Queries public handles across platforms',
          task: 'Check public provider adapters',
          status: 'completed',
          executionTimeMs: 140,
          evidenceCount: 3,
          reasoning: 'Read-only public API calls without authentication.',
          outputSummary: 'Found potential matches on GitHub, Reddit, and Hacker News.',
          timestamp: '14:20:01',
        },
        {
          id: 'task-3',
          agentName: 'Evidence Correlation Agent',
          agentRole: 'Synthesizes cross-platform handle reuse signals',
          task: 'Build correlation topology graph',
          status: 'completed',
          executionTimeMs: 65,
          evidenceCount: 4,
          reasoning: 'Correlates handles while disclaiming verified legal identity.',
          outputSummary: 'Correlated 3 profiles into relationship graph.',
          timestamp: '14:20:02',
        },
        {
          id: 'task-4',
          agentName: 'Risk Assessment Agent',
          agentRole: 'Calculates transparent multi-factor risk score',
          task: 'Evaluate scoring matrix and confidence tier',
          status: 'completed',
          executionTimeMs: 38,
          evidenceCount: 0,
          reasoning: 'Multi-platform exposure analysis.',
          outputSummary: 'Assigned 82% confidence, Guarded risk.',
          timestamp: '14:20:03',
        },
        {
          id: 'task-5',
          agentName: 'Report Generation Agent',
          agentRole: 'Compiles executive summary and chain-of-custody',
          task: 'Draft structured intelligence briefing',
          status: 'completed',
          executionTimeMs: 50,
          evidenceCount: 0,
          reasoning: 'Finalized executive briefing under SPARC/RGMCET format.',
          outputSummary: 'Report finalized.',
          timestamp: '14:20:04',
        },
      ],
      usernameFindings: [
        {
          id: 'find-gh-demo',
          platform: 'GitHub',
          platformCategory: 'Code',
          username: 'cyberhunter_demo',
          profileUrl: 'https://github.com/cyberhunter_demo',
          profileStatus: 'Potential Match',
          confidenceScore: 87,
          confidenceTier: 'High',
          evidence: [
            'DEMO DATA: Exact public handle match on GitHub',
            'DEMO DATA: Public profile bio contains "academic cybersecurity researcher"',
            'DEMO DATA: 14 public repositories with recent commit timestamps',
          ],
          lastChecked: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          source: 'GitHub Public API (Demo Mode)',
          rawMetadata: { public_repos: 14, followers: 42 },
          isRelevant: true,
        },
        {
          id: 'find-reddit-demo',
          platform: 'Reddit',
          platformCategory: 'Forums',
          username: 'cyberhunter_demo',
          profileUrl: 'https://www.reddit.com/user/cyberhunter_demo',
          profileStatus: 'Username Correlation',
          confidenceScore: 68,
          confidenceTier: 'Medium',
          evidence: [
            'DEMO DATA: Correlated public user profile exists on Reddit',
            'DEMO DATA: Active participation in netsec and OSINT forums',
          ],
          lastChecked: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          source: 'Reddit Public JSON (Demo Mode)',
          isRelevant: true,
        },
        {
          id: 'find-hn-demo',
          platform: 'Hacker News',
          platformCategory: 'Forums',
          username: 'cyberhunter_demo',
          profileUrl: 'https://news.ycombinator.com/user?id=cyberhunter_demo',
          profileStatus: 'Username Correlation',
          confidenceScore: 60,
          confidenceTier: 'Medium',
          evidence: [
            'DEMO DATA: Public account registered with submissions in cybersecurity topics',
          ],
          lastChecked: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          source: 'Hacker News Public API (Demo Mode)',
          isRelevant: true,
        },
        {
          id: 'find-masto-demo',
          platform: 'Mastodon (Fediverse)',
          platformCategory: 'Fediverse',
          username: 'cyberhunter_demo',
          profileUrl: 'https://mastodon.social/@cyberhunter_demo',
          profileStatus: 'Potential Match',
          confidenceScore: 52,
          confidenceTier: 'Medium',
          evidence: [
            'DEMO DATA: Public Fediverse account on mastodon.social',
          ],
          lastChecked: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          source: 'Mastodon Public Search (Demo Mode)',
          isRelevant: false,
        },
      ],
      correlationGraph: {
        nodes: [
          {
            id: 'target-cyberhunter_demo',
            label: '@cyberhunter_demo',
            type: 'target',
            source: 'User Query',
            confidence: 100,
            evidence: 'Primary investigation subject handle',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'node-find-gh-demo',
            label: 'GitHub',
            type: 'platform',
            source: 'GitHub Public API',
            confidence: 87,
            evidence: 'Exact handle match; 14 public repos',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'node-repo-demo',
            label: '14 Public Repositories',
            type: 'repository',
            source: 'GitHub Metadata',
            confidence: 85,
            evidence: 'Public source code repositories',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'node-find-reddit-demo',
            label: 'Reddit',
            type: 'platform',
            source: 'Reddit User Directory',
            confidence: 68,
            evidence: 'Correlated forum profile',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'node-find-hn-demo',
            label: 'Hacker News',
            type: 'platform',
            source: 'Hacker News API',
            confidence: 60,
            evidence: 'Active discussion handle',
            timestamp: new Date().toISOString(),
          },
        ],
        links: [
          {
            source: 'target-cyberhunter_demo',
            target: 'node-find-gh-demo',
            relationship: 'Direct Match',
            strength: 0.87,
          },
          {
            source: 'node-find-gh-demo',
            target: 'node-repo-demo',
            relationship: 'Authored Artifacts',
            strength: 0.85,
          },
          {
            source: 'target-cyberhunter_demo',
            target: 'node-find-reddit-demo',
            relationship: 'Handle Reuse',
            strength: 0.68,
          },
          {
            source: 'target-cyberhunter_demo',
            target: 'node-find-hn-demo',
            relationship: 'Handle Reuse',
            strength: 0.6,
          },
        ],
      },
      evidence: [
        {
          id: 'ev-demo-001',
          investigationId: 'INV-2026-001',
          source: 'GitHub Public Endpoint',
          type: 'profile',
          url: 'https://github.com/cyberhunter_demo',
          title: 'GitHub Public Profile: @cyberhunter_demo',
          description: 'Verified public profile exists with public contributions in security tools. Identity cannot be definitively linked without cryptographic key match.',
          confidence: 87,
          timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          hash: '7a9c84e1b3d56f920148ad4912fa87ce45f284b3e810573982cd6291aefc4831',
          isRelevant: true,
          isFalsePositive: false,
          chainOfCustodyRecord: {
            collectorAgent: 'Username OSINT Agent',
            acquisitionMethod: 'Read-only REST check',
            verifiedIntegrity: true,
          },
        },
        {
          id: 'ev-demo-002',
          investigationId: 'INV-2026-001',
          source: 'Reddit User Directory',
          type: 'profile',
          url: 'https://www.reddit.com/user/cyberhunter_demo',
          title: 'Reddit Public Handle: u/cyberhunter_demo',
          description: 'Correlated forum participation. Shared naming convention observed across technology communities.',
          confidence: 68,
          timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          hash: '92bc0f17e34d715984aa68409325fbe37482910c2847a956d391054f76231a48',
          isRelevant: true,
          isFalsePositive: false,
          chainOfCustodyRecord: {
            collectorAgent: 'Username OSINT Agent',
            acquisitionMethod: 'Public JSON Lookup',
            verifiedIntegrity: true,
          },
        },
      ],
      timeline: [
        {
          id: 'tl-1',
          timestamp: '14:20:00',
          title: 'Investigation Initialized',
          description: 'Target queued: "cyberhunter_demo"',
          agent: 'Investigation Planner Agent',
          type: 'info',
        },
        {
          id: 'tl-2',
          timestamp: '14:20:01',
          title: 'Username Normalized',
          description: 'Sanitized input to "cyberhunter_demo"',
          agent: 'Investigation Planner Agent',
          type: 'success',
        },
        {
          id: 'tl-3',
          timestamp: '14:20:02',
          title: 'Public Source Checks Completed',
          description: 'Resolved candidate profiles across GitHub, Reddit, HN',
          agent: 'Username OSINT Agent',
          type: 'success',
        },
        {
          id: 'tl-4',
          timestamp: '14:20:03',
          title: 'Evidence Correlated',
          description: 'Constructed relationship topology graph',
          agent: 'Evidence Correlation Agent',
          type: 'success',
        },
        {
          id: 'tl-5',
          timestamp: '14:20:04',
          title: 'AI Security Analyst Review',
          description: 'Synthesized defensive findings and false-positive limits',
          agent: 'AI Security Analyst',
          type: 'info',
        },
      ],
      analystInterpretation: {
        whatWasFound: 'The OSINT discovery engine identified public profile handles matching "cyberhunter_demo" across GitHub, Reddit, and Hacker News. No private information was queried or intercepted.',
        whatItMeans: 'The presence of identical handles across developer and discussion platforms indicates probable handle reuse by a single researcher or entity. However, without cryptographic key corroboration or mutual cross-linking, legal identity cannot be confirmed.',
        confidenceScore: 82,
        riskLevel: 'GUARDED',
        potentialFalsePositives: [
          'Different individuals commonly register identical handles on distinct services without affiliation.',
          'Platform handle abandonment and recycling could cause historical overlap.',
        ],
        recommendedNextSteps: [
          'Examine public commit metadata for verified PGP or GPG signature keys.',
          'Check if verified personal domains are linked in bio or README files.',
        ],
        generatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        modelUsed: 'gemini-3.8-flash (Agentic Orchestrator)',
      },
    };

    const inv2: Investigation = {
      id: 'INV-2026-002',
      type: 'phishing',
      target: 'https://paypa1-security-verification.update-account.top/login',
      normalizedTarget: 'https://paypa1-security-verification.update-account.top/login',
      scope: 'Defensive URL Inspection',
      status: 'completed',
      startedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 43).toISOString(),
      isDemoMode: true,
      riskScore: 88,
      riskLevel: 'CRITICAL',
      confidenceScore: 92,
      confidenceTier: 'Very High',
      agents: [
        {
          id: 'task-u1',
          agentName: 'Investigation Planner Agent',
          agentRole: 'Deconstructs inquiry into defensive subtasks',
          task: 'Intent classification and workflow scoping',
          status: 'completed',
          executionTimeMs: 35,
          evidenceCount: 0,
          reasoning: 'Scoped target to defensive 20-point URL lexical & domain analysis.',
          outputSummary: 'URL analysis plan created.',
          timestamp: '13:45:00',
        },
        {
          id: 'task-u2',
          agentName: 'URL Analysis Agent',
          agentRole: 'Inspects lexical structure, obfuscation, and ports',
          task: 'Lexical RFC 3986 parse and entropy audit',
          status: 'completed',
          executionTimeMs: 95,
          evidenceCount: 1,
          reasoning: 'Identified keywords "security", "verification", "login", "update-account".',
          outputSummary: 'Severe credential trap keywords detected in path and subdomains.',
          timestamp: '13:45:01',
        },
        {
          id: 'task-u3',
          agentName: 'Domain Intelligence Agent',
          agentRole: 'Evaluates lookalikes, homographs, and subdomain depth',
          task: 'Lookalike and typo-squatting detection',
          status: 'completed',
          executionTimeMs: 110,
          evidenceCount: 2,
          reasoning: 'Detected "paypa1" typo-squatting substituting digit "1" for letter "l".',
          outputSummary: 'High-confidence brand spoofing detected: PAYPAL.',
          timestamp: '13:45:02',
        },
        {
          id: 'task-u4',
          agentName: 'Reputation Analysis Agent',
          agentRole: 'Correlates against threat patterns and suspicious TLDs',
          task: 'TLD risk and reputation evaluation',
          status: 'completed',
          executionTimeMs: 80,
          evidenceCount: 1,
          reasoning: 'TLD .top has high spam and abuse correlation.',
          outputSummary: 'High-abuse TLD flag triggered.',
          timestamp: '13:45:03',
        },
        {
          id: 'task-u5',
          agentName: 'Risk Assessment Agent',
          agentRole: 'Calculates transparent multi-factor risk score',
          task: 'Evaluate scoring matrix and categorical severity',
          status: 'completed',
          executionTimeMs: 45,
          evidenceCount: 0,
          reasoning: 'Multi-factor score computed to 88/100 (CRITICAL).',
          outputSummary: 'Critical phishing risk assigned.',
          timestamp: '13:45:04',
        },
      ],
      phishingAnalysis: {
        url: 'https://paypa1-security-verification.update-account.top/login',
        normalizedUrl: 'https://paypa1-security-verification.update-account.top/login',
        protocol: 'HTTPS',
        domain: 'update-account.top',
        subdomain: 'paypa1-security-verification',
        tld: 'top',
        port: '443',
        path: '/login',
        hasHttps: true,
        isIpAddress: false,
        isShortened: false,
        isLookalike: true,
        lookalikeTarget: 'PAYPAL (Typo-squatting variant: "paypa1")',
        excessiveSubdomains: true,
        subdomainCount: 2,
        suspiciousKeywords: ['login', 'security', 'verification', 'update', 'account'],
        urlObfuscation: {
          hasHexEncoding: false,
          hasAtSymbol: false,
          excessiveEntropy: false,
          entropyValue: 3.12,
        },
        domainAgeInfo: {
          available: true,
          ageDays: 3,
          createdDate: '2026-10-04',
          status: 'Newly Registered Domain (3 days old)',
        },
        whoisInfo: {
          available: true,
          registrar: 'NameCheap / Withheld for Privacy',
          country: 'IS',
          status: 'Privacy Shield Redacted',
        },
        dnsInfo: {
          available: true,
          hasMx: false,
          ipResolutions: ['198.51.100.89'],
          status: 'A Record Resolved',
        },
        sslCertificate: {
          hasCert: true,
          issuer: "Let's Encrypt Authority X3",
          validDaysRemaining: 88,
          status: 'Active Domain-Validated TLS Certificate (DV)',
        },
        threatIntel: {
          checked: true,
          knownMalicious: true,
          matches: ['Deceptive Login Harvest Pattern', 'Brand Typo-Squatting Signature'],
          reputationScore: 88,
          status: 'High-Confidence Phishing Kit Correlated',
        },
        riskScore: 88,
        riskLevel: 'CRITICAL',
        riskBreakdown: [
          {
            factor: 'Brand Spoofing / Lookalike Domain',
            category: 'Domain Deception',
            scoreContribution: 30,
            detail: 'Deceptive lookalike string "paypa1" intentionally mimics PayPal brand identity',
            severity: 'critical',
          },
          {
            factor: 'High-Value Target Credential Keywords',
            category: 'Credential Traps',
            scoreContribution: 25,
            detail: 'Contains 5 high-risk keywords: login, security, verification, update, account',
            severity: 'danger',
          },
          {
            factor: 'Newly Registered Domain (<7 Days)',
            category: 'Domain Age',
            scoreContribution: 15,
            detail: 'Domain was created 3 days ago; characteristic of ephemeral phishing infrastructure',
            severity: 'danger',
          },
          {
            factor: 'High-Risk Top-Level Domain (TLD)',
            category: 'Domain Reputation',
            scoreContribution: 15,
            detail: 'Apex TLD .top is historically prevalent in disposable phishing deployments',
            severity: 'warning',
          },
          {
            factor: 'Threat Intelligence Signature Correlated',
            category: 'Threat Intel Feed',
            scoreContribution: 25,
            detail: 'Known deceptive banking verification layout template',
            severity: 'critical',
          },
          {
            factor: 'HTTPS Encryption Active',
            category: 'Transport Security',
            scoreContribution: -5,
            detail: 'TLS certificate present. NOTE: Does NOT establish legitimacy of the site owner.',
            severity: 'benign',
          },
        ],
        suspiciousIndicators: [
          'Lookalike typo-squatting pattern targeting PayPal ("paypa1")',
          'Multiple credential acquisition triggers ("login", "verification", "update")',
          'High-abuse TLD (.top) associated with disposable campaigns',
          'Domain age under 7 days old',
        ],
        benignIndicators: [
          'HTTPS encryption enabled (TLS in transit)',
        ],
        recommendedActions: [
          'Do NOT enter credentials, passwords, or PINs on this page',
          'Do NOT download or execute files from this origin',
          'Report this URL to the financial institution abuse desk (spoof@paypal.com)',
          'Block domain "update-account.top" and IP 198.51.100.89 in network boundary firewalls',
        ],
        analystSummary: 'The supplied URL displays high-confidence indicators of malicious credential harvesting. It combines brand typo-squatting ("paypa1") with high-pressure security verification wording on a newly-registered .top domain. The presence of HTTPS TLS encryption is superficial and does not indicate an authentic service.',
        confidenceScore: 92,
        isDemoData: true,
      },
      evidence: [
        {
          id: 'ev-demo-phish-1',
          investigationId: 'INV-2026-002',
          source: 'Brand Lookalike Engine',
          type: 'domain_intel',
          url: 'https://paypa1-security-verification.update-account.top/login',
          title: 'Brand Lookalike Anomaly: paypa1',
          description: 'Character replacement attack detected: "paypa1" intentionally mimics "paypal" to mislead users.',
          confidence: 95,
          timestamp: new Date(Date.now() - 1000 * 60 * 43).toISOString(),
          hash: 'e81a0293b45c7194f283018247ca81928374a589201487239104856192837482',
          isRelevant: true,
          isFalsePositive: false,
          chainOfCustodyRecord: {
            collectorAgent: 'Domain Intelligence Agent',
            acquisitionMethod: 'Heuristic Typo-Squatting Lexical Matrix',
            verifiedIntegrity: true,
          },
        },
      ],
      timeline: [
        {
          id: 'tl-u1',
          timestamp: '13:45:00',
          title: 'Investigation Initialized',
          description: 'Queued URL for defensive inspection',
          agent: 'Investigation Planner Agent',
          type: 'info',
        },
        {
          id: 'tl-u2',
          timestamp: '13:45:01',
          title: 'URL Syntax Parsed',
          description: 'Extracted apex domain "update-account.top"',
          agent: 'URL Analysis Agent',
          type: 'info',
        },
        {
          id: 'tl-u3',
          timestamp: '13:45:02',
          title: 'Lookalike Signature Detected',
          description: 'Mimicking PAYPAL via "paypa1" variant',
          agent: 'Domain Intelligence Agent',
          type: 'alert',
        },
        {
          id: 'tl-u4',
          timestamp: '13:45:04',
          title: 'Risk Assessed as CRITICAL',
          description: 'Score: 88/100 with 92% confidence',
          agent: 'Risk Assessment Agent',
          type: 'alert',
        },
      ],
      analystInterpretation: {
        whatWasFound: 'The supplied URL has characteristics consistently associated with phishing infrastructure. The domain uses a lookalike naming pattern ("paypa1") and contains an urgent account verification path structure. HTTPS is enabled, but this does not establish legitimacy.',
        whatItMeans: 'Target is almost certainly a credential theft lure designed to capture credentials from users who mistake the domain for PayPal. Domain was registered only 3 days ago on a cheap TLD.',
        confidenceScore: 92,
        riskLevel: 'CRITICAL',
        potentialFalsePositives: [
          'Extremely unlikely false positive due to conjunction of brand typo-squatting, credential keywords, and recent registration.',
        ],
        recommendedNextSteps: [
          'Do NOT enter credentials or passwords.',
          'Submit domain to Google Safe Browsing and PhishTank.',
          'Block the apex domain update-account.top on enterprise security gateways.',
        ],
        generatedAt: new Date(Date.now() - 1000 * 60 * 43).toISOString(),
        modelUsed: 'gemini-3.8-flash (Agentic Orchestrator)',
      },
    };

    this.investigations.set(inv1.id, inv1);
    this.investigations.set(inv2.id, inv2);

    inv1.evidence.forEach((e) => this.evidenceLocker.set(e.id, e));
    inv2.evidence.forEach((e) => this.evidenceLocker.set(e.id, e));
  }

  getAllInvestigations(): Investigation[] {
    return Array.from(this.investigations.values()).sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }

  getInvestigation(id: string): Investigation | undefined {
    return this.investigations.get(id);
  }

  saveInvestigation(inv: Investigation): void {
    this.investigations.set(inv.id, inv);
    inv.evidence.forEach((e) => {
      this.evidenceLocker.set(e.id, e);
    });
  }

  deleteInvestigation(id: string): boolean {
    const inv = this.investigations.get(id);
    if (!inv) return false;
    inv.evidence.forEach((e) => this.evidenceLocker.delete(e.id));
    return this.investigations.delete(id);
  }

  getAllEvidence(): EvidenceItem[] {
    return Array.from(this.evidenceLocker.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getEvidenceByInvestigation(invId: string): EvidenceItem[] {
    return this.getAllEvidence().filter((e) => e.investigationId === invId);
  }

  updateEvidence(id: string, updates: Partial<EvidenceItem>): EvidenceItem | null {
    const item = this.evidenceLocker.get(id);
    if (!item) return null;
    const updated = { ...item, ...updates };
    this.evidenceLocker.set(id, updated);

    // Also update inside corresponding investigation if present
    const inv = this.investigations.get(updated.investigationId);
    if (inv) {
      const idx = inv.evidence.findIndex((e) => e.id === id);
      if (idx !== -1) {
        inv.evidence[idx] = updated;
      }
    }

    return updated;
  }

  addEvidence(item: EvidenceItem): void {
    this.evidenceLocker.set(item.id, item);
    const inv = this.investigations.get(item.investigationId);
    if (inv) {
      inv.evidence.push(item);
    }
  }

  deleteEvidence(id: string): boolean {
    const item = this.evidenceLocker.get(id);
    if (!item) return false;
    const inv = this.investigations.get(item.investigationId);
    if (inv) {
      inv.evidence = inv.evidence.filter((e) => e.id !== id);
    }
    return this.evidenceLocker.delete(id);
  }
}

export const storage = new InMemoryStorage();
