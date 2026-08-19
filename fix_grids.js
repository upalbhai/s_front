const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/home/NewAdditionsSection.tsx',
  'src/components/home/TrendingSoundsSection.tsx',
  'src/components/home/SearchResultsSection.tsx',
  'src/app/[locale]/tag/[slug]/TagClient.tsx',
  'src/app/[locale]/new/NewClient.tsx',
  'src/app/[locale]/categories/[slug]/CategoryClient.tsx',
  'src/app/[locale]/search/[query]/SearchPageClient.tsx',
  'src/app/[locale]/trending/TrendingClient.tsx',
  'src/app/[locale]/sound/[soundSlug]/SoundDetailClient.tsx',
  'src/app/[locale]/favorites/page.tsx'
];

let replacedCount = 0;

for (const relativePath of filesToUpdate) {
  const filePath = path.join('/Users/neshmapatel/Desktop/Upal Projects/sound button/front', relativePath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the specific grid classes
    const updatedContent = content.replace(
      /grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8/g, 
      'grid-cols-2 min-[425px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
    );
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      replacedCount++;
      console.log(`Updated ${relativePath}`);
    }
  } else {
    console.log(`File not found: ${relativePath}`);
  }
}

console.log(`Total files updated: ${replacedCount}`);
