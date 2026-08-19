import { GoogleGenAI, Type, Schema } from '@google/genai';

export interface DynamicIntervention {
  title: string;
  description: string;
  impact: 'High' | 'Medium';
  effort: 'Low' | 'Medium';
  priority: 'P0' | 'P1';
}

export interface DynamicDiagnosisPayload {
  stage: 'AWARE' | 'DESIRE' | 'OPEN' | 'PROFICIENT' | 'TRANSFORM';
  stageLabel: string;
  confidence: number;
  behavioralPattern: string;
  psychologicalDriver: string;
  problemSummary: string;
  takeaway: string;
  signals: {
    label: string;
    detail: string;
    tone: 'coral' | 'blue' | 'lavender';
  }[];
  interventions: DynamicIntervention[];
}

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    stage: {
      type: Type.STRING,
      enum: ['AWARE', 'DESIRE', 'OPEN', 'PROFICIENT', 'TRANSFORM'],
      description: 'The diagnosed ADOPT framework stage.',
    },
    stageLabel: {
      type: Type.STRING,
      description: 'E.g., "Motivation breakdown", "Discovery breakdown", "Activation breakdown".',
    },
    confidence: {
      type: Type.INTEGER,
      description: 'Confidence score between 75 and 98.',
    },
    behavioralPattern: {
      type: Type.STRING,
      description: 'The specific behavioral pattern observed, e.g., "Value Ambiguity", "Blank-Canvas Paralysis".',
    },
    psychologicalDriver: {
      type: Type.STRING,
      description: 'Root psychological friction, e.g., "Unclear Reward", "Cognitive Overload".',
    },
    problemSummary: {
      type: Type.STRING,
      description: 'A 1-2 sentence executive diagnosis tailored specifically using the vocabulary of the user problem.',
    },
    takeaway: {
      type: Type.STRING,
      description: 'A punchy, actionable rule of thumb reflecting their exact context.',
    },
    signals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          detail: { type: Type.STRING },
          tone: { type: Type.STRING, enum: ['coral', 'blue', 'lavender'] },
        },
        required: ['label', 'detail', 'tone'],
      },
    },
    interventions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          impact: { type: Type.STRING, enum: ['High', 'Medium'] },
          effort: { type: Type.STRING, enum: ['Low', 'Medium'] },
          priority: { type: Type.STRING, enum: ['P0', 'P1'] },
        },
        required: ['title', 'description', 'impact', 'effort', 'priority'],
      },
    },
  },
  required: [
    'stage',
    'stageLabel',
    'confidence',
    'behavioralPattern',
    'psychologicalDriver',
    'problemSummary',
    'takeaway',
    'signals',
    'interventions',
  ],
};

export async function generateDynamicDiagnosis(userPrompt: string): Promise<DynamicDiagnosisPayload> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured in .env');
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
You are the ADOPT Intelligence Engine, an expert product psychologist and growth engineer.
Your task is to analyze user adoption friction, telemetry, or user feedback and diagnose which ADOPT stage is broken:
- AWARE: Users don't know the feature exists / invisible entry points.
- DESIRE: Users know it exists, but lack motivation, unclear ROI, or ambiguous benefits.
- OPEN: Users attempt activation, but fail during setup due to cognitive friction or blank-canvas paralysis.
- PROFICIENT: Users reach first value, but habit breaks, shortcuts/syntax are complex, or week-2 retention drops.
- TRANSFORM: Power users love it, but cannot share, collaborate, or scale it across their team/organization.

CRITICAL INSTRUCTIONS:
1. Deeply personalize the vocabulary. If the user mentions "automation add-on" and "< 2% conversion", your diagnosis, signals, and interventions must directly address the automation add-on and conversion math.
2. Provide 3 to 5 hyper-specific, actionable interventions that solve their exact problem.
3. Generate realistic telemetry signals reflecting their inputs.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.2,
    },
  });

  if (!response.text) {
    throw new Error('Empty response from diagnosis engine');
  }

  return JSON.parse(response.text) as DynamicDiagnosisPayload;
}