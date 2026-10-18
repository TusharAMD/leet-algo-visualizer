const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'pages', 'problems');
const files = fs.readdirSync(dir);

const oldTarget = 'className="flex-1 min-h-0 flex flex-col p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-hidden"';
const newTarget = 'className="flex-1 min-h-0 flex flex-col p-2 sm:p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-y-auto lg:overflow-hidden problem-container-responsive"';

let updatedCount = 0;
for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(oldTarget)) {
    content = content.replace(oldTarget, newTarget);
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
  }
}

console.log('Successfully updated', updatedCount, 'problem files with mobile-responsive container classes.');
