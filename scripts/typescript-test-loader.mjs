import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";
import { resolve as resolvePath } from "node:path";
import ts from "typescript";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const base = resolvePath(process.cwd(), specifier.slice(2));
    for (const extension of [".ts", ".tsx"]) {
      if (existsSync(`${base}${extension}`)) {
        return {
          url: pathToFileURL(`${base}${extension}`).href,
          shortCircuit: true,
        };
      }
    }
  }
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (
      !context.parentURL ||
      (!specifier.startsWith(".") && !specifier.startsWith("/"))
    ) {
      throw error;
    }
    for (const extension of [".ts", ".tsx"]) {
      const candidate = new URL(
        `${specifier}${extension}`,
        context.parentURL,
      );
      if (existsSync(fileURLToPath(candidate))) {
        return {
          url: candidate.href,
          shortCircuit: true,
        };
      }
    }
    const directoryIndex = new URL(
      `${specifier.replace(/\/$/, "")}/index.ts`,
      context.parentURL,
    );
    if (existsSync(fileURLToPath(directoryIndex))) {
      return {
        url: directoryIndex.href,
        shortCircuit: true,
      };
    }
    throw error;
  }
}

export async function load(url, context, nextLoad) {
  if (!url.endsWith(".ts") && !url.endsWith(".tsx")) {
    return nextLoad(url, context);
  }
  const source = await readFile(fileURLToPath(url), "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      verbatimModuleSyntax: true,
    },
    fileName: fileURLToPath(url),
  });
  return {
    format: "module",
    source: transpiled.outputText,
    shortCircuit: true,
  };
}
