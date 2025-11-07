import React from 'react';
import { useCloudinary } from '../hooks/useCloudinary';

const CloudinaryUploader = ({ onUpload, multiple = false, disabled = false }) => {
  const { uploadImage, uploadMultipleImages, uploading } = useCloudinary();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      let results;
      
      if (multiple) {
        results = await uploadMultipleImages(files);
      } else {
        const result = await uploadImage(files[0]);
        results = [result];
      }

      // Filtrar solo las subidas exitosas
      const successfulUploads = results.filter(result => result.success);
      
      if (onUpload && successfulUploads.length > 0) {
        onUpload(multiple ? successfulUploads : successfulUploads[0]);
      }

    } catch (error) {
      console.error('Error en el proceso de subida:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        multiple={multiple}
        disabled={uploading || disabled}
        style={{ display: 'none' }}
        id="cloudinary-upload"
      />
      <label 
        htmlFor="cloudinary-upload"
        style={{ 
          cursor: (uploading || disabled) ? 'not-allowed' : 'pointer',
          opacity: (uploading || disabled) ? 0.6 : 1
        }}
      >
        {uploading ? 'Subiendo...' : `Seleccionar ${multiple ? 'imágenes' : 'imagen'}`}
      </label>
    </div>
  );
};

export default CloudinaryUploader;