const fs = require('fs');
const path = require('path');

const toursPath = path.join(__dirname, '..', 'src', 'data', 'tours.json');
const tours = JSON.parse(fs.readFileSync(toursPath, 'utf8'));

// Paragraph text patterns to remove
const removePatterns = [
  /^xin chao,?$/i,
  /^welcome to /i,
  /^together we will/i,
  /^regards,?$/i,
  /^huyen bui$/i,
  /^fully flexible itinerary/i,
  /^then the driver and tour guide/i,
  /^return transfer/i,
  /^tour end & return/i
];

const cleanedTours = tours.map(tour => {
  const newNodes = tour.nodes.filter(node => {
    if (node.type === 'paragraph') {
      const text = (node.text || '').trim();
      // Check if text matches any of the remove patterns
      const shouldRemove = removePatterns.some(pattern => pattern.test(text));
      if (shouldRemove) {
        console.log(`Removing paragraph from tour ${tour.id}: "${text}"`);
        return false;
      }
    }
    return true;
  });
  return {
    ...tour,
    nodes: newNodes
  };
});

fs.writeFileSync(toursPath, JSON.stringify(cleanedTours, null, 2));
console.log('Finished cleaning paragraph nodes in tours.json');
