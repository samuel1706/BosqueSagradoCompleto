// src/components/ImageUploader.js
import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'react_upload'); // Usaremos el preset que creaste

    try {
      setUploading(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dsmhnxyqh/image/upload`, // Tu cloud name
        formData
      );
      
      setImageUrl(response.data.secure_url);
      console.log('✅ Imagen subida:', response.data.secure_url);
      return response.data.secure_url;
    } catch (error) {
      console.error('❌ Error subiendo imagen:', error);
      alert('Error subiendo imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadToCloudinary(file);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Subir imagen a Cloudinary</h3>
      <input 
        type="file" 
        onChange={handleFileChange} 
        accept="image/*"
        disabled={uploading}
      />
      {uploading && <p>⏳ Subiendo imagen...</p>}
      {imageUrl && (
        <div>
          <p>✅ ¡Imagen subida exitosamente!</p>
          <img src={imageUrl} alt="Preview" width="300" />
          <div>
            <strong>URL:</strong> 
            <textarea 
              value={imageUrl} 
              readOnly 
              style={{ width: '100%', marginTop: '10px' }}
              rows="2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;