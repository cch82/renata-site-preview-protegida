/**
 * Gera hash SHA-256 de uma senha para colar em js/preview-gate.js
 * Uso: node scripts/generate-password-hash.mjs "MinhaSenhaSecreta"
 */
import crypto from 'node:crypto';

const password = process.argv[2];
if (!password) {
  console.error('Uso: node scripts/generate-password-hash.mjs "sua-senha"');
  process.exit(1);
}

const hash = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
console.log('Senha:', password);
console.log('Hash: ', hash);
console.log('\nCole em CONFIG.passwordHash em js/preview-gate.js');
