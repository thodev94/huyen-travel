const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const docsDir = path.join(__dirname, 'src', 'documents');
const outputDir = path.join(__dirname, 'src', 'data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

function parseHtmlToNodes(html) {
  const nodes = [];
  const tagRegex = /<(h[1-6]|p|ul|ol|table)(?:[^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;
  
  while ((match = tagRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const content = match[2];
    
    if (tag.startsWith('h')) {
      const text = content.replace(/<[^>]+>/g, '').trim();
      if (text) {
        nodes.push({ type: 'heading', level: parseInt(tag[1]), text });
      }
    } else if (tag === 'p') {
      const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i);
      if (imgMatch) {
         nodes.push({ type: 'image', src: imgMatch[1] });
      } else {
         const text = content.replace(/<[^>]+>/g, '').trim();
         if (text) {
           nodes.push({ type: 'paragraph', text, html: content.trim() });
         }
      }
    } else if (tag === 'ul' || tag === 'ol') {
      const items = [];
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liRegex.exec(content)) !== null) {
         const liText = liMatch[1].replace(/<[^>]+>/g, '').trim();
         if (liText) items.push(liText);
      }
      if (items.length > 0) {
         nodes.push({ type: tag === 'ul' ? 'list-unordered' : 'list-ordered', items });
      }
    } else if (tag === 'table') {
      const rows = [];
      const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let trMatch;
      while ((trMatch = trRegex.exec(content)) !== null) {
         const cells = [];
         const tdRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
         let tdMatch;
         while ((tdMatch = tdRegex.exec(trMatch[1])) !== null) {
            cells.push(tdMatch[1].replace(/<[^>]+>/g, '').trim());
         }
         rows.push(cells);
      }
      if (rows.length > 0) {
         nodes.push({ type: 'table', rows });
      }
    }
  }
  return nodes;
}

async function parseDocs() {
  const categories = fs.readdirSync(docsDir).filter(f => fs.statSync(path.join(docsDir, f)).isDirectory());
  const allTours = [];
  const aboutData = {};

  for (const cat of categories) {
    const catPath = path.join(docsDir, cat);
    const files = fs.readdirSync(catPath).filter(f => f.endsWith('.docx'));

    for (const file of files) {
      console.log(`Parsing ${file}...`);
      const filePath = path.join(catPath, file);
      const result = await mammoth.convertToHtml({ path: filePath });
      const nodes = parseHtmlToNodes(result.value);
      
      const textResult = await mammoth.extractRawText({ path: filePath });
      const brief = textResult.value.substring(0, 150) + '...';

      if (cat === 'IntroAboutMe' || cat === 'Policy') {
        aboutData[file.replace('.docx', '')] = { nodes: nodes, brief: brief };
      } else {
        const id = file.replace('.docx', '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        allTours.push({
          id: id,
          category: cat.replace('Tour', ''),
          title: file.replace('.docx', ''),
          nodes: nodes,
          brief: brief
        });
      }
    }
  }

  fs.writeFileSync(path.join(outputDir, 'tours.json'), JSON.stringify(allTours, null, 2));
  fs.writeFileSync(path.join(outputDir, 'about.json'), JSON.stringify(aboutData, null, 2));
  console.log('Parsing complete. Generated node-based JSON.');
}

parseDocs().catch(console.error);
