import { z } from "zod";

export const fieldDefaults = {
  schoolName: "ROMAN CATHOLIC COLLEGE",
  schoolLocation: "MAWATHAGAMA",
  title: "Certificate",
  subtitle: "OF APPRECIATION",
  awardIntro: "THIS CERTIFICATE IS AWARDED TO",
  recipientName: "",
  achievementPrefix: "FOR SECURING",
  achievement: "FIRST/SECOND/THIRD",
  achievementSuffix: "IN",
  competitionName: "",
  programLine: "AT THE ENGLISH WEEK PROGRAM HELD BY",
  organizerPrefix: "THE",
  organizerName: "RCC ENGLISH UNIT",
  date: "26.09.2025",
} as const;

export const fieldDescriptors = [
  ["schoolName", "School name"], ["schoolLocation", "School location"],
  ["title", "Main heading"], ["subtitle", "Certificate type"],
  ["awardIntro", "Award introduction"], ["recipientName", "Recipient name"],
  ["achievementPrefix", "Text before result"], ["achievement", "Result / placing"],
  ["achievementSuffix", "Text after result"], ["competitionName", "Competition / activity"],
  ["programLine", "Program description"], ["organizerPrefix", "Text before organizer"],
  ["organizerName", "Organizer"], ["date", "Date"],
] as const;

const text = z.string().max(1000);
const signature = z.object({ name: text, role: text, organization: text });
export const configSchema = z.object({
  schemaVersion: z.literal(1), presetId: z.literal("rcc-appreciation-v1"),
  fields: z.object(Object.fromEntries(Object.keys(fieldDefaults).map((key) => [key, text])) as Record<keyof typeof fieldDefaults, typeof text>),
  signatureCount: z.number().int().min(1).max(4), signatures: z.array(signature).length(4), showSeal: z.boolean(),
});
export type CertificateConfig = z.infer<typeof configSchema>;
export const presetDefaults: CertificateConfig = {
  schemaVersion: 1, presetId: "rcc-appreciation-v1", fields: { ...fieldDefaults }, signatureCount: 2,
  signatures: [
    { name: "Mrs. I. M. N. Wasanthi Manike", role: "Teacher in Charge - English", organization: "Roman Catholic College" },
    { name: "Mr. W. M. D. V. Kulathunga", role: "Principal", organization: "Roman Catholic College" },
    { name: "", role: "", organization: "" }, { name: "", role: "", organization: "" },
  ], showSeal: true,
};
export const STORAGE_KEY = "certificate-builder:draft:v1";
