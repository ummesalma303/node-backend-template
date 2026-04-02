#!/usr/bin/env node

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Questions
const questions = [
  {
    type: "input",
    name: "projectName",
    message: "Enter your project name:",
    default: "my-app",
    validate: (input) =>
      /^[a-z0-9-_]+$/.test(input) ||
      "Project name must be lowercase and URL friendly",
  },
  {
    type: "list",
    name: "language",
    message: "Select your project language:",
    choices: [
      { name: "TypeScript", value: "ts" },
      { name: "JavaScript", value: "js" },
    ],
    default: "ts",
  },
  {
    type: "list",
    name: "packageManager",
    message: "Select a package manager:",
    choices: ["npm", "yarn", "pnpm"],
    default: "npm",
  },
];

async function init() {
  const { projectName, language, packageManager } =
    await inquirer.prompt(questions);

  const targetPath = path.join(process.cwd(), projectName);

  // template dynamic path 🔥
  const templatePath = path.resolve(__dirname, `../templates/${language}`);

  if (fs.existsSync(targetPath)) {
    console.log("❌ Folder already exists!");
    process.exit(1);
  }

  console.log(`\n📁 Creating ${language.toUpperCase()} project "${projectName}"...\n`);

  try {
    // create folder
    fs.mkdirSync(targetPath, { recursive: true });

    // copy template
    fs.cpSync(templatePath, targetPath, {
      recursive: true,
      filter: (src) => {
        const baseName = path.basename(src);
        return !["node_modules", "dist", "logs", ".git"].includes(baseName);
      },
    });

    // rename gitignore
    const oldGit = path.join(targetPath, "gitignore.template");
    if (fs.existsSync(oldGit)) {
      fs.renameSync(oldGit, path.join(targetPath, ".gitignore"));
    }

    // update package.json
    const pkgPath = path.join(targetPath, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      pkg.name = projectName;
      delete pkg.packageManager;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }

    // env setup
    const envExample = path.join(targetPath, ".env.example");
    if (fs.existsSync(envExample)) {
      fs.copyFileSync(envExample, path.join(targetPath, ".env"));
    }

    console.log("✅ Template files copied successfully.\n");

    // commands
    let installCmd = "";
    let devCmd = "";

    if (packageManager === "npm") {
      installCmd = "npm install";
      devCmd = "npm run dev";
    } else if (packageManager === "yarn") {
      installCmd = "yarn";
      devCmd = "yarn dev";
    } else {
      installCmd = "pnpm install";
      devCmd = "pnpm dev";
    }

    // 🎉 Final output
    console.log("\n🚀 Project created successfully!");
    console.log("=====================================");
    console.log(`📦 Stack: ${language.toUpperCase()}`);
    console.log(`📦 Package Manager: ${packageManager}\n`);

    console.log("👉 Next steps:\n");

    console.log(`1. cd ${projectName}`);
    console.log(`2. ${installCmd}`);
    console.log(`3. ${devCmd}\n`);


  } catch (err) {
    console.error("\n❌ Error creating project:");
    console.error(err.message);
    process.exit(1);
  }
}

init();