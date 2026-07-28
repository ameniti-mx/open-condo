import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = process.cwd();
const schemaDir = path.join(root, 'schemas', 'v0.1');
const target = process.argv[2];

if (!target) {
  console.error('Uso: npm run validate -- ruta/al/archivo.json');
  process.exit(2);
}

const schemaFiles = [
  'common.schema.json',
  'condominium.schema.json',
  'unit.schema.json',
  'person.schema.json',
  'occupancy.schema.json',
  'charge.schema.json',
  'payment.schema.json',
  'export.schema.json'
];

const schemas = [];
for (const file of schemaFiles) {
  const raw = await fs.readFile(path.join(schemaDir, file), 'utf8');
  schemas.push(JSON.parse(raw));
}

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
for (const schema of schemas) ajv.addSchema(schema);

const documentPath = path.resolve(root, target);
const document = JSON.parse(await fs.readFile(documentPath, 'utf8'));
const validate = ajv.getSchema('https://open-condo.org/schemas/v0.1/export.schema.json');

if (!validate) throw new Error('No fue posible cargar export.schema.json');

const structuralValid = validate(document);
const semanticErrors = [];

if (structuralValid) {
  const condominiumId = document.condominium.id;
  const unitIds = new Set(document.units.map((item) => item.id));
  const personIds = new Set(document.people.map((item) => item.id));
  const chargeById = new Map(document.charges.map((item) => [item.id, item]));

  const assertUnique = (items, collection) => {
    const seen = new Set();
    for (const item of items) {
      if (seen.has(item.id)) semanticErrors.push(`${collection}: id duplicado ${item.id}`);
      seen.add(item.id);
    }
  };

  assertUnique(document.units, 'units');
  assertUnique(document.people, 'people');
  assertUnique(document.occupancies, 'occupancies');
  assertUnique(document.charges, 'charges');
  assertUnique(document.payments, 'payments');

  for (const unit of document.units) {
    if (unit.condominium_id !== condominiumId) semanticErrors.push(`unit ${unit.id}: condominium_id inválido`);
    if (unit.updated_at < unit.created_at) semanticErrors.push(`unit ${unit.id}: updated_at anterior a created_at`);
    if (unit.indiviso?.unit === 'fraction' && unit.indiviso.value > 1) semanticErrors.push(`unit ${unit.id}: indiviso fraction debe ser <= 1`);
    if (unit.indiviso?.unit === 'percentage' && unit.indiviso.value > 100) semanticErrors.push(`unit ${unit.id}: indiviso percentage debe ser <= 100`);
  }

  for (const occupancy of document.occupancies) {
    if (occupancy.condominium_id !== condominiumId) semanticErrors.push(`occupancy ${occupancy.id}: condominium_id inválido`);
    if (!unitIds.has(occupancy.unit_id)) semanticErrors.push(`occupancy ${occupancy.id}: unit_id inexistente`);
    if (!personIds.has(occupancy.person_id)) semanticErrors.push(`occupancy ${occupancy.id}: person_id inexistente`);
    if (occupancy.valid_until && occupancy.valid_until < occupancy.valid_from) semanticErrors.push(`occupancy ${occupancy.id}: rango de vigencia inválido`);
  }

  for (const charge of document.charges) {
    if (charge.condominium_id !== condominiumId) semanticErrors.push(`charge ${charge.id}: condominium_id inválido`);
    if (!unitIds.has(charge.unit_id)) semanticErrors.push(`charge ${charge.id}: unit_id inexistente`);
    if (charge.period && charge.period.end < charge.period.start) semanticErrors.push(`charge ${charge.id}: periodo inválido`);
  }

  for (const payment of document.payments) {
    if (payment.condominium_id !== condominiumId) semanticErrors.push(`payment ${payment.id}: condominium_id inválido`);
    if (!unitIds.has(payment.unit_id)) semanticErrors.push(`payment ${payment.id}: unit_id inexistente`);
    let allocated = 0;
    for (const allocation of payment.allocations) {
      const charge = chargeById.get(allocation.charge_id);
      if (!charge) semanticErrors.push(`payment ${payment.id}: charge_id ${allocation.charge_id} inexistente`);
      if (allocation.amount.currency !== payment.amount.currency) semanticErrors.push(`payment ${payment.id}: moneda inconsistente en allocation`);
      if (charge && charge.unit_id !== payment.unit_id) semanticErrors.push(`payment ${payment.id}: allocation pertenece a otra unidad`);
      allocated += allocation.amount.value;
    }
    if (allocated > payment.amount.value + 0.000001) semanticErrors.push(`payment ${payment.id}: aplicaciones exceden el pago`);
  }
}

if (!structuralValid || semanticErrors.length) {
  console.error('Documento inválido.');
  if (validate.errors) console.error(JSON.stringify(validate.errors, null, 2));
  for (const error of semanticErrors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Documento válido conforme a Open Condo 0.1: ${target}`);
