#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as p from "@clack/prompts";
import pc from "picocolors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function init() {
  console.clear();
  
  p.intro(`${pc.bgCyan(pc.black(" node-backend-template "))}`);

  const project = await p.group(
    {
      projectName: () =>
        p.text({
          message: "Enter your project name:",
          placeholder: "my-app",
          validate: (value) => {
            if (!value) return "Project name is required";
            if (!/^[a-z0-9-_]+$/.test(value))
              return "Project name must be lowercase and URL friendly";
          },
        }),
      language: () =>
        p.select({
          message: "Select your project language:",
          options: [
            { value: "ts", label: "TypeScript", hint: "Recommended" },
            { value: "js", label: "JavaScript" },
          ],
        }),
      packageManager: () =>
        p.select({
          message: "Select a package manager:",
          options: [
            { value: "pnpm", label: "pnpm", hint: "Fastest" },
            { value: "npm", label: "npm" },
            { value: "yarn", label: "yarn" },
          ],
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operation cancelled.");
        process.exit(0);
      },
    }
  );

  const { projectName, language, packageManager } = project;
  const targetPath = path.join(process.cwd(), projectName);
  const templatePath = path.resolve(__dirname, `../templates/${language}`);

  if (fs.existsSync(targetPath)) {
    p.log.error(pc.red("❌ Folder already exists!"));
    process.exit(1);
  }

  const s = p.spinner();
  s.start(`Creating ${language.toUpperCase()} project "${projectName}"...`);

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
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }

    // env setup
    const envExample = path.join(targetPath, ".env.example");
    if (fs.existsSync(envExample)) {
      fs.copyFileSync(envExample, path.join(targetPath, ".env"));
    }

    s.stop(pc.green("✅ Template files copied successfully."));

    // commands logic
    const commands = {
      npm: { install: "npm install", dev: "npm run dev" },
      yarn: { install: "yarn", dev: "yarn dev" },
      pnpm: { install: "pnpm install", dev: "pnpm dev" },
    };

    const nextSteps = `cd ${projectName}\n${commands[packageManager].install}\n${commands[packageManager].dev}`;

    p.note(nextSteps, "Next steps:");
    
    p.outro(pc.cyan(`Done! Built with by Umme Salma`));

  } catch (err) {
    s.stop(pc.red("❌ Error creating project"));
    p.log.error(err.message);
    process.exit(1);
  }
}

init();