const { execSync } = require('child_process');
const path = require('path');

const zipPath = path.join(__dirname, '..', 'NexusSync_Final_Package.zip');
const extractPath = path.join(__dirname, '..');

try {
  // Extract the ZIP file
  execSync(`unzip -o "${zipPath}" -d "${extractPath}"`, { stdio: 'inherit' });
  console.log('Successfully extracted NexusSync_Final_Package.zip');
  
  // List the extracted contents
  const result = execSync(`ls -la "${extractPath}"`, { encoding: 'utf-8' });
  console.log('\nExtracted contents:');
  console.log(result);
} catch (error) {
  console.error('Error extracting ZIP:', error.message);
}
