import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const validator = path.join(root, 'scripts', 'validate.mjs');
const examplePath = path.join(root, 'examples', 'v0.1', 'complete-export.example.json');
const validDocument = JSON.parse(await fs.readFile(examplePath, 'utf8'));
const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'open-condo-tests-'));

const clone = (value) => structuredClone(value);

const cases = [
  {
    name: 'accepts the official complete export',
    document: validDocument,
    valid: true
  },
  {
    name: 'rejects a structurally incomplete export',
    document: (() => {
      const value = clone(validDocument);
      delete value.open_condo;
      return value;
    })(),
    valid: false
  },
  {
    name: 'rejects duplicate entity identifiers',
    document: (() => {
      const value = clone(validDocument);
      value.units.push(clone(value.units[0]));
      return value;
    })(),
    valid: false,
    outputIncludes: 'id duplicado'
  },
  {
    name: 'rejects references to a missing person',
    document: (() => {
      const value = clone(validDocument);
      value.occupancies[0].person_id = 'person_missing';
      return value;
    })(),
    valid: false,
    outputIncludes: 'person_id inexistente'
  },
  {
    name: 'rejects references to a missing charge',
    document: (() => {
      const value = clone(validDocument);
      value.payments[0].allocations[0].charge_id = 'charge_missing';
      return value;
    })(),
    valid: false,
    outputIncludes: 'charge_id charge_missing inexistente'
  },
  {
    name: 'rejects allocations that exceed the payment amount',
    document: (() => {
      const value = clone(validDocument);
      value.payments[0].allocations[0].amount.value = 2500.01;
      return value;
    })(),
    valid: false,
    outputIncludes: 'aplicaciones exceden el pago'
  },
  {
    name: 'rejects inconsistent allocation currencies',
    document: (() => {
      const value = clone(validDocument);
      value.payments[0].allocations[0].amount.currency = 'USD';
      return value;
    })(),
    valid: false,
    outputIncludes: 'moneda inconsistente'
  },
  {
    name: 'rejects invalid date ranges',
    document: (() => {
      const value = clone(validDocument);
      value.occupancies[0].valid_until = '2025-12-31';
      return value;
    })(),
    valid: false,
    outputIncludes: 'rango de vigencia inválido'
  }
];

let failures = 0;

try {
  for (const [index, testCase] of cases.entries()) {
    const file = path.join(tempDir, `${index}.json`);
    await fs.writeFile(file, JSON.stringify(testCase.document, null, 2));

    const result = spawnSync(process.execPath, [validator, file], {
      cwd: root,
      encoding: 'utf8'
    });

    const output = `${result.stdout}\n${result.stderr}`;
    const succeeded = result.status === 0;

    try {
      assert.equal(succeeded, testCase.valid);
      if (testCase.outputIncludes) assert.match(output, new RegExp(testCase.outputIncludes));
      console.log(`✓ ${testCase.name}`);
    } catch (error) {
      failures += 1;
      console.error(`✗ ${testCase.name}`);
      console.error(output.trim());
      console.error(error.message);
    }
  }
} finally {
  await fs.rm(tempDir, { recursive: true, force: true });
}

if (failures > 0) {
  console.error(`\n${failures} conformance test(s) failed.`);
  process.exit(1);
}

console.log(`\n${cases.length} conformance tests passed.`);
