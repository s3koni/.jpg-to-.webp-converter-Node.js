import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { convertToWebP } from '../../lib/convert';

export const config = {
  api: {
    bodyParser: false, // Disabling Next.js body parser to let formidable handle the upload
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm();
  form.uploadDir = "./"; // Temporary upload dir
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'File upload error' });

    // Handle form fields (formidable v3 wraps values in arrays)
    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    const quality = Array.isArray(fields.quality) ? fields.quality[0] : fields.quality;
    const lossless = Array.isArray(fields.lossless) ? fields.lossless[0] === 'true' : fields.lossless === 'true';

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const inputPath = file.filepath;
    const outputPath = inputPath + '.webp';

    try {
      // 1. Call the conversion script
      await convertToWebP(inputPath, outputPath, { quality, lossless });

      // 2. Read the converted file
      const imageBuffer = fs.readFileSync(outputPath);

      // 3. Send back to browser
      res.setHeader('Content-Type', 'image/webp');
      res.send(imageBuffer);

      // 4. Cleanup temporary files
      try {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      } catch (cleanupErr) {
        console.error("Cleanup error:", cleanupErr);
      }

    } catch (convertErr) {
      console.error(convertErr);
      res.status(500).json({ error: 'Conversion failed' });
    }
  });
}