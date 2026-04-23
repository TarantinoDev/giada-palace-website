import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(fileURLToPath(import.meta.url), '../../');

const jobs = [
  {
    src: 'assets/pool/hero-sunset.jpg',
    dst: 'src/assets/images/pool/hero-sunset.jpg',
  },
  {
    src: 'assets/units/apartment-a/CAMERA DA LETTO 4.jpg',
    dst: 'src/assets/images/units/apartment-a/hero.jpg',
  },
  {
    src: 'assets/units/room-4/1.jpg',
    dst: 'src/assets/images/units/room-4/hero.jpg',
  },
  {
    src: 'assets/units/room-5/1ROOM.jpg',
    dst: 'src/assets/images/units/room-5/hero.jpg',
  },
  {
    src: 'assets/exterior/3.jpg',
    dst: 'src/assets/images/exterior/facade-day.jpg',
  },
];

for (const { src, dst } of jobs) {
  const srcPath = resolve(root, src);
  const dstPath = resolve(root, dst);
  mkdirSync(dirname(dstPath), { recursive: true });
  const info = await sharp(srcPath)
    .resize(2400, 2400, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(dstPath);
  console.log(`✓ ${dst}  (${info.width}×${info.height})`);
}
