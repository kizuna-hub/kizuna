import { spawnSync } from "node:child_process";
import { rmSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const testSources = [
  "features/venture/decision-loop/domain/validation.test.ts",
  "features/venture/decision-loop/application/__tests__/source-and-baseline.test.ts",
  "features/venture/decision-loop/application/__tests__/challenge.test.ts",
  "features/venture/decision-loop/application/__tests__/decision.test.ts",
  "features/venture/decision-loop/application/__tests__/cycle.test.ts",
  "features/venture/decision-loop/infrastructure/mock/mock-decision-loop-repository.test.ts",
  "features/venture/decision-loop/integration/decision-loop-characterization.test.ts",
  "features/venture/decision-loop/integration/decision-loop.integration.test.ts",
  "features/venture/decision-loop/integration/call-to-cash.integration.test.ts",
  "features/founder/venture-foundation/demo-repository.test.ts",
  "features/founder/home/lib/home-view-model.test.ts",
  "features/founder/projects/next-action-label.test.ts",
  "features/founder/projects/project-portfolio.test.ts",
  "features/founder/entry/tests/adaptive-entry-resolver.test.ts",
  "features/founder/entry/tests/deep-link-resolver.test.ts",
  "features/founder/entry/tests/venture-setup-state.test.ts",
  "features/founder/ai-workspace/tests/mock-ai-engine.test.ts",
  "features/founder/ai-workspace/tests/ai-workspace-reducer.test.ts",
  "features/founder/ai-workspace/tests/onboarding-case-study.test.ts",
  "features/founder/ai-workspace/tests/sidebar-persistence.test.ts",
  "features/founder/ai-workspace/tests/long-run-workspace.test.ts",
  "features/founder/ai-workspace/tests/venture-search-and-context.test.ts",
];

const outputDirectory = mkdtempSync(
  join(tmpdir(), "kizuna-decision-loop-"),
);
const tscPath = resolve("node_modules/typescript/bin/tsc");

try {
  const compilation = spawnSync(
    process.execPath,
    [
      tscPath,
      "--target",
      "ES2020",
      "--module",
      "commonjs",
      "--moduleResolution",
      "node",
      "--esModuleInterop",
      "--skipLibCheck",
      "--jsx",
      "react-jsx",
      "--outDir",
      outputDirectory,
      ...testSources,
    ],
    { stdio: "inherit" },
  );

  if (compilation.status !== 0) {
    process.exitCode = compilation.status ?? 1;
  } else {
    const compiledTests = testSources.map((source) =>
      join(
        outputDirectory,
        source
          .replace(/^features\//, "")
          .replace(/\.ts$/, ".js"),
      ).replaceAll("\\", "/"),
    );
    const testEntry = join(outputDirectory, "decision-loop-tests.cjs");
    writeFileSync(
      testEntry,
      compiledTests
        .map((testPath) => `require(${JSON.stringify(testPath)});`)
        .join("\n"),
      "utf8",
    );
    const execution = spawnSync(
      process.execPath,
      ["--test", testEntry],
      { stdio: "inherit" },
    );
    process.exitCode = execution.status ?? 1;
  }
} finally {
  rmSync(outputDirectory, { recursive: true, force: true });
}
