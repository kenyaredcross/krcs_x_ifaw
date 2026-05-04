import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the built index.html from Vite
const builtHtml = readFileSync(join(__dirname, '../krcs_x_ifaw/public/collab_ui/index.html'), 'utf-8');

// Read the template
const template = readFileSync(join(__dirname, 'index.template.html'), 'utf-8');

// Extract script and link tags from built HTML
const scriptRegex = /<script[^>]*src="[^"]*"[^>]*><\/script>/g;
const linkRegex = /<link[^>]*href="[^"]*"[^>]*>/g;

const scripts = builtHtml.match(scriptRegex) || [];
const links = builtHtml.match(linkRegex) || [];

// Combine all asset tags
const assetTags = [...links, ...scripts].join('\n    ');

// Replace placeholder in template
const finalHtml = template.replace('<!-- BUILD_ASSETS_PLACEHOLDER -->', assetTags);

// Write to www directory
writeFileSync(join(__dirname, '../krcs_x_ifaw/www/krcs-x-ifaw.html'), finalHtml);

console.log('✓ HTML template processed and copied to www/krcs-x-ifaw.html');
