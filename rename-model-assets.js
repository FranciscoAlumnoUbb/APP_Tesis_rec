const fs = require('fs');
const path = require('path');

const modelDir = path.join(__dirname, 'assets', 'model');

const filesMap = [
  { original: 'model.json', renamed: 'model.png' },
  { original: 'group1-shard1of7.bin', renamed: 'shard1.png' },
  { original: 'group1-shard2of7.bin', renamed: 'shard2.png' },
  { original: 'group1-shard3of7.bin', renamed: 'shard3.png' },
  { original: 'group1-shard4of7.bin', renamed: 'shard4.png' },
  { original: 'group1-shard5of7.bin', renamed: 'shard5.png' },
  { original: 'group1-shard6of7.bin', renamed: 'shard6.png' },
  { original: 'group1-shard7of7.bin', renamed: 'shard7.png' },
];

const mode = process.argv[2]; // "to-png" o "restore"

if (!fs.existsSync(modelDir)) {
  console.error('❌ Carpeta assets/model no encontrada');
  process.exit(1);
}

for (const file of filesMap) {
  const from = path.join(modelDir, mode === 'to-png' ? file.original : file.renamed);
  const to = path.join(modelDir, mode === 'to-png' ? file.renamed : file.original);

  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
    console.log(`✅ Renombrado: ${path.basename(from)} → ${path.basename(to)}`);
  } else {
    console.warn(`⚠️ No encontrado: ${path.basename(from)}`);
  }
}

console.log(`\n🎉 Renombrado completo en modo: ${mode}`);
