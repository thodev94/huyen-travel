const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'tours.json');
const tours = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Matches emojis (including maps, vans, flowers, checkboxes) and their variation selectors
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}]\uFE0F?/gu;
const straySelectorRegex = /[\uFE0F\uFE0E]/g;

function cleanString(str) {
  if (typeof str !== 'string') return str;
  let cleaned = str.replace(emojiRegex, '');
  cleaned = cleaned.replace(straySelectorRegex, '');
  // Clean double spaces that might occur from removing emojis
  return cleaned.replace(/\s+/g, ' ').trim();
}

let cleanedCount = 0;

function processNode(node) {
  if (!node) return;
  if (node.text) {
    const original = node.text;
    const cleaned = cleanString(node.text);
    if (original !== cleaned) {
      console.log(`Cleaned text: "${original}" -> "${cleaned}"`);
      node.text = cleaned;
      cleanedCount++;
    }
  }
  if (node.html) {
    const original = node.html;
    const cleaned = cleanString(node.html);
    if (original !== cleaned) {
      console.log(`Cleaned html: "${original}" -> "${cleaned}"`);
      node.html = cleaned;
      cleanedCount++;
    }
  }
  if (node.items && Array.isArray(node.items)) {
    node.items = node.items.map(item => {
      const cleaned = cleanString(item);
      if (item !== cleaned) {
        console.log(`Cleaned item: "${item}" -> "${cleaned}"`);
        cleanedCount++;
      }
      return cleaned;
    });
  }
}

tours.forEach(tour => {
  if (tour.title) {
    tour.title = cleanString(tour.title);
  }
  if (tour.brief) {
    tour.brief = cleanString(tour.brief);
  }
  if (tour.nodes && Array.isArray(tour.nodes)) {
    tour.nodes.forEach(processNode);
  }
});

if (cleanedCount > 0) {
  fs.writeFileSync(filePath, JSON.stringify(tours, null, 2), 'utf8');
  console.log(`Successfully cleaned ${cleanedCount} icons/emojis from tours.json.`);
} else {
  console.log("No emojis or icon characters found in tours.json.");
}
