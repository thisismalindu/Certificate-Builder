export const filename = (recipient: string) => `certificate${recipient.trim() ? `-${recipient.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}` : ""}`;

export async function capture(node: HTMLElement, dimensions: { width: number; height: number }): Promise<Blob> {
  await document.fonts.ready;
  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
  const { toCanvas } = await import("html-to-image");
  const canvas = await toCanvas(node, {
    backgroundColor: "#fff",
    width: node.offsetWidth,
    height: node.offsetHeight,
    canvasWidth: dimensions.width,
    canvasHeight: dimensions.height,
    pixelRatio: 1,
    cacheBust: true,
  });
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNG encoding failed")), "image/png");
  });
}

export function download(data: string | Blob, name: string) {
  const url = typeof data === "string" ? data : URL.createObjectURL(data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  if (typeof data !== "string") window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadPdf(image: Blob, name: string, orientation: "portrait" | "landscape", format: [number, number]) {
  const [{ jsPDF }, url] = await Promise.all([import("jspdf"), Promise.resolve(URL.createObjectURL(image))]);
  try {
    const raster = new Image();
    raster.src = url;
    await raster.decode();
    const pdf = new jsPDF({ orientation, unit: "mm", format });
    pdf.addImage(raster, "PNG", 0, 0, format[0], format[1], undefined, "FAST");
    pdf.save(name);
  } finally {
    URL.revokeObjectURL(url);
  }
}
