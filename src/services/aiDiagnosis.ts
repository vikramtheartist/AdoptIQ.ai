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
      description: 'A crisp 2-sentence actionable tactical direction. Do NOT repeat the user input. Provide direct UX guidance (e.g., "Default to a visual UI, enable a plain-text command palette (Cmd+K) with inline shortcut hints, and introduce advanced syntax gradually via contextual micro-prompts.").',
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
    throw new Error('VITE_GEMINI_API_KEY is not configured');
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
You are the ADOPT Intelligence Engine. Analyze product adoption friction and diagnose which ADOPT stage is broken:
- AWARE: Feature discovery, visibility, exposure, banners, announcements.
- DESIRE: Value clarity, motivation, ROI calculation, trial conversion.
- OPEN: Activation, onboarding, blank canvas, setup friction, SSO.
- PROFICIENT: Habit formation, keyboard shortcuts, advanced syntax, complex rules, week-2 retention drop-offs.
- TRANSFORM: Team sharing, collaboration, champion programs, organizational scaling.

CLASSIFICATION RULES:
- If the problem mentions shortcuts, syntax, complex rules, or habit building after first use -> MUST classify as PROFICIENT.
- Generate 'strategicPrescription' as a 2-sentence actionable solution.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.1,
    },
  });

  if (!response.text) {
    throw new Error('Empty response from model');
  }

  return JSON.parse(response.text) as DynamicDiagnosisPayload;
}