// Image compression worker

// Helper function to compress JPEG
async function compressJPEG(imageData) {
  // For now, using canvas compression
  // In the next step, we'll add proper compression libraries
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageData, 0, 0);
  
  return canvas.convertToBlob({
    type: 'image/jpeg',
    quality: 0.8
  });
}

// Helper function to compress PNG
async function compressPNG(imageData) {
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageData, 0, 0);
  
  return canvas.convertToBlob({
    type: 'image/png'
  });
}

// Helper function to compress WebP
async function compressWebP(imageData) {
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageData, 0, 0);
  
  return canvas.convertToBlob({
    type: 'image/webp',
    quality: 0.8
  });
}

// Main compression function
async function compressImage(file) {
  try {
    // Create bitmap from file
    const bitmap = await createImageBitmap(file);
    
    // Determine compression method based on file type
    switch (file.type) {
      case 'image/jpeg':
        return await compressJPEG(bitmap);
      case 'image/png':
        return await compressPNG(bitmap);
      case 'image/webp':
        return await compressWebP(bitmap);
      case 'image/gif':
        // For GIF, we'll implement proper compression in the next phase
        // For now, just return the original file
        return file;
      default:
        throw new Error('Unsupported image format');
    }
  } catch (error) {
    throw new Error(`Compression failed: ${error.message}`);
  }
}

// Listen for messages from the main thread
self.addEventListener('message', async (e) => {
  try {
    const { file, id } = e.data;
    
    // Send start status
    self.postMessage({
      type: 'status',
      id,
      status: 'processing'
    });
    
    // Compress the image
    const compressedBlob = await compressImage(file);
    
    // Send success response
    self.postMessage({
      type: 'success',
      id,
      result: compressedBlob,
      originalSize: file.size,
      compressedSize: compressedBlob.size
    });
  } catch (error) {
    // Send error response
    self.postMessage({
      type: 'error',
      id,
      error: error.message
    });
  }
});
