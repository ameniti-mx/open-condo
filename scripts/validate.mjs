import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = process.cwd();
const target = process.argv[2];
if (!target) {
  console.error('Uso: npm run validate -- ruta/al/archivo.json');
  process.exit(2);
}

async function collectSchemas(directory) {
  const output = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await collectSchemas(full));
    else if (entry.name.endsWith('.schema.json')) output.push(JSON.parse(await fs.readFile(full, 'utf8')));
  }
  return output;
}

const documentPath = path.resolve(root, target);
const document = JSON.parse(await fs.readFile(documentPath, 'utf8'));
const version = document?.open_condo?.schema_version;
if (!['0.1.0', '0.2.0'].includes(version)) {
  console.error(`Versión no soportada: ${version ?? 'no declarada'}`);
  process.exit(1);
}

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
for (const schema of await collectSchemas(path.join(root, 'schemas'))) ajv.addSchema(schema);

const schemaSeries = version.startsWith('0.2') ? 'v0.2' : 'v0.1';
const validate = ajv.getSchema(`https://open-condo.org/schemas/${schemaSeries}/export.schema.json`);
if (!validate) throw new Error(`No fue posible cargar export.schema.json para ${version}`);

const structuralValid = validate(document);
const errors = [];
const add = (code, message, entity, entityId) => errors.push({ code, message, entity, entity_id: entityId });
const unique = (items = [], collection) => {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) add('DUPLICATE_IDENTIFIER', `${collection}: id duplicado ${item.id}`, collection, item.id);
    seen.add(item.id);
  }
};

