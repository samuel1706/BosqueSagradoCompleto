import { useState } from 'react';
import axios from 'axios';

export const useCloudinary = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'react_upload'); // Usa el upload preset que creaste

    try {
      setUploading(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dsmhnxyqh/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      );
      
      return {
        success: true,
        url: response.data.secure_url,
        publicId: response.data.public_id,
        fullData: response.data
      };
    } catch (error) {
      console.error('Error subiendo imagen a Cloudinary:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleImages = async (files) => {
    const uploadPromises = files.map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);
    return results;
  };

  return { 
    uploadImage, 
    uploadMultipleImages, 
    uploading 
  };
};