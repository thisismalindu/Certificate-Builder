import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";
export const filename = (recipient: string) => `certificate${recipient.trim() ? `-${recipient.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}` : ""}`;
export async function capture(node: HTMLElement) {
  await document.fonts.ready;
  const img = node.querySelector("img");
  if (img && !img.complete) await new Promise((r) => { img.onload = r; img.onerror = r; });
  const scale = 3508 / 990;
  const canvas = await toCanvas(node, {
    backgroundColor: "#fff",
    width: 990,
    height: 700,
    canvasWidth: 990,
    canvasHeight: 700,
    pixelRatio: scale,
    cacheBust: true,
  });
  return canvas.toDataURL("image/png");
}
export function download(data: string | Blob, name: string) { const url = typeof data === "string" ? data : URL.createObjectURL(data); const a = document.createElement("a"); a.href = url; a.download = name; a.click(); if (typeof data !== "string") setTimeout(() => URL.revokeObjectURL(url), 1000); }
export async function downloadPdf(image: string, name: string) { const source = new Image(); await new Promise<void>((resolve, reject) => { source.onload = () => resolve(); source.onerror = reject; source.src = image; }); const canvas = document.createElement("canvas"); canvas.width = source.width; canvas.height = source.height; const context = canvas.getContext("2d"); if (!context) throw new Error("Canvas is unavailable"); context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(source, 0, 0); const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" }); pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 297, 210, undefined, "FAST"); pdf.save(name); }
