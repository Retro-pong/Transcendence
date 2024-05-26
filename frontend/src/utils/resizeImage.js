import { read } from '@popperjs/core';

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 이미지를 캔버스에 그려 리사이징
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let { width } = img;
        let { height } = img;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // 캔버스에 그린 이미지를 Blob으로 변환
        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type);
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

export default resizeImage;
