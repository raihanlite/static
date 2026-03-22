const fs = require("fs");
const path = require("path");

const baseUrl = "https://yourdomain.com";

const scanDir = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(scanDir(filePath));
    } else if (file.endsWith(".html")) {
      results.push(filePath);
    }
  });

  return results;
};

const files = scanDir("./");

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

files.forEach(file => {
  const url = file.replace(/\\/g, "/").replace("./", "");
  xml += `
  <url>
    <loc>${baseUrl}/${url}</loc>
  </url>`;
});

xml += `
</urlset>`;

fs.writeFileSync("sitemap.xml", xml);

console.log("Sitemap updated!");