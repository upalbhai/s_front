const fs = require('fs');
const path = require('path');

const pages = ['about', 'contact', 'privacy', 'terms', 'dmca', 'disclaimer'];
const baseDir = '/Users/neshmapatel/Desktop/Upal Projects/sound button/front/src/app/[locale]';

for (const page of pages) {
  const filePath = path.join(baseDir, page, 'page.tsx');
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${page}, file not found.`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('import SchemaScript')) {
    console.log(`Skipping ${page}, already has SchemaScript.`);
    continue;
  }

  // Insert SchemaScript import
  content = content.replace("import { getRequestSite }", "import SchemaScript from '@/components/SchemaScript';\nimport { getRequestSite }");

  // Find the export default async function block
  const match = content.match(/export default async function ([A-Za-z]+)\(\)\s*\{([\s\S]*?)return ([\s\S]*?);\n\}/);
  if (match) {
    const fnName = match[1];
    const beforeReturn = match[2];
    const returnVal = match[3];

    const titleStr = page.charAt(0).toUpperCase() + page.slice(1);

    const schemaStr = `
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${titleStr}",
    "url": \`\${site.siteUrl}/${page}\`,
    "isPartOf": {
      "@type": "WebSite",
      "name": site.siteName,
      "url": site.siteUrl
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": \`\${site.siteUrl}/\`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "${titleStr}",
        "item": \`\${site.siteUrl}/${page}\`
      }
    ]
  };
`;

    const newReturn = `return (
    <>
      <SchemaScript schema={schema} />
      <SchemaScript schema={breadcrumbSchema} />
      ${returnVal.trim()}
    </>
  );`;

    const newFn = `export default async function ${fnName}() {${beforeReturn}${schemaStr}\n  ${newReturn}\n}`;

    content = content.replace(match[0], newFn);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${page}`);
  } else {
    console.log(`Could not match function block for ${page}`);
  }
}
