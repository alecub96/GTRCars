const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const icons = ['cupe.png', 'spyder.png', 'sedan.png', 'suv.png'];
const dir = path.join(__dirname, '..', 'public', 'Icons');

async function trimIcons() {
  for (const file of icons) {
    const filePath = path.join(dir, file);
    const backupPath = path.join(dir, 'backup_' + file);
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
    }
    // Trim borders
    const buffer = await sharp(backupPath)
      .trim({
        background: '#FFFFFF',
        threshold: 30
      })
      .toBuffer();

    fs.writeFileSync(filePath, buffer);
    console.log('Successfully trimmed borders from:', file);
  }
}

trimIcons()
  .then(() => console.log('All icons trimmed!'))
  .catch(console.error);
