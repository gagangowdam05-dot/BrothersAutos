import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Allowed MIME types and extensions
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per image

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Retrieve all files submitted under 'files' or 'file'
    const files: File[] = [];
    const filesList = formData.getAll('files');
    const singleList = formData.getAll('file');

    for (const item of [...filesList, ...singleList]) {
      if (item instanceof File) {
        files.push(item);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No image files provided for upload.' },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the 10MB limit.` },
          { status: 400 }
        );
      }

      // Validate MIME type
      const mime = file.type.toLowerCase();
      if (!ALLOWED_MIME_TYPES.has(mime)) {
        return NextResponse.json(
          { error: `Unsupported file format for "${file.name}". Only JPG, PNG, and WebP are allowed.` },
          { status: 400 }
        );
      }

      // Determine extension
      let ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        if (mime === 'image/jpeg' || mime === 'image/jpg') ext = '.jpg';
        else if (mime === 'image/png') ext = '.png';
        else if (mime === 'image/webp') ext = '.webp';
        else ext = '.jpg';
      }

      // Create unique sanitized filename: car-<timestamp>-<hex><ext>
      const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      const safeFilename = `car-${uniqueSuffix}${ext}`;
      const destinationPath = path.join(uploadsDir, safeFilename);

      // Convert File ArrayBuffer to Node.js Buffer and write to disk
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(destinationPath, buffer);

      // Web-accessible path relative to public/
      uploadedUrls.push(`/uploads/${safeFilename}`);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image files.' },
      { status: 500 }
    );
  }
}
