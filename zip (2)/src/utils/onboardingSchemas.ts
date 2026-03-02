import { z } from 'zod';

// --- Step 1: Choice ---
export const choiceSchema = z.enum(['CREATE', 'IMPORT']);

// --- Step 2: Company ---
export const companySchema = z.string().min(2, "Le nom de l'entreprise doit faire au moins 2 caractères.").max(100, "Le nom est trop long.");

// --- Step 3: Project ---
export const projectSchema = z.string().min(2, "Le nom du projet doit faire au moins 2 caractères.").max(100, "Le nom est trop long.");

// --- Step 4: Icon ---
export const iconSchema = z.string().min(1, "Veuillez choisir une icône.");

// --- Step 5: Color ---
export const colorSchema = z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Couleur invalide.");

// --- Step 6: Start Year (T0) ---
export const startYearSchema = z.number().int().min(2000, "L'année doit être supérieure à 2000.").max(2100, "L'année doit être inférieure à 2100.");

// --- Step 7: Duration ---
export const durationSchema = z.union([z.literal(3), z.literal(5), z.literal(7)]);

// --- Full Project Config (for final validation) ---
export const projectConfigSchema = z.object({
  companyName: companySchema,
  projectName: projectSchema,
  projectCode: z.string().optional(),
  icon: iconSchema,
  primaryColor: colorSchema,
  startYear: startYearSchema,
  duration: durationSchema,
});

// --- Import JSON Schema (Minimal check) ---
export const importJsonSchema = z.object({
  settings: z.object({
    companyName: z.string(),
    projectName: z.string(),
    startYear: z.number(),
    duration: z.number(),
    isConfigured: z.boolean(),
  }),
  // We can add more checks if needed, but this is the minimum required to start
});
