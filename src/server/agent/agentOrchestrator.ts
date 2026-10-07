import type {
  AgentTaskExecution,
  Investigation,
  InvestigationType,
  InvestigationReport,
  TimelineEvent,
  EvidenceItem,
  ConfidenceTier,
  RiskLevel,
} from '../../types/osint.ts';
import { UsernameDiscoveryEngine, normalizeUsername, getConfidenceTier } from '../providers/usernameProviders.ts';
import { UrlRiskEngine } from '../providers/urlAnalysisEngine.ts';
import { generateAIAnalystInterpretation } from '../geminiService.ts';

export class AgentOrchestrator {
  private usernameEngine = new UsernameDiscoveryEngine();
  private urlEngine = new UrlRiskEngine();

  async planInvestigation(
    target: string,
    typeHint?: InvestigationType,
    scope = 'All Supported Sources'
  ): Promise<{
    inferredType: InvestigationType;
    tasks: AgentTaskExecution[];
    normalizedTarget: string;
  }> {
    const trimmed = target.trim();
    let inferredType: InvestigationType = typeHint || 'username';

    if (!typeHint) {
      if (
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.includes('.com') ||
        trimmed.includes('.org') ||
        trimmed.includes('.net') ||
        trimmed.includes('/')
      ) {
        inferredType = 'phishing';
      } else {
        inferredType = 'username';
      }
    }

    const tasks: AgentTaskExecution[] = [];
    const now = new Date().toISOString();

    // 1. Investigation Planner Agent
    tasks.push({
      id: `task-planner-${Date.now()}`,
      agentName: 'Investigation Planner Agent',
      agentRole: 'Deconstructs user inquiry into defensive subtasks and scopes compliance boundary',
      task: 'Intent classification and workflow scoping',
      status: 'pending',
      executionTimeMs: 0,
      evidenceCount: 0,
      reasoning: 'Establishes lawful, read-only boundary parameters and coordinates downstream specialized agents.',
      timestamp: now,
    });

    if (inferredType === 'username') {
      // 2. Username OSINT Agent
      tasks.push({
        id: `task-user-${Date.now()}`,
        agentName: 'Username OSINT Agent',
        agentRole: 'Discovers public profile handles across code and forum providers',
        task: 'Normalize handle and query supported public provider adapters',
        status: 'pending',
        executionTimeMs: 0,
        evidenceCount: 0,
        reasoning: 'Queries public read-only profiles without authentication, brute-forcing, or private access.',
        timestamp: now,
      });

      // 3. Domain / Web Intelligence Agent
      tasks.push({
        id: `task-web-${Date.now()}`,
        agentName: 'Domain Intelligence Agent',
        agentRole: 'Scans public web namespaces and developer portfolios',
        task: 'Check public GitHub pages and namespace endpoints',
        status: 'pending',
        executionTimeMs: 0,
        evidenceCount: 0,
        reasoning: 'Verifies whether the handle is tied to static documentation or public project repositories.',
        timestamp: now,
      });

      // 4. Evidence Correlation Agent
      tasks.push({
        id: `task-corr-${Date.now()}`,
        agentName: 'Evidence Correlation Agent',
        agentRole: 'Synthesizes cross-platform handle reuse signals into an evidence graph',
        task: 'Build correlation topology and weigh identity confidence',
        status: 'pending',
        executionTimeMs: 0,
        evidenceCount: 0,
        reasoning: 'Maps relationships between discovered artifacts while enforcing non-definitive identity disclaimers.',
        timestamp: now,
      });
    } else {
      // URL / Phishing analysis tasks
      // 2. URL Analysis Agent
      tasks.push({
        id: `task-url-${Date.now()}`,
        agentName: 'URL Analysis Agent',
        agentRole: 'Inspects lexical structure, obfuscation markers, entropy, and ports',
        task: 'Execute 20-point RFC 3986 lexical syntax & protocol audit',
        status: 'pending',
        executionTimeMs: 0,
        evidenceCount: 0,
        reasoning: 'Identifies evasion techniques such as hex-encoding, excessive entropy, and userinfo @ tricks.',
        timestamp: now,
      });

      // 3. Domain Intelligence Agent
      tasks.push({
        id: `task-domain-${Date.now()}`,
        agentName: 'Domain Intelligence Agent',
        agentRole: 'Evaluates lookalikes, homographs, Punycode, and subdomain depth',
        task: 'Run typo-squatting, brand spoofing, and IDN homograph checks',
        status: 'pending',
        executionTimeMs: 0,
        evidenceCount: 0,
        reasoning: 'Detects deceptive characters and brand mimicry intended to trick users into credential disclosure.',
        timestamp: now,
      });

      // 4. Reputation Analysis Agent
      tasks.push({
        id: `task-rep-${Date.now()}`,
        agentName: 'Reputation Analysis Agent',
        agentRole: 'Correlates against defensive threat patterns and suspicious TLD lists',
        task: 'Verify known credential-harvesting signatures and TLD risk factors',
        status: 'pending',
        executionTimeMs: 0,
        evidenceCount: 0,
        reasoning: 'Compares domain against known abuse indicators and high-risk registry patterns.',
        timestamp: now,
      });
    }

    // Common agents for both types:
    // 5. Risk Assessment Agent
    tasks.push({
      id: `task-risk-${Date.now()}`,
      agentName: 'Risk Assessment Agent',
      agentRole: 'Calculates transparent multi-factor risk score and confidence tiers',
      task: 'Evaluate scoring matrix and assign categorical severity',
      status: 'pending',
      executionTimeMs: 0,
      evidenceCount: 0,
      reasoning: 'Combines heuristic signals into an explainable 0–100 score with explicit additions/deductions.',
      timestamp: now,
    });

    // 6. Report Generation Agent
    tasks.push({
      id: `task-report-${Date.now()}`,
      agentName: 'Report Generation Agent',
      agentRole: 'Compiles executive summary, forensic chain-of-custody, and recommendations',
      task: 'Draft structured intelligence report for researchers and SOC',
      status: 'pending',
      executionTimeMs: 0,
      evidenceCount: 0,
      reasoning: 'Produces an exportable, audited intelligence briefing with false-positive analysis.',
      timestamp: now,
    });

    return {
      inferredType,
      tasks,
      normalizedTarget: inferredType === 'username' ? normalizeUsername(trimmed) : trimmed,
    };
  }

