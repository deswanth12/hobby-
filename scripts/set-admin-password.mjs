import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const DB_PATH = path.join(ROOT, 'data', 'practice_db.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(promptText) {
  return new Promise(resolve => rl.question(promptText, resolve));
}

async function main() {
  console.log('================================================================');
  console.log('  KAVITHA & ASSOCIATES — SECURE PRACTICE ADMIN CREDENTIAL TOOL  ');
  console.log('================================================================\n');

  if (!fs.existsSync(DB_PATH)) {
    console.error('Database file not found at:', DB_PATH);
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const usernameArg = process.argv[2];

  let username = usernameArg;
  if (!username) {
    username = await question('Select account to configure ("kavitha" or "admin"): ');
  }
  username = username.trim().toLowerCase();

  if (username !== 'kavitha' && username !== 'admin') {
    console.error('Invalid user. Only "kavitha" (Managing Partner) and "admin" (Practice Admin) are permitted.');
    rl.close();
    process.exit(1);
  }

  const newPassword = await question(`Enter new replacement password for [${username}] (min 12 chars, mixed case, number, symbol): `);
  const cleanPass = newPassword.trim();

  if (cleanPass.length < 12) {
    console.error('Password rejected: Must be at least 12 characters.');
    rl.close();
    process.exit(1);
  }

  const hasUpper = /[A-Z]/.test(cleanPass);
  const hasLower = /[a-z]/.test(cleanPass);
  const hasNumber = /[0-9]/.test(cleanPass);
  const hasSpecial = /[^A-Za-z0-9]/.test(cleanPass);

  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    console.error('Password rejected: Must contain uppercase, lowercase, number, and special character.');
    rl.close();
    process.exit(1);
  }

  // Unique cryptographic per-user salt and 100,000-iteration PBKDF2-HMAC-SHA512
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const passwordHash = crypto.pbkdf2Sync(cleanPass, salt, iterations, 64, 'sha512').toString('hex');

  db.userCredentials = db.userCredentials || {};
  db.userCredentials[username] = {
    salt,
    passwordHash,
    iterations,
    algorithm: 'pbkdf2-sha512',
    updatedAt: new Date().toISOString()
  };

  // Revoke all existing sessions and tokens for this user
  db.userRevocationEpochs = db.userRevocationEpochs || {};
  db.userRevocationEpochs[username] = Math.floor(Date.now() / 1000) + 1;
  db.sessions = {};

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');

  console.log('\n[SUCCESS] Password securely hashed and recorded in persistent database.');
  console.log(`[SUCCESS] All existing sessions and tokens for [${username}] have been revoked.`);
  console.log('[NOTE] Do NOT commit passwords or output them into shared channels.\n');

  rl.close();
}

main().catch(err => {
  console.error('Unexpected error:', err);
  rl.close();
  process.exit(1);
});
