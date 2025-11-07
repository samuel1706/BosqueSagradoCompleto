// src/config/cloudinary.js
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'dsmhnxyqh' // Tu cloud name
  }
});

export default cld;