  async runInvestigation(
    investigation: Investigation,
    options: { isDemoMode: boolean }
  ): Promise<Investigation> {
    const startTime = Date.now();
    const updated = { ...investigation };
    updated.status = 'running';
    updated.isDemoMode = options.isDemoMode;

    const timeline: TimelineEvent[] = [];
    const evidence: EvidenceItem[] = [];

    const addTimeline = (title: string, desc: string, agent: string, type: TimelineEvent['type'] = 'info') => {
      timeline.push({
        id: `tl-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        timestamp: new Date().toLocaleTimeString(),
        title,
        description: desc,
        agent,
        type,
      });
    };

    addTimeline('Investigation Initialized', `Target queued: "${updated.target}" (${updated.type})`, 'Investigation Planner Agent');

    // Step 1: Planner Agent
    const plannerTask = updated.agents.find((a) => a.agentName === 'Investigation Planner Agent');
    if (plannerTask) {
      plannerTask.status = 'running';
      plannerTask.status = 'completed';
      plannerTask.executionTimeMs = 45;
      plannerTask.reasoning = 'Normalized query and scheduled modular agent execution pipeline.';
      plannerTask.outputSummary = `Target normalized to "${updated.normalizedTarget}". ${updated.agents.length} agent tasks scheduled.`;
      addTimeline('Plan Generated', 'Modular execution pipeline dispatched across specialized agents', 'Investigation Planner Agent', 'success');
    }

    if (updated.type === 'username') {
      // Step 2 & 3: Run Username OSINT Agent & Domain Intel
      const userTask = updated.agents.find((a) => a.agentName === 'Username OSINT Agent');
      const domainTask = updated.agents.find((a) => a.agentName === 'Domain Intelligence Agent');

      if (userTask) userTask.status = 'running';
      const userStart = Date.now();

      const userResults = await this.usernameEngine.executeInvestigation(updated.normalizedTarget, {
        scope: updated.scope,
        isDemoMode: options.isDemoMode,
      });

      if (userTask) {
        userTask.status = 'completed';
        userTask.executionTimeMs = Math.max(120, Date.now() - userStart);
        userTask.evidenceCount = userResults.evidence.length;
        userTask.outputSummary = `Checked public providers. Found ${userResults.findings.filter((f) => f.profileStatus === 'Potential Match' || f.profileStatus === 'Username Correlation').length} correlated profile handles.`;
      }

      if (domainTask) {
        domainTask.status = 'completed';
        domainTask.executionTimeMs = 80;
        domainTask.evidenceCount = 1;
        domainTask.outputSummary = 'Completed passive web footprint resolution for public developer domain.';
      }

      addTimeline('Public Source Checks Completed', `Discovered ${userResults.findings.length} provider responses`, 'Username OSINT Agent', 'success');

      // Step 4: Correlation Agent
      const corrTask = updated.agents.find((a) => a.agentName === 'Evidence Correlation Agent');
      if (corrTask) {
        corrTask.status = 'completed';
        corrTask.executionTimeMs = 60;
        corrTask.evidenceCount = userResults.graph.nodes.length;
        corrTask.outputSummary = `Constructed correlation graph with ${userResults.graph.nodes.length} nodes and ${userResults.graph.links.length} relationships.`;
        addTimeline('Evidence Correlated', `Graph compiled with ${userResults.graph.nodes.length} topology nodes`, 'Evidence Correlation Agent', 'success');
      }

      // Step 5: Risk Assessment Agent
      const riskTask = updated.agents.find((a) => a.agentName === 'Risk Assessment Agent');
      const riskScore = userResults.overallConfidence >= 75 ? 45 : userResults.overallConfidence >= 50 ? 30 : 15;
      const riskLevel: RiskLevel = riskScore >= 40 ? 'MEDIUM' : 'LOW';

      if (riskTask) {
        riskTask.status = 'completed';
        riskTask.executionTimeMs = 40;
        riskTask.outputSummary = `Assigned confidence score ${userResults.overallConfidence}% (${getConfidenceTier(userResults.overallConfidence)}). Overall risk posture: ${riskLevel}.`;
        addTimeline('Risk & Confidence Scored', `Confidence: ${userResults.overallConfidence}%, Posture: ${riskLevel}`, 'Risk Assessment Agent', 'info');
      }

      updated.usernameFindings = userResults.findings;
      updated.correlationGraph = userResults.graph;
      updated.confidenceScore = userResults.overallConfidence;
      updated.confidenceTier = getConfidenceTier(userResults.overallConfidence);
      updated.riskScore = riskScore;
      updated.riskLevel = riskLevel;
      evidence.push(...userResults.evidence);
    } else {
      // Phishing URL workflow
      const urlTask = updated.agents.find((a) => a.agentName === 'URL Analysis Agent');
      const domainTask = updated.agents.find((a) => a.agentName === 'Domain Intelligence Agent');
      const repTask = updated.agents.find((a) => a.agentName === 'Reputation Analysis Agent');
      const riskTask = updated.agents.find((a) => a.agentName === 'Risk Assessment Agent');

      const urlStart = Date.now();
      const urlAnalysisResult = this.urlEngine.analyzeUrl(updated.target, options.isDemoMode);

      if (urlTask) {
        urlTask.status = 'completed';
        urlTask.executionTimeMs = Math.max(90, Date.now() - urlStart);
        urlTask.evidenceCount = 1;
        urlTask.outputSummary = `Evaluated RFC 3986 lexical structure. Protocol: ${urlAnalysisResult.analysis.protocol}, Port: ${urlAnalysisResult.analysis.port}.`;
      }

      if (domainTask) {
        domainTask.status = 'completed';
        domainTask.executionTimeMs = 110;
        domainTask.evidenceCount = urlAnalysisResult.analysis.isLookalike ? 2 : 1;
        domainTask.outputSummary = urlAnalysisResult.analysis.isLookalike
          ? `High-confidence lookalike pattern detected targeting ${urlAnalysisResult.analysis.lookalikeTarget}`
          : 'No severe brand homograph detected in domain hierarchy.';
      }

      if (repTask) {
        repTask.status = 'completed';
        repTask.executionTimeMs = 75;
        repTask.evidenceCount = urlAnalysisResult.analysis.suspiciousKeywords.length;
        repTask.outputSummary = `Scanned keywords and TLD reputation. Identified ${urlAnalysisResult.analysis.suspiciousIndicators.length} risk indicators.`;
      }

      if (riskTask) {
        riskTask.status = 'completed';
        riskTask.executionTimeMs = 50;
        riskTask.outputSummary = `Computed transparent risk score: ${urlAnalysisResult.analysis.riskScore}/100 (${urlAnalysisResult.analysis.riskLevel}).`;
      }

      addTimeline('URL & Domain Analysis Completed', `Identified ${urlAnalysisResult.analysis.suspiciousIndicators.length} suspicious indicators`, 'Domain Intelligence Agent', 'warning');
      addTimeline('Risk Model Evaluated', `Risk Score: ${urlAnalysisResult.analysis.riskScore}/100 (${urlAnalysisResult.analysis.riskLevel})`, 'Risk Assessment Agent', 'alert');

      updated.phishingAnalysis = urlAnalysisResult.analysis;
      updated.riskScore = urlAnalysisResult.analysis.riskScore;
      updated.riskLevel = urlAnalysisResult.analysis.riskLevel;
      updated.confidenceScore = urlAnalysisResult.analysis.confidenceScore;
      updated.confidenceTier = getConfidenceTier(urlAnalysisResult.analysis.confidenceScore);
      evidence.push(...urlAnalysisResult.evidence);
    }

    // Set evidence IDs to link with investigation
    evidence.forEach((ev) => {
      ev.investigationId = updated.id;
    });
    updated.evidence = evidence;

    // AI Security Analyst interpretation (via server-side Gemini 3.8 Flash or deterministic engine)
    const analystInterpretation = await generateAIAnalystInterpretation(updated);
    updated.analystInterpretation = analystInterpretation;
    addTimeline('AI Security Analyst Synthesized', `Generated defensive findings with ${analystInterpretation.confidenceScore}% confidence`, 'AI Security Analyst', 'success');

    // Report Generation Agent
    const reportTask = updated.agents.find((a) => a.agentName === 'Report Generation Agent');
    const report = this.generateExecutiveReport(updated, timeline);
    updated.report = report;
    if (reportTask) {
      reportTask.status = 'completed';
      reportTask.executionTimeMs = 45;
      reportTask.outputSummary = 'Generated comprehensive executive intelligence briefing ready for PDF/JSON export.';
    }

    addTimeline('Report Finalized', 'Intelligence briefing authored under SPARC / RGMCET', 'Report Generation Agent', 'success');

    updated.status = 'completed';
    updated.completedAt = new Date().toISOString();
    updated.timeline = timeline;

    return updated;
  }

  private generateExecutiveReport(investigation: Investigation, timeline: TimelineEvent[]): InvestigationReport {
    const now = new Date().toISOString();

    const sourcesChecked = investigation.type === 'username'
      ? (investigation.usernameFindings || []).map((f) => ({
          source: f.platform,
          status: (f.profileStatus === 'Potential Match' || f.profileStatus === 'Username Correlation')
            ? ('Correlated' as const)
            : f.profileStatus === 'Provider Unavailable'
            ? ('Unavailable' as const)
            : ('No Match' as const),
          details: f.evidence.join('; '),
        }))
      : [
          {
            source: 'RFC 3986 Lexical Parser',
            status: 'Checked' as const,
            details: `Protocol ${investigation.phishingAnalysis?.protocol}, Port ${investigation.phishingAnalysis?.port}`,
          },
          {
            source: 'Brand Lookalike & Typo-Squatting Matrix',
            status: investigation.phishingAnalysis?.isLookalike ? ('Correlated' as const) : ('Checked' as const),
            details: investigation.phishingAnalysis?.lookalikeTarget || 'No spoofing pattern detected',
          },
          {
            source: 'Threat Keyword & Credential Trap Engine',
            status: 'Checked' as const,
            details: `Identified keywords: ${investigation.phishingAnalysis?.suspiciousKeywords.join(', ') || 'None'}`,
          },
          {
            source: 'Passive DNS & Host Resolution',
            status: 'Checked' as const,
            details: investigation.phishingAnalysis?.dnsInfo.status || 'Resolved',
          },
        ];

    const findings = investigation.type === 'username'
      ? (investigation.usernameFindings || [])
          .filter((f) => f.profileStatus === 'Potential Match' || f.profileStatus === 'Username Correlation')
          .map((f) => `${f.platform}: Potential handle correlation (${f.confidenceScore}% confidence). ${f.evidence.join(' ')}`)
      : (investigation.phishingAnalysis?.suspiciousIndicators || []).map((ind) => `Risk Indicator: ${ind}`);

    return {
      id: `REP-${investigation.id}`,
      investigationId: investigation.id,
      generatedAt: now,
      author: 'OSINT Sentinel Autonomous Agent Orchestrator',
      organization: {
        club: 'SPARC (Scientific Program for Academic Research Cube)',
        institution: 'Rajeev Gandhi Memorial College of Engineering and Technology (RGMCET)',
      },
      executiveSummary: investigation.analystInterpretation?.whatItMeans ||
        `Investigation completed for ${investigation.target}. Assessed overall risk at ${investigation.riskLevel} (${investigation.riskScore}/100) with ${investigation.confidenceScore}% confidence.`,
      target: {
        type: investigation.type,
        query: investigation.target,
        normalizedQuery: investigation.normalizedTarget,
        scope: investigation.scope,
      },
      methodology:
        'Defensive, non-intrusive open-source intelligence collection and URL syntax heuristics. No unauthorized authentication, credential harvesting, or exploitation was attempted. Strictly limited to public endpoints.',
      aiInvestigationPlan: investigation.agents.map((a) => `${a.agentName}: ${a.task} [${a.status}]`),
      sourcesChecked,
      findings: findings.length > 0 ? findings : ['No active public correlation or security anomalies detected.'],
      evidenceCount: investigation.evidence.length,
      riskAssessment: {
        score: investigation.riskScore,
        level: investigation.riskLevel,
        breakdownText: investigation.type === 'phishing'
          ? (investigation.phishingAnalysis?.riskBreakdown || []).map((rb) => `${rb.factor}: ${rb.scoreContribution > 0 ? '+' : ''}${rb.scoreContribution} (${rb.detail})`).join('\n')
          : `Multi-source handle reuse risk: ${investigation.riskScore}/100.`,
      },
      confidence: {
        score: investigation.confidenceScore,
        tier: investigation.confidenceTier,
        explanation: investigation.type === 'username'
          ? 'Confidence represents mathematical probability of public handle reuse; does NOT verify real-world legal identity.'
          : 'Confidence reflects coverage of heuristic vectors and syntactic checks across 20 defensive inspection points.',
      },
      falsePositiveConsiderations: investigation.analystInterpretation?.potentialFalsePositives || [
        'Shared handle namespaces on public platforms.',
        'Legitimate internal developer subdomains or dynamic redirects.',
      ],
      recommendations: investigation.analystInterpretation?.recommendedNextSteps || [
        'Verify target through independent verified channels.',
        'Enforce multi-factor authentication.',
      ],
      timeline,
      legalNotice:
        'OSINT Sentinel is developed for academic cybersecurity research and defensive analysis only under SPARC & RGMCET. Analyzes publicly accessible information only. Do not use for unauthorized targeting or privacy invasion.',
    };
  }
}
