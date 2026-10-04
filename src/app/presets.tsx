import { Certificate } from "./certificate";
import {
  configSchema,
  fieldDescriptors,
  presetDefaults,
  STORAGE_KEY,
} from "./certificate-config";
import { Invitation } from "./invitation";
import {
  invitationConfigSchema,
  invitationDefaults,
  invitationFieldDescriptors,
  invitationPresetId,
  INVITATION_STORAGE_KEY,
} from "./invitation-config";
import type { CertificateConfig } from "./certificate-config";
import type { InvitationConfig } from "./invitation-config";

export type AppConfig = CertificateConfig | InvitationConfig;
export type PresetId = AppConfig["presetId"];

export const presetRegistry = {
  "rcc-appreciation-v1": {
    id: "rcc-appreciation-v1",
    name: "RCC Appreciation",
    defaults: presetDefaults,
    schema: configSchema,
    storageKey: STORAGE_KEY,
    editorFields: fieldDescriptors,
    surface: { width: 990, height: 700 },
    export: { width: 3508, height: 2480, orientation: "landscape" as const, page: [297, 210] as [number, number] },
    render: (config: AppConfig, innerRef: React.RefObject<HTMLDivElement | null>) =>
      config.presetId === "rcc-appreciation-v1" ? <Certificate config={config} innerRef={innerRef} /> : null,
  },
  [invitationPresetId]: {
    id: invitationPresetId,
    name: "RCC Scholarship Invitation",
    defaults: invitationDefaults,
    schema: invitationConfigSchema,
    storageKey: INVITATION_STORAGE_KEY,
    editorFields: invitationFieldDescriptors,
    surface: { width: 700, height: 700 * 2480 / 1748 },
    export: { width: 1748, height: 2480, orientation: "portrait" as const, page: [148, 210] as [number, number] },
    render: (config: AppConfig, innerRef: React.RefObject<HTMLDivElement | null>) =>
      config.presetId === invitationPresetId ? <Invitation config={config} innerRef={innerRef} /> : null,
  },
} satisfies Record<PresetId, {
  id: PresetId;
  name: string;
  defaults: AppConfig;
  schema: typeof configSchema | typeof invitationConfigSchema;
  storageKey: string;
  editorFields: readonly (readonly [string, string])[];
  surface: { width: number; height: number };
  export: { width: number; height: number; orientation: "portrait" | "landscape"; page: [number, number] };
  render: (config: AppConfig, innerRef: React.RefObject<HTMLDivElement | null>) => React.ReactNode;
}>;
