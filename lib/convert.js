const { exec } = require('child_process');
const path = require('path');

/**
 * Executes the cwebp command using the system's installed libwebp.
 */
function convertToWebP(inputPath, outputPath, options) {
  return new Promise((resolve, reject) => {
    // Construct command: cwebp -q 80 -lossless input.jpg -o output.webp
    const qualityFlag = options.lossless ? '-lossless' : `-q ${options.quality}`;
    
    // NOTE: We assume 'cwebp' is in your system PATH as you stated.
    const command = `cwebp ${qualityFlag} "${inputPath}" -o "${outputPath}"`;

    console.log("Executing:", command);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Conversion error:", stderr);
        return reject(error);
      }
      resolve(outputPath);
    });
  });
}

module.exports = { convertToWebP }; 