const fs = require('fs');
const path = require('path');

const imageMapPath = path.join(__dirname, 'src', 'data', 'imageMap.json');
const stepImagesPath = path.join(__dirname, 'src', 'data', 'stepImages.json');

const imageMap = JSON.parse(fs.readFileSync(imageMapPath, 'utf8'));
const stepImages = {};

for (const [folder, images] of Object.entries(imageMap)) {
  // Let's just pick the first 10 images as default for steps
  stepImages[folder] = images.slice(0, 10);
}

fs.writeFileSync(stepImagesPath, JSON.stringify(stepImages, null, 2));

console.log('Successfully generated stepImages.json');
