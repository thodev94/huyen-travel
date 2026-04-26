const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'public', 'images', 'imgs');
const imageMapPath = path.join(__dirname, 'src', 'data', 'imageMap.json');
const toursPath = path.join(__dirname, 'src', 'data', 'tours.json');

// 1. Generate imageMap.json
const folders = fs.readdirSync(imgDir).filter(f => fs.statSync(path.join(imgDir, f)).isDirectory());
const imageMap = {};

folders.forEach(folder => {
  const files = fs.readdirSync(path.join(imgDir, folder)).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
  imageMap[folder] = files.map(f => `/images/imgs/${folder}/${f}`);
});

fs.writeFileSync(imageMapPath, JSON.stringify(imageMap, null, 2));

// 2. Update tours.json to add "folder" property
const tourFolderMapping = {
  "ben-tre-can-tho-2n1d": "cantho",
  "ben-tre-can-tho-chau-doc-3n2d": "chaudoc",
  "ben-tre": "bentre",
  "my-tho": "mytho",
  "sa-dec": "dongthap",
  "binh-quoi-peninsula": "binhquoi_thanhda",
  "can-gio-island": "cangio",
  "cu-chi-cho-lon": "cuchi",
  "cu-chi-half-day": "cuchi",
  "cu-chi-me-kong": "cuchi",
  "dong-nai": "dongnai",
  "sai-gon-city-full": "saigoncity",
  "vung-tau": "vungtau"
};

const tours = JSON.parse(fs.readFileSync(toursPath, 'utf8'));
const updatedTours = tours.map(tour => {
  const newTour = { ...tour };
  if (tourFolderMapping[tour.id]) {
    newTour.folder = tourFolderMapping[tour.id];
  } else {
    newTour.folder = "saigoncity"; // fallback
  }
  return newTour;
});

fs.writeFileSync(toursPath, JSON.stringify(updatedTours, null, 2));

console.log('Successfully updated imageMap.json and tours.json');
