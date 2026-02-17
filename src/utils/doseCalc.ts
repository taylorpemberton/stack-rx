import { frequencyOptions } from '../data/dosing';

/**
 * Calculate concentration after reconstitution
 * @param {number} peptideAmountMg - Amount of peptide in vial (mg)
 * @param {number} waterVolumeMl - BAC water added (mL)
 * @returns {number} Concentration in mcg per 0.01 mL (per unit on insulin syringe)
 */
export function calcConcentration(peptideAmountMg, waterVolumeMl) {
  if (!waterVolumeMl || waterVolumeMl <= 0) return 0;
  const totalMcg = peptideAmountMg * 1000;
  const mcgPerMl = totalMcg / waterVolumeMl;
  return mcgPerMl; // mcg per mL
}

/**
 * Calculate volume to draw for a given dose
 * @param {number} doseMcg - Desired dose in mcg
 * @param {number} concentrationMcgPerMl - Concentration in mcg/mL
 * @returns {number} Volume in mL
 */
export function calcVolumeToDraw(doseMcg, concentrationMcgPerMl) {
  if (!concentrationMcgPerMl || concentrationMcgPerMl <= 0) return 0;
  return doseMcg / concentrationMcgPerMl;
}

/**
 * Convert dose between units
 * @param {number} value - Dose value
 * @param {string} fromUnit - Source unit ('mg' or 'mcg')
 * @param {string} toUnit - Target unit ('mg' or 'mcg')
 * @returns {number}
 */
export function convertDoseUnit(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;
  if (fromUnit === 'mg' && toUnit === 'mcg') return value * 1000;
  if (fromUnit === 'mcg' && toUnit === 'mg') return value / 1000;
  return value;
}

/**
 * Get dose in mcg regardless of input unit
 */
export function doseToMcg(value, unit) {
  return unit === 'mg' ? value * 1000 : value;
}

/**
 * Calculate weekly total
 * @param {number} dosePerInjection - Dose per injection
 * @param {string} frequencyValue - Frequency key
 * @returns {number} Total per week
 */
export function calcWeeklyTotal(dosePerInjection, frequencyValue) {
  const freq = frequencyOptions.find((f) => f.value === frequencyValue);
  if (!freq) return dosePerInjection;
  return dosePerInjection * freq.perWeek;
}

/**
 * Calculate monthly vials needed
 * @param {number} weeklyTotalMcg - Weekly total in mcg
 * @param {number} vialAmountMcg - Amount per vial in mcg
 * @returns {number} Vials per month (rounded up)
 */
export function calcMonthlyVials(weeklyTotalMcg, vialAmountMcg) {
  if (!vialAmountMcg || vialAmountMcg <= 0) return 0;
  const monthlyTotal = weeklyTotalMcg * 4.33; // avg weeks per month
  return Math.ceil(monthlyTotal / vialAmountMcg);
}

/**
 * Convert body weight between kg and lbs
 */
export function convertWeight(value, fromUnit) {
  if (fromUnit === 'lbs') return value * 0.453592;
  return value / 0.453592;
}

/**
 * Generate titration schedule data points for chart
 * @param {number[]} titrationWeeks - Array of dose values per week
 * @param {string} unit - Display unit
 * @returns {Array<{week: number, dose: number}>}
 */
export function getTitrationData(titrationWeeks, unit) {
  return titrationWeeks.map((dose, i) => ({
    week: i + 1,
    dose,
    label: `${dose}${unit}`,
  }));
}

/**
 * Volume to syringe units (marks on insulin syringe)
 * Standard insulin syringe: 1 mL = 100 units
 */
export function volumeToUnits(volumeMl) {
  return volumeMl * 100;
}
