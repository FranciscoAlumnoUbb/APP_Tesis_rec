// update-config.ts
import { networkInterfaces } from 'os';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const nets = networkInterfaces();
let localIp = '';

// Buscar una IP IPv4 válida no interna
for (const name of Object.keys(nets)) {
  for (const net of nets[name] || []) {
    if (
      net.family === 'IPv4' &&
      !net.internal &&
      (name.toLowerCase().includes('wi-fi') || name.toLowerCase().includes('ethernet') || name.toLowerCase().includes('lan'))
    ) {
      localIp = net.address;
      break;
    }
  }
  if (localIp) break;
}

if (!localIp) {
  console.error('❌ No se pudo encontrar una IP local válida.');
  process.exit(1);
}

// Ruta absoluta al archivo config.ts
const outputPath = join(__dirname, '..', 'app', 'constants', 'config.ts');

// Asegurar que el directorio exista (por si acaso)
mkdirSync(join(__dirname, '..', 'app', 'constants'), { recursive: true });

// Contenido del archivo
const content = `export const API_URL = 'http://${localIp}:5000';\n`;

try {
  writeFileSync(outputPath, content);
  console.log(`✅ config.ts actualizado con IP ${localIp}`);
} catch (err) {
  console.error('❌ Error al escribir config.ts:', err);
}
