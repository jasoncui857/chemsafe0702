
export enum StorageCategory {
  CAT_1 = '1',
  CAT_4_1A = '4.1A',
  CAT_5_2 = '5.2',
  CAT_4_2 = '4.2',
  CAT_4_3 = '4.3',
  CAT_4_1B = '4.1B',
  CAT_5_1A = '5.1A',
  CAT_5_1B = '5.1B',
  CAT_3 = '3',
  CAT_6_1A = '6.1A',
  CAT_6_1B = '6.1B',
  CAT_6_1C = '6.1C',
  CAT_6_1D = '6.1D',
  CAT_8A = '8A',
  CAT_8B = '8B',
  UNKNOWN = 'UNKNOWN'
}

export interface ChemicalInfo {
  cas: string;
  name: string;
  hStatements: string[];
  isFlammable: boolean;
  category: StorageCategory;
  categoryLabel: string;
}

export interface CompatibilityResult {
  compatible: boolean | 'special';
  reason: string;
}
