import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function uploadLocalFile(
  fileBuffer: Buffer,
  fileName: string,
  folder = "uploads"
): Promise<{ success: boolean; url: string; error?: string }> {
  try {
    const uploadDir = join(process.cwd(), "public", folder);
    await mkdir(uploadDir, { recursive: true });

    const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = join(uploadDir, safeName);

    await writeFile(filePath, fileBuffer);

    const publicUrl = `/${folder}/${safeName}`;
    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error("Local file upload error:", error);
    return { success: false, url: "", error: error.message || "Local upload failed" };
  }
}
