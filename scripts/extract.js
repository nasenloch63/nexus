const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/nasenloch63/nexus/main/NexusSync_Final_Package.zip';

// Download file helper
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }
    }).on('error', reject);
  });
}

// Read all files recursively
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', '__pycache__', '__manus__'].includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (!['.pdf', '.zip', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.gitkeep', '.lock'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

async function main() {
  const tempDir = '/tmp/nexus_extract';
  const zipPath = '/tmp/nexus.zip';
  
  // Clean up and create temp dir
  execSync(`rm -rf ${tempDir} && mkdir -p ${tempDir}`);
  
  console.log('Downloading ZIP from GitHub...');
  await downloadFile(GITHUB_RAW_URL, zipPath);
  console.log('Download complete!');
  
  // Extract
  console.log('Extracting ZIP...');
  execSync(`unzip -o "${zipPath}" -d "${tempDir}"`, { stdio: 'pipe' });
  console.log('Extraction complete!\n');
  
  // Read all files
  const allFiles = getAllFiles(tempDir);
  console.log(`Found ${allFiles.length} files\n`);
  
  // Output each file with its content
  for (const filePath of allFiles) {
    const relativePath = path.relative(tempDir, filePath);
    console.log(`\n========== FILE: ${relativePath} ==========`);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      console.log(content);
    } catch (e) {
      console.log(`[Error reading file: ${e.message}]`);
    }
  }
  
  console.log('\n\n========== END OF FILES ==========');
  console.log(`Total files: ${allFiles.length}`);
}

main().catch(console.error);
