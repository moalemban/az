import { googleAI } from '@genkit-ai/googleai';
import { firebase } from '@genkit-ai/firebase';
import {
  defineFlow,
  definePrompt,
  configureGenkit,
  genkit,
} from '@genkit-ai/ai';

const AiInstance = genkit({
  plugins: [
    firebase(),
    googleAI({
      apiVersion: ['v1beta'],
    }),
  ],
  logSinks: ['firebase'],
  enableTracingAndMetrics: true,
});

export { AiInstance as ai };
