import { GoogleGenAI } from '@google/genai';
import type { AIAnalystInterpretation, Investigation, RiskLevel } from '../types/osint.ts';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

export async function generateAIAnalystInterpretation(
  investigation: Investigation
): Promise<AIAnalystInterpretation> {
  const now = new Date().toISOString();
  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `You are a Senior OSINT & Defensive Cybersecurity Intelligence Analyst for SPARC Organization at RGMCET.
Analyze this security investigation objective:
Target Type: ${investigation.type}
Target Query: ${investigation.target}
Risk Score: ${investigation.riskScore} (${investigation.riskLevel})
Confidence Score: ${investigation.confidenceScore}%
Evidence Items Count: ${investigation.evidence.length}
Key Findings / Summary:
${JSON.stringify(investigation.usernameFindings || investigation.phishingAnalysis?.riskBreakdown || [], null, 2)}

Provide a strict JSON response with:
1. "whatWasFound": string (factual synthesis of verified public artifacts or URL syntax anomalies)
2. "whatItMeans": string (defensive significance, threat modeling implications, handle reuse or spoofing risk)
3. "confidenceScore": number (0 to 100)
4. "riskLevel": string ("LOW" | "GUARDED" | "MEDIUM" | "HIGH" | "CRITICAL")
5. "potentialFalsePositives": array of strings (consider legitimate coincidences, handle collisions, shared hosting, CDN)
6. "recommendedNextSteps": array of strings (practical defensive steps, institutional reporting, no unauthorized intrusion)

CRITICAL RULE:
- NEVER claim identity verification based only on username matching.
- Do NOT hallucinate private information, credentials, or personal identity.
- Defensive and research context only.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction:
            'You are an expert OSINT and phishing detection analyst adhering to academic and legal research ethics.',
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          whatWasFound: parsed.whatWasFound || 'Synthesized artifacts reviewed.',
          whatItMeans: parsed.whatItMeans || 'Evaluation of defensive telemetry completed.',
          confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : investigation.confidenceScore,
          riskLevel: (parsed.riskLevel as RiskLevel) || investigation.riskLevel,
          potentialFalsePositives: Array.isArray(parsed.potentialFalsePositives) ? parsed.potentialFalsePositives : [],
          recommendedNextSteps: Array.isArray(parsed.recommendedNextSteps) ? parsed.recommendedNextSteps : [],
          generatedAt: now,
          modelUsed: 'gemini-3.8-flash (Agentic Orchestrator)',
        };
      }
    } catch (err) {
      console.warn('Gemini API call skipped or fell back to deterministic analyst engine:', err);
    }
  }

  // High quality deterministic cybersecurity expert rule-based engine (when offline, demo, or API key unset)
  return generateDeterministicAnalystInterpretation(investigation);
}

function generateDeterministicAnalystInterpretation(investigation: Investigation): AIAnalystInterpretation {
  const now = new Date().toISOString();

  if (investigation.type === 'username') {
    const findings = investigation.usernameFindings || [];
    const matched = findings.filter(
      (f) => f.profileStatus === 'Potential Match' || f.profileStatus === 'Username Correlation'
    );
    const platforms = matched.map((m) => m.platform).join(', ');

    return {
      whatWasFound: matched.length > 0
        ? `The OSINT discovery engine identified public profile handles matching "${investigation.target}" across ${matched.length} public platform(s): ${platforms}. No private information was queried or intercepted.`
        : `No active public profiles matching the handle "${investigation.target}" could be resolved across supported public source adapters.`,
      whatItMeans: matched.length > 0
        ? `The presence of identical handles across multiple platforms indicates a probable handle-reuse pattern. However, without secondary cryptographic or bio correlation, public handle sharing cannot prove singular identity.`
        : `The target handle has minimal or zero public digital footprint across the checked public endpoints, or accounts are configured privately.`,
      confidenceScore: investigation.confidenceScore,
      riskLevel: investigation.riskLevel,
      potentialFalsePositives: [
        'Unrelated individuals commonly register identical handles on disparate platforms without coordination.',
        'Inactive or dormant accounts may have been registered historically by distinct users.',
        'Platform username recycling policies may reassign abandoned handles.',
      ],
      recommendedNextSteps: [
        'Cross-reference publicly disclosed PGP public keys or verified domain links if published.',
        'Review public commit metadata for verified cryptographic commit signatures.',
        'Do not assume common identity across services without secondary out-of-band corroboration.',
      ],
      generatedAt: now,
      modelUsed: 'Deterministic OSINT Rule Engine (Demo / Fallback Mode)',
    };
  }

  // Phishing / URL investigation
  const analysis = investigation.phishingAnalysis;
  const isLookalike = analysis?.isLookalike;
  const targetBrand = analysis?.lookalikeTarget;
  const keywords = analysis?.suspiciousKeywords || [];
  const score = investigation.riskScore;

  return {
    whatWasFound: isLookalike
      ? `The target URL displays definitive deceptive syntax mimicking ${targetBrand || 'a legitimate brand'}. Found ${keywords.length} high-sensitivity credential keywords: "${keywords.slice(0, 3).join('", "')}".`
      : `The target URL was scanned across 20 defensive inspection vectors, identifying ${analysis?.suspiciousIndicators.length || 0} anomaly indicators and a risk score of ${score}/100.`,
    whatItMeans: score >= 60
      ? 'The telemetry indicates high probability of fraudulent infrastructure designed to harvest credentials or manipulate user trust. The presence of TLS encryption is superficial and does not certify domain legitimacy.'
      : 'The destination exhibits low-to-moderate heuristic variance from standard enterprise infrastructure; exercise situational awareness.',
    confidenceScore: investigation.confidenceScore,
    riskLevel: investigation.riskLevel,
    potentialFalsePositives: [
      'Staging or internal development domains may utilize non-standard subdomains and ports.',
      'Newly registered legitimate brand campaigns may momentarily lack domain age history.',
      'Reverse-proxy gateways may trigger entropy heuristics while hosting authentic services.',
    ],
    recommendedNextSteps: [
      'Do not submit authentication tokens or corporate credentials to this endpoint.',
      'Verify the authentic destination hostname via official bookmark or DNS registrar records.',
      'If received in an email or communication, flag the message to the SOC phishing triage inbox.',
      'If confirmed malicious, append the domain and IP to boundary firewall and DNS filter lists.',
    ],
    generatedAt: now,
    modelUsed: 'Deterministic Phishing Rule Engine (Demo / Fallback Mode)',
  };
}
