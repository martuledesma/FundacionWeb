const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dwkdishyg';
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'fundación-web';

export const isCloudinaryConfigured = Boolean(cloudName && uploadPreset);

export const uploadImageToCloudinary = async (file) => {
  if (!isCloudinaryConfigured) {
    throw new Error('Falta configurar Cloudinary en las variables de entorno.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'fundacion-web');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'No se pudo subir la imagen a Cloudinary.');
  }

  return data.secure_url;
};
