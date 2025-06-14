import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Debug = () => {
  const [files, setFiles] = useState([]);
  const [serverInfo, setServerInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageTest, setImageTest] = useState({});

  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        // Get server configuration
        const configResponse = await axios.get('/api/debug/dirs');
        setServerInfo(configResponse.data);
        
        // Get list of uploaded files
        const uploadsResponse = await axios.get('/api/upload/list');
        setFiles(uploadsResponse.data.files || []);
        
        // Try loading the first image as a test
        if (uploadsResponse.data.files && uploadsResponse.data.files.length > 0) {
          const testFile = uploadsResponse.data.files[0];
          setImageTest({
            filename: testFile.name,
            relativePath: testFile.path,
            absolutePath: `${window.location.origin}${testFile.path}`
          });
        }
        
      } catch (err) {
        setError('Failed to fetch debug info: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDebugInfo();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Image Path Debug Page</h1>
      {loading ? (
        <p>Loading debug information...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div>
          <section style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Server Configuration</h2>
            <pre>{JSON.stringify(serverInfo, null, 2)}</pre>
          </section>
          
          <section style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Uploaded Files ({files.length})</h2>
            {files.length === 0 ? (
              <p>No files found</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {files.map((file, index) => (
                  <li key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee' }}>
                    <div>Filename: <strong>{file.name}</strong></div>
                    <div>Path: <code>{file.path}</code></div>
                    <div style={{ marginTop: '10px' }}>
                      <img 
                        src={`${window.location.origin}${file.path}`} 
                        alt={file.name}
                        style={{ maxWidth: '200px', border: '1px solid #ddd' }}
                        onLoad={() => console.log('Image loaded successfully:', file.path)}
                        onError={(e) => {
                          console.error('Failed to load image:', file.path);
                          e.target.style.border = '2px solid red';
                        }}
                      />
                    </div>
                    
                    <div style={{ marginTop: '10px' }}>
                      <h4>Test with different paths:</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <img 
                          src={`${file.path}`} 
                          alt="Relative path" 
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.border = '2px solid red'; }}
                        />
                        <img 
                          src={`/${file.path}`} 
                          alt="Root relative path" 
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.border = '2px solid red'; }}
                        />
                        <img 
                          src={`${window.location.origin}${file.path}`} 
                          alt="Absolute path" 
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.border = '2px solid red'; }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          
          {imageTest.filename && (
            <section style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc' }}>
              <h2>Image Test</h2>
              <div>
                <p>Testing image: <strong>{imageTest.filename}</strong></p>
                <p>Relative path: <code>{imageTest.relativePath}</code></p>
                <p>Absolute path: <code>{imageTest.absolutePath}</code></p>
                
                <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '10px' }}>
                  <h3>Image Preview:</h3>
                  <img 
                    src={imageTest.absolutePath}
                    alt="Test"
                    style={{ maxWidth: '100%', marginBottom: '10px' }}
                    onLoad={() => console.log('Test image loaded successfully')}
                    onError={() => console.error('Test image failed to load')}
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Debug;
