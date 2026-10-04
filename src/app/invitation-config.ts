import { z } from "zod";

export const invitationPresetId = "rcc-scholarship-invitation-v1" as const;

export const invitationFieldDefaults = {
  schoolName: "Roman Catholic College",
  schoolLocation: "Mawathagama",
  invitationIntro: "cordially invites",
  chiefGuestPrefix: "as the",
  chiefGuestLabel: "Chief Guest",
  guestSeparator: "...",
  otherGuestsLine: "Principals of Neighbouring Schools\nand other Guests",
  eventIntro: "to grace our",
  eventTitle: "SCHOLARSHIP\nFELICITATION",
  ceremonyLabel: "CEREMONY",
  dateTime: "16th OCT. | 3 PM - 5 PM",
  venueLine: "@ Hotel Asliya",
  hostLine: "- The Principal and the Staff -",
} as const;

export const invitationFieldDescriptors = [
  ["schoolName", "School name"],
  ["schoolLocation", "School location"],
  ["invitationIntro", "Invitation phrase"],
  ["chiefGuestPrefix", "Chief guest introduction"],
  ["chiefGuestLabel", "Chief guest title"],
  ["guestSeparator", "Guest separator"],
  ["otherGuestsLine", "Closing guest line"],
  ["eventIntro", "Event introduction"],
  ["eventTitle", "Event title"],
  ["ceremonyLabel", "Event subtitle"],
  ["dateTime", "Date and time"],
  ["venueLine", "Venue"],
  ["hostLine", "Host line"],
] as const;

const invitationText = z.string().max(1000);
const guest = z.object({ name: invitationText, role: invitationText }).strict();
const invitationFieldsSchema = z.object(
  Object.fromEntries(
    Object.keys(invitationFieldDefaults).map((key) => [key, invitationText]),
  ) as Record<keyof typeof invitationFieldDefaults, typeof invitationText>,
).strict();

export const invitationConfigSchema = z.object({
  schemaVersion: z.literal(1),
  presetId: z.literal(invitationPresetId),
  fields: invitationFieldsSchema,
  chiefGuest: guest,
  guests: z.array(guest).max(20),
}).strict();

export type InvitationConfig = z.infer<typeof invitationConfigSchema>;
export type InvitationFieldId = keyof InvitationConfig["fields"];

export const invitationDefaults: InvitationConfig = {
  schemaVersion: 1,
  presetId: invitationPresetId,
  fields: { ...invitationFieldDefaults },
  chiefGuest: {
    name: "Mr. W. M. C. K. Wanninayaka",
    role: "Secretary, Chief Ministry, North Western Province",
  },
  guests: [
    { name: "Mrs. S. A. P. S. Jayamaha", role: "Zonal Director of Education, Kurunegala" },
    { name: "Mrs. K. V. S. Kumari", role: "Deputy Director (Administration), North Western Province" },
    { name: "Mr. R. K. A. S. K. Rathnayaka", role: "Divisional Director of Education, Mawathagama" },
    { name: "Mr. H. M. J. B. Tennakoon", role: "Primary Director, Kurunegala Zone" },
    { name: "Mr. Vindya Premathunga", role: "Manager, Peoples Bank, Mawathagama" },
  ],
};

export const INVITATION_STORAGE_KEY = "certificate-builder:draft:invitation:v1";
export const ACTIVE_PRESET_STORAGE_KEY = "certificate-builder:active-preset:v1";
