/**
 * Runs the whole Jest suite and stores evidence for the test report:
 *   tests/evidence/test-output.txt      full console output (verbose)
 *   tests/evidence/jest-results.json    machine-readable results
 *   tests/evidence/coverage-summary.json
 *   tests/evidence/actuals.ndjson       actual result of every test case
 *   tests/evidence/meta.json            date, Node version, DB used
 *
 * Usage:  npm run test:evidence
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const root = path.join(__dirname, "..");
const ev = path.join(__dirname, "evidence");
fs.rmSync(ev, { recursive: true, force: true });
fs.mkdirSync(ev, { recursive: true });

const jestBin = require.resolve("jest/bin/jest");
const r = spawnSync(
  process.execPath,
  [jestBin, "--runInBand", "--verbose", "--silent", "--coverage",
   "--json", `--outputFile=${path.join(ev, "jest-results.json")}`],
  { cwd: root, encoding: "utf8", env: process.env }
);

const out = (r.stdout || "") + (r.stderr || "");
fs.writeFileSync(path.join(ev, "test-output.txt"), out);
process.stdout.write(out);

const cov = path.join(root, "coverage", "coverage-summary.json");
if (fs.existsSync(cov)) fs.copyFileSync(cov, path.join(ev, "coverage-summary.json"));

fs.writeFileSync(
  path.join(ev, "meta.json"),
  JSON.stringify(
    {
      runAt: new Date().toISOString(),
      node: process.version,
      platform: `${os.type()} ${os.release()} (${os.arch()})`,
      database: process.env.TEST_DB_LABEL ||
        (process.env.MONGO_URI_TEST ? "External MongoDB (MONGO_URI_TEST)" : "mongodb-memory-server (in-memory MongoDB)"),
      command: "npm run test:evidence",
    },
    null, 2
  )
);
process.exit(r.status === null ? 1 : r.status);
