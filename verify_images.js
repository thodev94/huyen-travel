const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'public', 'images', 'imgs');
const imageMapPath = path.join(__dirname, 'src', 'data', 'imageMap.json');
const stepImagesPath = path.join(__dirname, 'src', 'data', 'stepImages.json');

// 1. Rebuild imageMap.json based on actual files
const folders = fs.readdirSync(imgDir).filter(f => fs.statSync(path.join(imgDir, f)).isDirectory());
const imageMap = {};

folders.forEach(folder => {
  const files = fs.readdirSync(path.join(imgDir, folder)).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
  imageMap[folder] = files.map(f => `/images/imgs/${folder}/${f}`);
});

fs.writeFileSync(imageMapPath, JSON.stringify(imageMap, null, 2));
console.log('Rebuilt imageMap.json with existing files.');

// 2. Verify stepImages.json
if (fs.existsSync(stepImagesPath)) {
  const stepImages = JSON.parse(fs.readFileSync(stepImagesPath, 'utf8'));
  let modified = false;

  for (const folder of Object.keys(stepImages)) {
    const validImages = imageMap[folder] || [];
    if (validImages.length === 0) continue; // No valid images to replace with

    stepImages[folder] = stepImages[folder].map(imgPath => {
      // imgPath is like "/images/imgs/bentre/1.jpg"
      const localPath = path.join(__dirname, 'public', imgPath);
      if (!fs.existsSync(localPath)) {
        console.log(`File missing: ${imgPath}. Replacing...`);
        modified = true;
        // Pick a random valid image or just the first one
        return validImages[Math.floor(Math.random() * validImages.length)];
      }
      return imgPath;
    });
  }

  if (modified) {
    fs.writeFileSync(stepImagesPath, JSON.stringify(stepImages, null, 2));
    console.log('Updated stepImages.json with valid files.');
  } else {
    console.log('stepImages.json is already up to date.');
  }
} else {
  console.log('stepImages.json not found.');
}