if (structuralValid) {
  const condominiumId = document.condominium.id;
  const unitIds = new Set(document.units.map(x => x.id));
  const personIds = new Set(document.people.map(x => x.id));
  const chargeById = new Map(document.charges.map(x => [x.id, x]));

  for (const name of ['units','people','occupancies','charges','payments','amenities','rule_sets','reservations','reservation_charges']) unique(document[name], name);

  for (const unit of document.units) {
    if (unit.condominium_id !== condominiumId) add('CONDOMINIUM_MISMATCH', `unit ${unit.id}: condominium_id inválido`, 'unit', unit.id);
    if (unit.updated_at < unit.created_at) add('INVALID_DATE_RANGE', `unit ${unit.id}: updated_at anterior a created_at`, 'unit', unit.id);
    if (unit.indiviso?.unit === 'fraction' && unit.indiviso.value > 1) add('INVALID_INDIVISO', `unit ${unit.id}: indiviso fraction debe ser <= 1`, 'unit', unit.id);
    if (unit.indiviso?.unit === 'percentage' && unit.indiviso.value > 100) add('INVALID_INDIVISO', `unit ${unit.id}: indiviso percentage debe ser <= 100`, 'unit', unit.id);
  }

  for (const occupancy of document.occupancies) {
    if (!unitIds.has(occupancy.unit_id)) add('REFERENCE_NOT_FOUND', `occupancy ${occupancy.id}: unit_id inexistente`, 'occupancy', occupancy.id);
    if (!personIds.has(occupancy.person_id)) add('REFERENCE_NOT_FOUND', `occupancy ${occupancy.id}: person_id inexistente`, 'occupancy', occupancy.id);
    if (occupancy.valid_until && occupancy.valid_until < occupancy.valid_from) add('INVALID_DATE_RANGE', `occupancy ${occupancy.id}: rango de vigencia inválido`, 'occupancy', occupancy.id);
  }

  for (const payment of document.payments) {
    let allocated = 0;
    for (const allocation of payment.allocations) {
      const charge = chargeById.get(allocation.charge_id);
      if (!charge) add('REFERENCE_NOT_FOUND', `payment ${payment.id}: charge_id ${allocation.charge_id} inexistente`, 'payment', payment.id);
      if (allocation.amount.currency !== payment.amount.currency) add('CURRENCY_MISMATCH', `payment ${payment.id}: moneda inconsistente en allocation`, 'payment', payment.id);
      if (charge && charge.unit_id !== payment.unit_id) add('UNIT_MISMATCH', `payment ${payment.id}: allocation pertenece a otra unidad`, 'payment', payment.id);
      allocated += allocation.amount.value;
    }
    if (allocated > payment.amount.value + 0.000001) add('PAYMENT_OVERALLOCATED', `payment ${payment.id}: aplicaciones exceden el pago`, 'payment', payment.id);
  }

  if (version === '0.2.0') {
    const amenityById = new Map(document.amenities.map(x => [x.id, x]));
    const ruleSetById = new Map(document.rule_sets.map(x => [x.id, x]));
    const reservationById = new Map(document.reservations.map(x => [x.id, x]));

    for (const amenity of document.amenities) {
      if (amenity.condominium_id !== condominiumId) add('CONDOMINIUM_MISMATCH', `amenity ${amenity.id}: condominium_id inválido`, 'amenity', amenity.id);
      for (const ruleSetId of amenity.rule_set_ids ?? []) if (!ruleSetById.has(ruleSetId)) add('REFERENCE_NOT_FOUND', `amenity ${amenity.id}: rule_set_id ${ruleSetId} inexistente`, 'amenity', amenity.id);
    }

    for (const ruleSet of document.rule_sets) {
      if (ruleSet.condominium_id !== condominiumId) add('CONDOMINIUM_MISMATCH', `rule_set ${ruleSet.id}: condominium_id inválido`, 'rule_set', ruleSet.id);
      if (ruleSet.effective_until && ruleSet.effective_until < ruleSet.effective_from) add('INVALID_DATE_RANGE', `rule_set ${ruleSet.id}: vigencia inválida`, 'rule_set', ruleSet.id);
      unique(ruleSet.rules, `rule_set:${ruleSet.id}:rules`);
    }

    for (const reservation of document.reservations) {
      const amenity = amenityById.get(reservation.amenity_id);
      if (!amenity) add('REFERENCE_NOT_FOUND', `reservation ${reservation.id}: amenity_id inexistente`, 'reservation', reservation.id);
      if (!unitIds.has(reservation.unit_id)) add('REFERENCE_NOT_FOUND', `reservation ${reservation.id}: unit_id inexistente`, 'reservation', reservation.id);
      if (!personIds.has(reservation.requested_by_person_id)) add('REFERENCE_NOT_FOUND', `reservation ${reservation.id}: requested_by_person_id inexistente`, 'reservation', reservation.id);
      if (reservation.ends_at <= reservation.starts_at) add('INVALID_DATE_RANGE', `reservation ${reservation.id}: ends_at debe ser posterior a starts_at`, 'reservation', reservation.id);
      if (amenity?.capacity && reservation.party_size > amenity.capacity) add('CAPACITY_EXCEEDED', `reservation ${reservation.id}: party_size excede la capacidad`, 'reservation', reservation.id);
      for (const ruleSetId of reservation.rule_evaluation.rule_set_ids) if (!ruleSetById.has(ruleSetId)) add('REFERENCE_NOT_FOUND', `reservation ${reservation.id}: rule_set evaluado inexistente`, 'reservation', reservation.id);
    }

    const activeReservations = document.reservations.filter(x => ['pending','pending_payment','pending_approval','confirmed','checked_in'].includes(x.status));
    for (let i = 0; i < activeReservations.length; i++) for (let j = i + 1; j < activeReservations.length; j++) {
      const a = activeReservations[i], b = activeReservations[j];
      const sameResource = a.amenity_id === b.amenity_id && (!(a.resource_ids?.length && b.resource_ids?.length) || a.resource_ids.some(id => b.resource_ids.includes(id)));
      if (sameResource && a.starts_at < b.ends_at && b.starts_at < a.ends_at) add('RESERVATION_OVERLAP', `reservations ${a.id} y ${b.id}: horarios traslapados`, 'reservation', a.id);
    }

    for (const item of document.reservation_charges) {
      const reservation = reservationById.get(item.reservation_id);
      if (!reservation) add('REFERENCE_NOT_FOUND', `reservation_charge ${item.id}: reservation_id inexistente`, 'reservation_charge', item.id);
      if (reservation && reservation.unit_id !== item.unit_id) add('UNIT_MISMATCH', `reservation_charge ${item.id}: unidad distinta a la reserva`, 'reservation_charge', item.id);
      if (item.charge_id && !chargeById.has(item.charge_id)) add('REFERENCE_NOT_FOUND', `reservation_charge ${item.id}: charge_id inexistente`, 'reservation_charge', item.id);
      if (item.refundable_until && item.due_at && item.refundable_until < item.due_at && item.type === 'deposit') add('INVALID_DATE_RANGE', `reservation_charge ${item.id}: periodo de reembolso inválido`, 'reservation_charge', item.id);
    }
  }
}

if (!structuralValid || errors.length) {
  console.error('Documento inválido.');
  if (validate.errors) console.error(JSON.stringify(validate.errors, null, 2));
  for (const error of errors) console.error(`- [${error.code}] ${error.message}`);
  process.exit(1);
}

console.log(`Documento válido conforme a Open Condo ${version}: ${target}`);