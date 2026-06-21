const fs = require('fs');
const path = require('path');

function traverseDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else {
            if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
                convertFile(fullPath);
            }
        }
    });
}

function convertFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // 1. Remove interfaces
    content = content.replace(/interface\s+\w+\s*\{[^}]*\}/g, '');

    // 2. Remove type declarations
    content = content.replace(/type\s+\w+\s*=[^;]+;/g, '');

    // 3. Remove React.FC<...>, React.ReactNode, React.FormEvent, User etc.
    content = content.replace(/:\s*React\.ReactNode/g, '');
    content = content.replace(/:\s*React\.FormEvent/g, '');
    content = content.replace(/:\s*User\s*\|\s*null/g, '');
    content = content.replace(/:\s*string\s*\|\s*null/g, '');
    content = content.replace(/:\s*any/g, '');
    content = content.replace(/:\s*boolean/g, '');
    
    // 4. Remove generics <T>
    content = content.replace(/<User \| null>/g, '');
    content = content.replace(/<string \| null>/g, '');
    content = content.replace(/<AuthContextType>/g, '');
    
    // 5. Remove "as Type"
    content = content.replace(/\s+as\s+\w+/g, '');

    // Write to new file
    const newExt = filePath.endsWith('.tsx') ? '.jsx' : '.js';
    const newPath = filePath.replace(/\.tsx?$/, newExt);
    fs.writeFileSync(newPath, content, 'utf-8');
    console.log(`Converted ${filePath} to ${newPath}`);

    // Delete old file
    fs.unlinkSync(filePath);
}

traverseDir(path.join(process.cwd(), 'src'));
