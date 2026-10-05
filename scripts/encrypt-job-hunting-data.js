// Usage: JOB_HUNTING_DATA_KEY=<64 hex characters> node scripts/encrypt-job-hunting-data.js <V2 bundle directory>
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const key = process.env.JOB_HUNTING_DATA_KEY;
const source = process.argv[2];
if (!/^[a-f0-9]{64}$/i.test(key || '') || !source) {
  console.error('Provide JOB_HUNTING_DATA_KEY (64 hex characters) and the V2 bundle directory.');
  process.exit(1);
}

const companies = JSON.parse(fs.readFileSync(path.join(source, 'vales_job_hunting_companies_v2.json')));
const accelerators = JSON.parse(fs.readFileSync(path.join(source, 'vales_job_hunting_accelerators_v2.json')));
if (companies.companies.length !== 500 || accelerators.length !== 84 ||
    new Set(companies.companies.map(x => x.id)).size !== 500 ||
    JSON.stringify(companies.accelerator_directory) !== JSON.stringify(accelerators)) {
  throw new Error('V2 inputs failed the canonical dataset checks.');
}

const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
const compressed = zlib.gzipSync(JSON.stringify({companies: companies.companies, accelerators}));
const ciphertext = Buffer.concat([cipher.update(compressed), cipher.final()]);
fs.writeFileSync(path.join(__dirname, '../private/job-hunting-data.enc'), Buffer.concat([iv, ciphertext, cipher.getAuthTag()]));
console.log('Encrypted 500 organisations and 84 programmes.');
