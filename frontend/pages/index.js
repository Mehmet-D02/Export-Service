import { useState } from 'react';
import axios from 'axios';
import { ProgressBar } from 'react-bootstrap';

export default function Home() {
  const [json, setJson] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      setJson(event.target.result);
    };
    fileReader.readAsText(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handleConvert = async (format) => {
    setLoading(true);
    setProgress(0);
    try {
      const response = await axios.post(`/api/convert?format=${format}`, JSON.parse(json), {
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `output.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Conversion error:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>JSON to PDF/CSV Converter</h1>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        placeholder="Enter JSON here"
        rows="10"
        cols="50"
      />
      <br />
      <input type="file" accept=".json" onChange={handleFileUpload} />
      <br />
      <button onClick={() => handleConvert('pdf')} disabled={loading}>
        Convert to PDF
      </button>
      <button onClick={() => handleConvert('csv')} disabled={loading}>
        Convert to CSV
      </button>
      {loading && (
        <div style={{ marginTop: '20px' }}>
          <ProgressBar animated now={progress} label={`${progress}%`} />
        </div>
      )}
    </div>
  );
}
