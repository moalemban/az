import { googleAI } from '@genkit-ai/googleai';
import { firebase } from '@genkit-ai/firebase';
import { genkit, configureGenkit } from '@genkit-ai/core';
import { dev } from '@/ai/dev';

configureGenkit({
  plugins: [
    firebase(),
    googleAI({
      apiVersion: ['v1beta'],
    }),
  ],
  logSinks: ['firebase'],
  enableTracingAndMetrics: true,
});

export { genkit as ai };
