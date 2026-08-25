import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const directories = [
  'public/Anuncios/1',
  'public/Anuncios/2',
  'public/Anuncios/3',
];

for (const dir of directories) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.png') && !file.endsWith('.png.jpg')) {
      const fullPath = path.join(dir, file);
      console.log('Optimizing:', fullPath);
      // Resize to max 1200px width and compress directly in place with sips
      try {
        execSync(`sips -Z 1200 -s format jpeg -s formatOptions 75 "${fullPath}" --out "${fullPath}"`, { stdio: 'ignore' });
      } catch (err) {
        console.error('Error optimizing', fullPath, err);
      }
    }
  }
}

// Clean up any temporary .png.jpg files
execSync('find public/Anuncios -name "*.png.jpg" -delete');
console.log('Done optimizing images!');
