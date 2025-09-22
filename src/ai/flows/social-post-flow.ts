'use server';
/**
 * @fileOverview A social media post generation AI flow.
 *
 * - generateSocialPost - A function that handles the post generation process.
 * - SocialPostInput - The input type for the generateSocialPost function.
 * - SocialPostOutput - The return type for the generateSocialPost function.
 */

import { ai } from '@/lib/genkit';
import { z } from 'zod';

const SocialPostInputSchema = z.object({
  topic: z.string().describe('The main subject of the social media post.'),
  platform: z.string().describe('The target social media platform (e.g., Instagram, Twitter, LinkedIn, Generic).'),
  tone: z.string().describe('The desired tone of the post (e.g., Friendly, Formal, Humorous, Professional, Inspirational).'),
  includeHashtags: z.boolean().describe('Whether to include relevant hashtags.'),
  includeEmoji: z.boolean().describe('Whether to include relevant emojis.'),
});
export type SocialPostInput = z.infer<typeof SocialPostInputSchema>;

const SocialPostOutputSchema = z.object({
  postContent: z.string().describe('The generated content for the social media post.'),
  hashtags: z.array(z.string()).optional().describe('An array of suggested relevant hashtags, without the # symbol.'),
});
export type SocialPostOutput = z.infer<typeof SocialPostOutputSchema>;

export async function generateSocialPost(input: SocialPostInput): Promise<SocialPostOutput> {
  return socialPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'socialPostPrompt',
  input: { schema: SocialPostInputSchema },
  output: { schema: SocialPostOutputSchema },
  prompt: `
    You are a professional social media manager specializing in creating engaging content in Persian.
    Based on the user's request, generate a social media post.

    **Topic:**
    {{{topic}}}

    **Platform:**
    {{{platform}}}

    **Tone:**
    {{{tone}}}

    **Instructions:**
    1.  Write a compelling and concise post based on the topic, tailored for the specified platform.
    2.  Adopt the specified tone in your writing.
    3.  The entire output, including the post and hashtags, must be in Persian.
    {{#if includeEmoji}}
    4.  Incorporate relevant and tasteful emojis to enhance engagement.
    {{/if}}
    {{#if includeHashtags}}
    5.  Suggest 3 to 5 relevant and popular Persian hashtags. Provide them as a list in the 'hashtags' field of the output, without the '#' symbol.
    {{/if}}

    - For **Instagram**, focus on a strong opening, use paragraphs, and ask a question at the end to encourage comments.
    - For **Twitter (X)**, be concise and punchy (under 280 characters).
    - For **LinkedIn**, maintain a professional and informative tone.
    - For **Generic**, create a versatile post suitable for a blog or a messaging app channel.
  `,
});

const socialPostFlow = ai.defineFlow(
  {
    name: 'socialPostFlow',
    inputSchema: SocialPostInputSchema,
    outputSchema: SocialPostOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate social post. The model returned no output.');
    }
    return output;
  }
);
