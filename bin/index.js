#!/usr/bin/env node

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Resolve template path
const templatePath = path.resolve(__dirname, "../templates");

// Questions
const questions = [
  {
    type: "input",
    name: "projectName",
    message: "Enter your project name:",
    default: "my-app",
    validate: (input) => /^[a-z0-9-_]+$/.test(input) || "Project name must be lowercase and URL friendly",
  },
];

async function init() {
  const { projectName } = await inquirer.prompt(questions);
  const targetPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(targetPath)) {
    console.log("❌ Folder already exists!");
    process.exit(1);
  }

  console.log(`\n📁 Creating project "${projectName}"...`);

  try {
    // 1. Create directory
    fs.mkdirSync(targetPath, { recursive: true });

    // 2. Copy Template (Improved filter)
    fs.cpSync(templatePath, targetPath, {
      recursive: true,
      filter: (src) => {
        const baseName = path.basename(src);
        // node_modules copy korar dorkar nai jodi template-e theke thake
        return !["node_modules", "dist", "logs", ".git"].includes(baseName);
      },
    });

    // 3. Rename gitignore.template to .gitignore
    const oldGit = path.join(targetPath, "gitignore.template");
    if (fs.existsSync(oldGit)) {
      fs.renameSync(oldGit, path.join(targetPath, ".gitignore"));
    }

    // 4. Update package.json name
    const pkgPath = path.join(targetPath, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      pkg.name = projectName;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }

    // 5. .env setup
    const envExample = path.join(targetPath, ".env.example");
    if (fs.existsSync(envExample)) {
      fs.copyFileSync(envExample, path.join(targetPath, ".env"));
    }

    console.log("✅ Template files copied successfully.");

    // 6. Detect Package Manager for instructions
    const agent = process.env.npm_config_user_agent || "";
    const pkgManager = agent.includes("pnpm") ? "pnpm" : agent.includes("yarn") ? "yarn" : "npm";

    // 🚀 Success Message with Instructions
    console.log("\n🚀 Project created! Now follow these steps:");
    console.log("-------------------------------------------");
    console.log(`  1. cd ${projectName}`);
    console.log(`  2. ${pkgManager} install`);
    console.log(`  3. ${pkgManager} run dev`);
    console.log("-------------------------------------------\n");

  } catch (err) {
    console.error("\n❌ Something went wrong during project creation:");
    console.error(err.message);
    process.exit(1);
  }
}

init();