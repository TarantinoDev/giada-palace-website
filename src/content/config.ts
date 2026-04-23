import { defineCollection, z } from 'astro:content';

const unitsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    slug: z.string(),
    name: z.object({
      it: z.string(),
      en: z.string(),
      de: z.string().optional(),
      fr: z.string().optional(),
    }),
    category: z.enum(['apartment', 'double', 'single']),
    order: z.number().int(),

    maxGuests: z.number().int().positive(),
    bedConfiguration: z.string(),
    size: z.number().positive().optional(),

    heroImage: image(),
    gallery: z.array(image()).min(3).max(12),

    features: z.object({
      it: z.array(z.string()),
      en: z.array(z.string()),
      de: z.array(z.string()).optional(),
      fr: z.array(z.string()).optional(),
    }),

    shortDescription: z.object({
      it: z.string().max(160),
      en: z.string().max(160),
      de: z.string().max(160).optional(),
      fr: z.string().max(160).optional(),
    }),

    seo: z.object({
      it: z.object({ title: z.string(), description: z.string() }),
      en: z.object({ title: z.string(), description: z.string() }),
      de: z.object({ title: z.string(), description: z.string() }).optional(),
      fr: z.object({ title: z.string(), description: z.string() }).optional(),
    }),

    availableOnRequest: z.boolean().default(true),
    seasonalNote: z.string().optional(),
    isDraft: z.boolean().default(false),

    // v1.2: apartment-d and apartment-f share the same photo set
    sharesPhotosWith: z.string().optional(),
  }),
});

export const collections = { units: unitsCollection };
