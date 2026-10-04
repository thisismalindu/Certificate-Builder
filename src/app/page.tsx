"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  configSchema as certificateSchema,
  fieldDescriptors as certificateFieldDescriptors,
  type CertificateConfig,
} from "./certificate-config";
import { presetRegistry, type AppConfig, type PresetId } from "./presets";
import {
  ACTIVE_PRESET_STORAGE_KEY,
  invitationConfigSchema,
  invitationFieldDescriptors,
  invitationPresetId,
  type InvitationFieldId,
} from "./invitation-config";

type Preset = PresetId;

const button = "rounded-md border border-[#cfc7ba] bg-white px-3 py-2 text-sm font-semibold text-[#243653] transition hover:bg-[#f4efe7] disabled:cursor-wait disabled:opacity-60";
const primaryButton = "rounded-md border border-[#243653] bg-[#243653] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#30486f] disabled:cursor-wait disabled:opacity-60";

export default function Home() {
  const [config, setConfig] = useState<AppConfig>(presetRegistry["rcc-appreciation-v1"].defaults as CertificateConfig);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const [overflow, setOverflow] = useState<string[]>([]);
  const [scale, setScale] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const isInvitation = config.presetId === invitationPresetId;
  const activePreset: Preset = config.presetId;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      let selected: Preset = "rcc-appreciation-v1";
      try {
        const storedPreset = localStorage.getItem(ACTIVE_PRESET_STORAGE_KEY);
        if (storedPreset === invitationPresetId) selected = storedPreset;
        const key = presetRegistry[selected].storageKey;
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = selected === invitationPresetId
            ? invitationConfigSchema.safeParse(JSON.parse(saved))
            : certificateSchema.safeParse(JSON.parse(saved));
          if (parsed.success) setConfig(parsed.data);
          else setNotice("The saved draft was invalid, so the selected preset was restored.");
        }
      } catch {
        setNotice("Automatic saving is unavailable in this browser.");
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(presetRegistry[config.presetId].storageKey, JSON.stringify(config));
        localStorage.setItem(ACTIVE_PRESET_STORAGE_KEY, activePreset);
      } catch {
        setNotice("Automatic saving is unavailable in this browser.");
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [activePreset, config, isInvitation, ready]);

  useEffect(() => {
    const update = () => {
      if (shellRef.current) setScale(Math.min(1, shellRef.current.clientWidth / presetRegistry[activePreset].surface.width));
    };
    update();
    const observer = new ResizeObserver(update);
    if (shellRef.current) observer.observe(shellRef.current);
    return () => observer.disconnect();
  }, [activePreset]);

  const measureOverflow = useCallback(() => {
    if (!previewRef.current) return [] as string[];
    const nodes = Array.from(previewRef.current.querySelectorAll<HTMLElement>("[data-fit]"));
    return nodes.filter((node) => node.scrollHeight > node.clientHeight + 2 || node.scrollWidth > node.clientWidth + 2)
      .map((node) => node.dataset.fit || "text");
  }, []);

  useEffect(() => {
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) setOverflow(measureOverflow());
    });
    return () => { cancelled = true; };
  }, [config, measureOverflow]);

  const switchPreset = (preset: Preset) => {
    setNotice("");
    try {
      const key = presetRegistry[preset].storageKey;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = preset === invitationPresetId
          ? invitationConfigSchema.safeParse(JSON.parse(saved))
          : certificateSchema.safeParse(JSON.parse(saved));
        if (parsed.success) setConfig(parsed.data);
        else {
          setConfig(structuredClone(presetRegistry[preset].defaults));
          setNotice("That template’s saved draft was invalid, so its default content was restored.");
        }
      } else setConfig(structuredClone(presetRegistry[preset].defaults));
      localStorage.setItem(ACTIVE_PRESET_STORAGE_KEY, preset);
    } catch {
      setConfig(structuredClone(presetRegistry[preset].defaults));
      setNotice("Automatic saving is unavailable in this browser.");
    }
  };

  const updateCertificateField = (key: keyof CertificateConfig["fields"], value: string) => {
    setConfig((current) => current.presetId === "rcc-appreciation-v1"
      ? { ...current, fields: { ...current.fields, [key]: value } }
      : current);
  };
  const updateInvitationField = (key: InvitationFieldId, value: string) => {
    setConfig((current) => current.presetId === invitationPresetId
      ? { ...current, fields: { ...current.fields, [key]: value } }
      : current);
  };
  const updateChiefGuest = (key: "name" | "role", value: string) => {
    setConfig((current) => current.presetId === invitationPresetId
      ? { ...current, chiefGuest: { ...current.chiefGuest, [key]: value } }
      : current);
  };
  const updateGuest = (index: number, key: "name" | "role", value: string) => {
    setConfig((current) => current.presetId === invitationPresetId
      ? { ...current, guests: current.guests.map((guest, i) => i === index ? { ...guest, [key]: value } : guest) }
      : current);
  };
  const removeGuest = (index: number) => {
    setConfig((current) => current.presetId === invitationPresetId
      ? { ...current, guests: current.guests.filter((_, i) => i !== index) }
      : current);
  };
  const addGuest = () => {
    setConfig((current) => current.presetId === invitationPresetId && current.guests.length < 20
      ? { ...current, guests: [...current.guests, { name: "", role: "" }] }
      : current);
  };
  const overflowLabels = overflow.map((field) => {
    if (field.startsWith("guest.")) {
      const [, index, property] = field.split(".");
      return `Guest ${Number(index) + 1} ${property}`;
    }
    if (field.startsWith("chiefGuest.")) return `Chief guest ${field.split(".")[1]}`;
    if (field === "guestList") return "Guest list";
    return [...invitationFieldDescriptors, ...certificateFieldDescriptors].find(([id]) => id === field)?.[1] ?? field;
  });

  const currentIsEdited = () => JSON.stringify(config) !== JSON.stringify(presetRegistry[config.presetId].defaults);
  const confirmReplace = () => !ready || !currentIsEdited() || window.confirm("Replace the current content with this source or preset?");

  const saveSource = async () => {
    const { download, filename } = await import("./export");
    const stem = filename(isInvitation ? config.chiefGuest.name : config.fields.recipientName);
    const name = isInvitation ? `${stem.replace(/^certificate/, "invitation")}.invitation.json` : `${stem}.certificate.json`;
    download(new Blob([JSON.stringify(config, null, 2)], { type: "application/json;charset=utf-8" }), name);
  };

  const openSource = async (file: File) => {
    if (file.size > 100_000) {
      setNotice("Source files must be smaller than 100 KB.");
      return;
    }
    try {
      const raw: unknown = JSON.parse(await file.text());
      const parsed = typeof raw === "object" && raw !== null && "presetId" in raw && raw.presetId === invitationPresetId
        ? invitationConfigSchema.safeParse(raw)
        : certificateSchema.safeParse(raw);
      if (!parsed.success) {
        const issue = parsed.error.issues[0];
        const location = issue?.path.length ? ` at ${issue.path.join(" → ")}` : "";
        throw new Error(`This source file contains unsupported or invalid certificate data${location}.`);
      }
      if (!confirmReplace()) return;
      setConfig(parsed.data);
      setNotice("Source file opened.");
    } catch (error) {
      setNotice(error instanceof Error && error.message !== "Unexpected end of JSON input"
        ? error.message
        : "Could not open that file. Check that it contains valid certificate or invitation JSON.");
    }
  };

  const reset = () => {
    if (!confirmReplace()) return;
    setConfig(structuredClone(presetRegistry[config.presetId].defaults));
    setNotice(isInvitation ? "Invitation preset restored." : "Certificate preset restored.");
  };

  const exportFile = async (kind: "png" | "pdf") => {
    const affected = measureOverflow();
    setOverflow(affected);
    if (affected.length) {
      setNotice(`Shorten the highlighted text before downloading: ${affected.join(", " )}.`);
      return;
    }
    if (!previewRef.current) return;
    setBusy(kind);
    setNotice("");
    try {
      const { capture, download, downloadPdf, filename } = await import("./export");
      const exportSettings = presetRegistry[config.presetId].export;
      const png = await capture(previewRef.current, exportSettings);
      const stem = filename(isInvitation ? config.chiefGuest.name : config.fields.recipientName);
      const name = isInvitation ? stem.replace(/^certificate/, "invitation") : stem;
      if (kind === "png") download(png, `${name}.png`);
      else await downloadPdf(png, `${name}.pdf`, exportSettings.orientation, exportSettings.page);
    } catch {
      setNotice(`The ${isInvitation ? "invitation" : "certificate"} could not be exported. Please try again.`);
    } finally {
      setBusy("");
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <div className="eyebrow">ROMAN CATHOLIC COLLEGE</div>
          <h1>Certificate Builder</h1>
          <p>Create and download school certificates and invitations.</p>
        </div>
        <div className="header-actions">
          <label className="preset-picker">Template
            <select value={activePreset} onChange={(event) => switchPreset(event.target.value as Preset)} disabled={!!busy}>
              <option value="rcc-appreciation-v1">{presetRegistry["rcc-appreciation-v1"].name}</option>
              <option value={invitationPresetId}>{presetRegistry[invitationPresetId].name}</option>
            </select>
          </label>
          <button className={button} onClick={() => void saveSource()}>Save source</button>
          <button className={button} onClick={() => fileRef.current?.click()}>Open source</button>
          <input ref={fileRef} type="file" accept="application/json,.json,.certificate.json,.invitation.json" className="sr-only" onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) void openSource(file);
            event.currentTarget.value = "";
          }} />
          <button className={button} onClick={reset}>Reset to preset</button>
        </div>
      </header>

      {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}

      <div className="workspace">
        <aside className="editor-panel">
          {isInvitation && config.presetId === invitationPresetId ? <>
            <section>
              <h2>School and wording</h2>
              {invitationFieldDescriptors.slice(0, 7).map(([key, label]) => <Field key={key} label={label} value={config.fields[key]} onChange={(value) => updateInvitationField(key, value)} multiline={key === "otherGuestsLine"} invalid={overflow.includes(key)} />)}
            </section>
            <section>
              <h2>Guests</h2>
              <h3 className="guest-editor-heading">Chief guest</h3>
              <Field label="Name" value={config.chiefGuest.name} onChange={(value) => updateChiefGuest("name", value)} invalid={overflow.includes("chiefGuest.name")} />
              <Field label="Role" value={config.chiefGuest.role} onChange={(value) => updateChiefGuest("role", value)} multiline invalid={overflow.includes("chiefGuest.role")} />
              {config.guests.map((guest, index) => <div className="guest-editor" key={index}>
                <div className="guest-editor-title"><h3>Guest {index + 1}</h3><button type="button" className="text-action" onClick={() => removeGuest(index)}>Remove</button></div>
                <Field label="Name" value={guest.name} onChange={(value) => updateGuest(index, "name", value)} invalid={overflow.includes(`guest.${index}.name`)} />
                <Field label="Role" value={guest.role} onChange={(value) => updateGuest(index, "role", value)} multiline invalid={overflow.includes(`guest.${index}.role`)} />
              </div>)}
              <button type="button" className={button} onClick={addGuest} disabled={config.guests.length >= 20}>Add guest</button>
              <p className="control-hint">{config.guests.length} of 20 additional guest entries</p>
            </section>
            <section>
              <h2>Event details</h2>
              {invitationFieldDescriptors.slice(7).map(([key, label]) => <Field key={key} label={label} value={config.fields[key]} onChange={(value) => updateInvitationField(key, value)} multiline={key === "eventTitle" || key === "dateTime"} invalid={overflow.includes(key)} />)}
            </section>
          </> : config.presetId === "rcc-appreciation-v1" ? <>
            <section><h2>School and headings</h2>{certificateFieldDescriptors.slice(0, 5).map(([key, label]) => <Field key={key} label={label} value={config.fields[key]} onChange={(value) => updateCertificateField(key, value)} />)}</section>
            <section><h2>Award details</h2>{certificateFieldDescriptors.slice(5, 13).map(([key, label]) => <Field key={key} label={label} value={config.fields[key]} onChange={(value) => updateCertificateField(key, value)} multiline={key === "programLine"} />)}</section>
            <section>
              <h2>Signatures and date</h2>
              <label className="control-label">Number of signatures<select value={config.signatureCount} onChange={(event) => setConfig((current) => current.presetId === "rcc-appreciation-v1" ? { ...current, signatureCount: Number(event.target.value) } : current)}>{[1, 2, 3, 4].map((count) => <option key={count}>{count}</option>)}</select></label>
              <label className="toggle"><input type="checkbox" checked={config.showSeal} onChange={(event) => setConfig((current) => current.presetId === "rcc-appreciation-v1" ? { ...current, showSeal: event.target.checked } : current)} /> Show red seal</label>
              {config.signatures.map((signature, index) => <div className="signature-editor" key={index}><h3>Signature {index + 1}</h3><Field label="Name" value={signature.name} onChange={(value) => setConfig((current) => current.presetId === "rcc-appreciation-v1" ? { ...current, signatures: current.signatures.map((item, i) => i === index ? { ...item, name: value } : item) } : current)} /><Field label="Role" value={signature.role} onChange={(value) => setConfig((current) => current.presetId === "rcc-appreciation-v1" ? { ...current, signatures: current.signatures.map((item, i) => i === index ? { ...item, role: value } : item) } : current)} /><Field label="Organization" value={signature.organization} onChange={(value) => setConfig((current) => current.presetId === "rcc-appreciation-v1" ? { ...current, signatures: current.signatures.map((item, i) => i === index ? { ...item, organization: value } : item) } : current)} /></div>)}
              <Field label="Date" value={config.fields.date} onChange={(value) => updateCertificateField("date", value)} />
            </section>
          </> : null}
        </aside>

        <section className="preview-panel">
          <div className="preview-toolbar">
            <div><span className="eyebrow">LIVE PREVIEW</span><span className="fit-status">{overflow.length ? `Needs shortening: ${overflowLabels.join(", ")}` : "Ready to download"}</span></div>
            <div className="download-actions">
              <button className={primaryButton} disabled={!!busy || !!overflow.length} onClick={() => void exportFile("png")}>{busy === "png" ? "Preparing…" : "Download PNG"}</button>
              <button className={button} disabled={!!busy || !!overflow.length} onClick={() => void exportFile("pdf")}>{busy === "pdf" ? "Preparing…" : "Download PDF"}</button>
            </div>
          </div>
          <div className={`preview-shell ${isInvitation ? "portrait" : ""}`} ref={shellRef}>
            <div className={`preview-scale ${isInvitation ? "invitation-scale" : ""}`} style={{
              width: presetRegistry[config.presetId].surface.width,
              height: presetRegistry[config.presetId].surface.height,
              transform: `scale(${scale})`,
            }}>
              {presetRegistry[config.presetId].render(config, previewRef)}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, multiline, invalid = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; invalid?: boolean }) {
  const props = { value, maxLength: 1000, "aria-invalid": invalid, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value) };
  return <label className="control-label">{label}{multiline ? <textarea {...props} rows={2} /> : <input {...props} />}{invalid && <span className="field-error">This text overflows the invitation area. Shorten it to download.</span>}</label>;
}
