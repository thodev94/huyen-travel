const fs = require('fs');
const path = require('path');

const toursPath = path.join(__dirname, '..', 'src', 'data', 'tours.json');
const tours = JSON.parse(fs.readFileSync(toursPath, 'utf8'));

const briefs = {
  "ben-tre-can-tho-2n1d": "Discover the Land of Coconut Trees in Ben Tre and experience the vibrant floating markets of Can Tho in 2 days.",
  "ben-tre-can-tho-chau-doc-3n2d": "Embark on a 3-day Mekong journey: explore coconut workshops in Ben Tre, Can Tho's floating markets, and the scenic cajuput forests of Chau Doc.",
  "ben-tre": "Spend a day exploring traditional workshops, scenic waterways, and the lush countryside of Ben Tre, the coconut capital.",
  "my-tho": "Experience the heart of the Mekong Delta with honey tea tastings, traditional canal boat rides, and the ancient Vinh Trang Pagoda.",
  "sa-dec": "Tour the charming riverside town of Sa Dec, famous for its historic flower village, ancient houses, and beautiful lotus pagodas.",
  "binh-quoi-peninsula": "A peaceful weekend getaway in Saigon featuring scenic river bus rides, local wet markets, and tranquil village landscapes.",
  "cu-chi-tunnels-options": "Explore the historic Cu Chi Tunnels with customizable extensions to Cho Lon (Chinatown) or the Mekong Delta.",
  "can-gio-island": "Escape to Can Gio's UNESCO biosphere reserve: canoe through lush mangrove forests, spot wild monkeys, and visit a crocodile sanctuary.",
  "dong-nai": "Discover the hidden charms of Dong Nai: ride a scenic train, visit ancestral houses, and watch traditional pottery making.",
  "sai-gon-city-full": "Immerse yourself in Saigon's rich history and culture: visit Thien Hau temple, local markets, and historic wartime command bunkers.",
  "vung-tau": "A relaxing coastal escape to Vung Tau beach featuring colonial mansions, panoramic lighthouses, and a unique arms museum."
};

const updatedTours = tours.map(tour => {
  if (briefs[tour.id]) {
    tour.brief = briefs[tour.id];
  }
  return tour;
});

fs.writeFileSync(toursPath, JSON.stringify(updatedTours, null, 2));
console.log('Finished updating briefs in tours.json');
