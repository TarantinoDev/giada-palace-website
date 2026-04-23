import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(fileURLToPath(import.meta.url), '../../');

const jobs = [
  // --- originals ---
  { src: 'assets/pool/hero-sunset.jpg',                    dst: 'src/assets/images/pool/hero-sunset.jpg' },
  { src: 'assets/units/apartment-a/CAMERA DA LETTO 4.jpg', dst: 'src/assets/images/units/apartment-a/hero.jpg' },
  { src: 'assets/units/room-4/1.jpg',                      dst: 'src/assets/images/units/room-4/hero.jpg' },
  { src: 'assets/units/room-5/1ROOM.jpg',                  dst: 'src/assets/images/units/room-5/hero.jpg' },
  { src: 'assets/exterior/3.jpg',                          dst: 'src/assets/images/exterior/facade-day.jpg' },

  // --- pool daytime (Fix 6) ---
  { src: 'assets/exterior/16.jpg',                         dst: 'src/assets/images/pool/pool-daytime.jpg' },

  // --- pool carousel (Fix 3 PR-FIX-4) — 7 images ---
  { src: 'assets/pool/hero-sunset.jpg', dst: 'src/assets/images/pool/pool-01.jpg' },
  { src: 'assets/pool/4.jpg',           dst: 'src/assets/images/pool/pool-02.jpg' },
  { src: 'assets/pool/6.jpg',           dst: 'src/assets/images/pool/pool-03.jpg' },
  { src: 'assets/pool/8.jpg',           dst: 'src/assets/images/pool/pool-04.jpg' },
  { src: 'assets/pool/12.jpg',          dst: 'src/assets/images/pool/pool-05.jpg' },
  { src: 'assets/pool/15.jpg',          dst: 'src/assets/images/pool/pool-06.jpg' },
  { src: 'assets/pool/17.jpg',          dst: 'src/assets/images/pool/pool-07.jpg' },

  // --- apartment-a gallery (Fix 3) — 20 images, best-first order ---
  { src: 'assets/units/apartment-a/CAMERA DA LETTO 4.jpg',       dst: 'src/assets/images/units/apartment-a/gallery-01.jpg' },
  { src: 'assets/units/apartment-a/CAMERA DA LETTO 1.jpg',       dst: 'src/assets/images/units/apartment-a/gallery-02.jpg' },
  { src: 'assets/units/apartment-a/CAMERA DA LETTO 2.jpeg',      dst: 'src/assets/images/units/apartment-a/gallery-03.jpg' },
  { src: 'assets/units/apartment-a/CAMERA DA LETTO 5.jpg',       dst: 'src/assets/images/units/apartment-a/gallery-04.jpg' },
  { src: 'assets/units/apartment-a/DETTAGLIO CAMERA DA LETTO.jpg',   dst: 'src/assets/images/units/apartment-a/gallery-05.jpg' },
  { src: 'assets/units/apartment-a/DETTAGLIO CAMERA DA LETTO 2.jpg', dst: 'src/assets/images/units/apartment-a/gallery-06.jpg' },
  { src: 'assets/units/apartment-a/DETTAGLIO CAMERA DA LETTO 3.jpg', dst: 'src/assets/images/units/apartment-a/gallery-07.jpg' },
  { src: 'assets/units/apartment-a/DOPPIA .jpeg',                dst: 'src/assets/images/units/apartment-a/gallery-08.jpg' },
  { src: 'assets/units/apartment-a/DOPPIA CON 1 LETTO.jpg',      dst: 'src/assets/images/units/apartment-a/gallery-09.jpg' },
  { src: 'assets/units/apartment-a/DOPPIA CON 1 LETTO 2.jpg',    dst: 'src/assets/images/units/apartment-a/gallery-10.jpg' },
  { src: 'assets/units/apartment-a/DOPPIA CON 1 LETTO 3.jpg',    dst: 'src/assets/images/units/apartment-a/gallery-11.jpg' },
  { src: 'assets/units/apartment-a/SALOTTO 1 .jpeg',             dst: 'src/assets/images/units/apartment-a/gallery-12.jpg' },
  { src: 'assets/units/apartment-a/SALOTTO 2.jpeg',              dst: 'src/assets/images/units/apartment-a/gallery-13.jpg' },
  { src: 'assets/units/apartment-a/SALOTTO 3.jpg',               dst: 'src/assets/images/units/apartment-a/gallery-14.jpg' },
  { src: 'assets/units/apartment-a/CUCINA 1.jpeg',               dst: 'src/assets/images/units/apartment-a/gallery-15.jpg' },
  { src: 'assets/units/apartment-a/CUCINA 2.jpeg',               dst: 'src/assets/images/units/apartment-a/gallery-16.jpg' },
  { src: 'assets/units/apartment-a/BAGNO 1.jpeg',                dst: 'src/assets/images/units/apartment-a/gallery-17.jpg' },
  { src: 'assets/units/apartment-a/BAGNO 2.jpeg',                dst: 'src/assets/images/units/apartment-a/gallery-18.jpg' },
  { src: 'assets/units/apartment-a/BALCONE.jpg',                 dst: 'src/assets/images/units/apartment-a/gallery-19.jpg' },
  { src: 'assets/units/apartment-a/CORRIDIO.jpeg',               dst: 'src/assets/images/units/apartment-a/gallery-20.jpg' },

  // --- room-4 gallery (Fix 3) — 11 images ---
  { src: 'assets/units/room-4/1.jpg',   dst: 'src/assets/images/units/room-4/gallery-01.jpg' },
  { src: 'assets/units/room-4/2.jpg',   dst: 'src/assets/images/units/room-4/gallery-02.jpg' },
  { src: 'assets/units/room-4/3.jpg',   dst: 'src/assets/images/units/room-4/gallery-03.jpg' },
  { src: 'assets/units/room-4/4.jpeg',  dst: 'src/assets/images/units/room-4/gallery-04.jpg' },
  { src: 'assets/units/room-4/5.jpeg',  dst: 'src/assets/images/units/room-4/gallery-05.jpg' },
  { src: 'assets/units/room-4/6.jpeg',  dst: 'src/assets/images/units/room-4/gallery-06.jpg' },
  { src: 'assets/units/room-4/7.jpg',   dst: 'src/assets/images/units/room-4/gallery-07.jpg' },
  { src: 'assets/units/room-4/8.jpg',   dst: 'src/assets/images/units/room-4/gallery-08.jpg' },
  { src: 'assets/units/room-4/9.jpg',   dst: 'src/assets/images/units/room-4/gallery-09.jpg' },
  { src: 'assets/units/room-4/10.jpg',  dst: 'src/assets/images/units/room-4/gallery-10.jpg' },
  { src: 'assets/units/room-4/11.jpg',  dst: 'src/assets/images/units/room-4/gallery-11.jpg' },

  // --- room-5 gallery (Fix 3) — 5 images ---
  { src: 'assets/units/room-5/1ROOM.jpg', dst: 'src/assets/images/units/room-5/gallery-01.jpg' },
  { src: 'assets/units/room-5/2ROOM.jpg', dst: 'src/assets/images/units/room-5/gallery-02.jpg' },
  { src: 'assets/units/room-5/3ROOM.jpg', dst: 'src/assets/images/units/room-5/gallery-03.jpg' },
  { src: 'assets/units/room-5/4ROOM.jpg', dst: 'src/assets/images/units/room-5/gallery-04.jpg' },
  { src: 'assets/units/room-5/5ROOM.jpg', dst: 'src/assets/images/units/room-5/gallery-05.jpg' },
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
