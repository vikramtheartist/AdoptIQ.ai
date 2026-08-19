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
  strategicPrescription: string;
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
      description: 'The diagnosed ADOPT stage.',
    },
    stageLabel: { type: Type.STRING },
    confidence: { type: Type.INTEGER },
    behavioralPattern: { type: Type.STRING },
    psychologicalDriver: { type: Type.STRING },
    strategicPrescription: {
      type: Type.STRING,
      description: 'A crisp, 2-sentence actionable tactical direction. Do NOT summarize the user problem. Tell the team exactly what to build or change (e.g., "Default to visual UI, enable Cmd+K palette with inline hints, and scaffold syntax progressively.").',
    },
    problemSummary: { type: Type.STRING },
    takeaway: { type: Type.STRING },
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
    'strategicPrescription',
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
You are the ADOPT Intelligence Engine. Analyze friction, telemetry, or user feedback and diagnose which ADOPT stage is broken:
- AWARE: Discovery, reach, invisible entry points, banners, announcement channels.
- DESIRE: Acquisition, landing page, ambiguous ROI, trial conversion, benefit proof.
- OPEN: Activation, onboarding, blank-canvas paralysis, step-by-step setup, SSO.
- PROFICIENT: Retention, shortcuts, advanced syntax, complex rules, habituation, week-2 drop-offs.
- TRANSFORM: Scaling, team sharing, champion mentorship, peer templates, organizational advocacy.

DIAGNOSIS RULES:
1. If users struggle with shortcuts, advanced rules, syntax, or building repeat habits after first use, route strictly to PROFICIENT.
2. Provide 'strategicPrescription': Exactly 2 sentences stating what UI/UX modifications to make. Never repeat the user's problem.
3. Generate 3 to 5 interventions tailored with contextual UI terms reflecting the diagnosed stage.
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