import React, { useState } from 'react';
import { isCloudinaryConfigured, uploadImageToCloudinary } from '../cloudinary';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ImageUploadField = ({
  label = 'Imagen',
  value = '',
  onChange,
  previewAlt = 'Preview',
  previewWidth = '240px',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const uploadFile = async (file) => {
    setUploadError('');

    if (!file?.type?.startsWith('image/')) {
      setUploadError('Elegí un archivo de imagen.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError('La imagen no puede pesar más de 10 MB.');
      return;
    }

    setIsUploading(true);
    try {
      onChange(await uploadImageToCloudinary(file));
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    uploadFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="image-upload-field">
      <label>
        {label}
        <input
          type="url"
          placeholder="https://ejemplo.com/imagen.jpg"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>

      <label
        className={`image-drop-zone ${isDragging ? 'is-dragging' : ''} ${isUploading ? 'is-uploading' : ''}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          className="image-file-input"
          type="file"
          accept="image/*"
          disabled={isUploading}
          onChange={(event) => uploadFile(event.target.files?.[0])}
        />
        <strong>{isUploading ? 'Subiendo imagen...' : 'Arrastrá una foto acá'}</strong>
        <span>{isUploading ? 'Esperá un momento' : 'o hacé clic para elegirla'}</span>
      </label>

      {!isCloudinaryConfigured && (
        <p className="image-upload-note">Configurá Cloudinary para habilitar la subida de archivos.</p>
      )}
      {uploadError && <p className="form-error">{uploadError}</p>}

      {value && (
        <label>
          Preview
          <img
            src={value}
            alt={previewAlt}
            style={{ maxWidth: previewWidth, marginTop: '10px', borderRadius: '8px', display: 'block' }}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploadField;
