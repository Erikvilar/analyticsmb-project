import fs from "node:fs";
import path from "node:path";

const type = process.argv[2];
const name = process.argv[3];

if (!type || !name) {
    console.log("Uso:");
    console.log("node generate.js <type> <name>");
    process.exit(1);
}

function pascalCase(value) {
    return value
        .replace(/[-_]/g, " ")
        .split(" ")
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
}

const templates = {
    
    hook: {
        folder: "src/hooks",
        files(name) {
            return {
                [`${name}.ts`]: `const ${name} = () => {
    return {};
};

export default ${name};
`
            };
        }
    },
    
    service: {
        folder: "src/service",
        files(name) {
            return {
                [`${name}.service.ts`]: `class ${name}Service {

}

export default new ${name}Service();
`
            };
        }
    },
    
    parser: {
        folder: "src/parsers",
        files(name) {
            return {
                [`${name}.parser.ts`]: `export interface ${name}Result {

}

export function parse${name}(raw: string): ${name}Result {
    return {};
}
`
            };
        }
    },
    
    component: {
        folder(name) {
            return `src/components/${pascalCase(name)}`;
        },
        
        files(name) {
            const component = pascalCase(name);
            
            return {
                [`${component}.tsx`]: `import "./${component}.css";

export default function ${component}() {
    return (
        <div className="${name.toLowerCase()}">

        </div>
    );
}
`,
                [`${component}.css`]: `.${name.toLowerCase()} {

}
`
            };
        }
    },
    
    page: {
        folder(name) {
            return `src/pages/${pascalCase(name)}`;
        },
        
        files(name) {
            const page = pascalCase(name);
            
            return {
                [`${page}.tsx`]: `import "./${page}.css";

export default function ${page}() {
    return (
        <>

        </>
    );
}
`,
                [`${page}.css`]: `.${name.toLowerCase()} {

}
`
            };
        }
    }
    
};

const template = templates[type];

if (!template) {
    console.error(`Template '${type}' não encontrado.`);
    process.exit(1);
}

const folder =
    typeof template.folder === "function"
        ? template.folder(name)
        : template.folder;

fs.mkdirSync(folder, { recursive: true });

const files = template.files(name);

for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(folder, filename);
    
    if (fs.existsSync(filePath)) {
        console.log(`⚠ Arquivo já existe: ${filePath}`);
        continue;
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✔ Criado: ${filePath}`);
}