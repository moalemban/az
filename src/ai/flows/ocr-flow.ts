'use server';
/**
 * @fileOverview An AI flow for extracting text from images and PDFs (OCR).
 *
 * - ocrFlow - A function that handles the text extraction process.
 * - OcrInput - The input type for the ocrFlow function.
 * - OcrOutput - The return type for the ocrFlow function.
 */

import { ai } from '@/lib/genkit';
import { z } from 'zod';

const OcrInputSchema = z.object({
  fileDataUri: z.string().describe(
    "A file (image or PDF) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type OcrInput = z.infer<typeof OcrInputSchema>;

const OcrOutputSchema = z.object({
  extractedText: z.string().describe('The text extracted from the document.'),
});
export type OcrOutput = z.infer<typeof OcrOutputSchema>;

export async function extractTextFromFile(input: OcrInput): Promise<OcrOutput> {
  return ocrFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ocrPrompt',
  input: { schema: OcrInputSchema },
  output: { schema: OcrOutputSchema },
  prompt: `You are an Optical Character Recognition (OCR) expert.
Extract all text from the following document. Maintain original formatting, including line breaks and paragraphs, as much as possible.
The output must be only the extracted text.

Document:
{{media url=fileDataUri}}
`,
});

const ocrFlow = ai.defineFlow(
  {
    name: 'ocrFlow',
    inputSchema: OcrInputSchema,
    outputSchema: OcrOutputSchema,
  },
  async (input: OcrInput) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to extract text. The model returned no output.');
    }
    return output;
  }
);
