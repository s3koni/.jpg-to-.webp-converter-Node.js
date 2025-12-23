import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function FileUpload() {
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(80);
  const [lossless, setLossless] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zipping, setZipping] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setResults([]);
    }
  };

  const uploadSingleFile = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('quality', quality);
    formData.append('lossless', lossless);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Conversion failed on server');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      return { 
        originalName: file.name,
        url: url,
        blob: blob, // Store the raw blob for zipping later
        success: true 
      };
    } catch (error) {
      console.error("Upload error:", error);
      return { 
        originalName: file.name, 
        error: error.message, 
        success: false 
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setLoading(true);
    setResults([]); 

    const newResults = [];
    for (const file of files) {
      const result = await uploadSingleFile(file);
      newResults.push(result);
      setResults([...newResults]);
    }

    setLoading(false);
  };

  const handleDownloadAll = async () => {
    setZipping(true);
    const zip = new JSZip();
    
    // Filter only successful conversions
    const successfulFiles = results.filter(r => r.success);

    // Add files to the zip folder
    successfulFiles.forEach((file) => {
      const fileName = file.originalName.replace(/\.[^/.]+$/, "") + ".webp";
      zip.file(fileName, file.blob);
    });

    try {
      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "converted-images.zip");
    } catch (error) {
      console.error("Error zipping files:", error);
      alert("Failed to create zip file");
    } finally {
      setZipping(false);
    }
  };

  // Count successful uploads to decide whether to show the button
  const successCount = results.filter(r => r.success).length;

  return (
    <div className="upload-box">
      <form onSubmit={handleSubmit}>
        <input 
            type="file" 
            accept="image/jpeg, image/jpg, image/png" 
            onChange={handleFileChange} 
            multiple 
            required 
        />
        
        <div className="controls">
          <div className="control-group">
            <label>Quality: {quality}% (Disabled if Lossless)</label>
            <input type="range" min="0" max="100" value={quality} disabled={lossless} onChange={(e) => setQuality(e.target.value)} />
          </div>
          <div className="control-group">
            <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <input type="checkbox" checked={lossless} onChange={(e) => setLossless(e.target.checked)} />
              Use Lossless Compression
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading || files.length === 0}>
          {loading ? `Converting ${files.length} files...` : 'Convert All Images'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="results-container">
          <h3>Converted Images ({successCount}/{files.length})</h3>
          
          <ul className="file-list">
            {results.map((res, index) => (
              <li key={index} className="file-item">
                <span>{res.originalName}</span> 
                {res.success ? (
                  <a href={res.url} download={`converted-${res.originalName.replace(/\.[^/.]+$/, "")}.webp`} className="download-btn">Download</a>
                ) : (
                  <span className="error">Failed: {res.error}</span>
                )}
              </li>
            ))}
          </ul>

          {/* Download All Button - Only appears if more than 2 successful files */}
          {successCount > 2 && (
            <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
              <button 
                onClick={handleDownloadAll} 
                disabled={zipping}
                style={{ backgroundColor: '#6f42c1' }} // Purple color to distinguish it
              >
                {zipping ? 'Zipping...' : 'Download All (ZIP)'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}