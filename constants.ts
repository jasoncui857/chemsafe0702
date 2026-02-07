
import { StorageCategory } from './types';

// H-Statement to Category Mapping (Simplified logic based on Image 1)
export const H_TO_CATEGORY_RULES = [
  { category: StorageCategory.CAT_1, hCodes: ['H201', 'H202', 'H203', 'H204', 'H205'] },
  { category: StorageCategory.CAT_4_1A, hCodes: ['H240', 'H241'] },
  { category: StorageCategory.CAT_5_2, hCodes: ['H242'] },
  { category: StorageCategory.CAT_4_2, hCodes: ['H250', 'H251', 'H252'] },
  { category: StorageCategory.CAT_4_3, hCodes: ['H260', 'H261'] },
  { category: StorageCategory.CAT_4_1B, hCodes: ['H228'] },
  { category: StorageCategory.CAT_5_1A, hCodes: ['H271'] },
  { category: StorageCategory.CAT_5_1B, hCodes: ['H272'] },
  { category: StorageCategory.CAT_3, hCodes: ['H224', 'H225', 'H226'] },
  // 6.1 and 8 categories require flammability check
  { category: StorageCategory.CAT_6_1A, hCodes: ['H300', 'H310', 'H330'], flammable: true },
  { category: StorageCategory.CAT_6_1B, hCodes: ['H300', 'H310', 'H330'], flammable: false },
  { category: StorageCategory.CAT_6_1C, hCodes: ['H301', 'H311', 'H331'], flammable: true },
  { category: StorageCategory.CAT_6_1D, hCodes: ['H301', 'H311', 'H331'], flammable: false },
  { category: StorageCategory.CAT_8A, hCodes: ['H314'], flammable: true },
  { category: StorageCategory.CAT_8B, hCodes: ['H314'], flammable: false },
];

// Compatibility Matrix based on Image 2
// Keys are formatted as "CatRow-CatCol"
// Value: true (O), false (X)
export const COMPATIBILITY_MATRIX: Record<string, boolean> = {
  // Row 3
  '3-3': true, '3-4.1B': false, '3-5.1A': false, '3-5.1B': false, '3-6.1A': true, '3-6.1B': false, '3-6.1C': true, '3-6.1D': false, '3-8A': true, '3-8B': true,
  // Row 4.1B
  '4.1B-3': false, '4.1B-4.1B': true, '4.1B-5.1A': false, '4.1B-5.1B': false, '4.1B-6.1A': false, '4.1B-6.1B': false, '4.1B-6.1C': true, '4.1B-6.1D': false, '4.1B-8A': true, '4.1B-8B': true,
  // Row 5.1A
  '5.1A-3': false, '5.1A-4.1B': false, '5.1A-5.1A': true, '5.1A-5.1B': true, '5.1A-6.1A': false, '5.1A-6.1B': false, '5.1A-6.1C': false, '5.1A-6.1D': false, '5.1A-8A': false, '5.1A-8B': false,
  // Row 5.1B
  '5.1B-3': false, '5.1B-4.1B': false, '5.1B-5.1A': true, '5.1B-5.1B': true, '5.1B-6.1A': false, '5.1B-6.1B': false, '5.1B-6.1C': false, '5.1B-6.1D': false, '5.1B-8A': false, '5.1B-8B': true,
  // Row 6.1A
  '6.1A-3': true, '6.1A-4.1B': false, '6.1A-5.1A': false, '6.1A-5.1B': false, '6.1A-6.1A': true, '6.1A-6.1B': true, '6.1A-6.1C': true, '6.1A-6.1D': true, '6.1A-8A': true, '6.1A-8B': true,
  // Row 6.1B
  '6.1B-3': false, '6.1B-4.1B': false, '6.1B-5.1A': false, '6.1B-5.1B': false, '6.1B-6.1A': true, '6.1B-6.1B': true, '6.1B-6.1C': true, '6.1B-6.1D': true, '6.1B-8A': true, '6.1B-8B': true,
  // Row 6.1C
  '6.1C-3': true, '6.1C-4.1B': true, '6.1C-5.1A': false, '6.1C-5.1B': false, '6.1C-6.1A': true, '6.1C-6.1B': true, '6.1C-6.1C': true, '6.1C-6.1D': true, '6.1C-8A': true, '6.1C-8B': true,
  // Row 6.1D
  '6.1D-3': false, '6.1D-4.1B': false, '6.1D-5.1A': false, '6.1D-5.1B': false, '6.1D-6.1A': true, '6.1D-6.1B': true, '6.1D-6.1C': true, '6.1D-6.1D': true, '6.1D-8A': true, '6.1D-8B': true,
  // Row 8A
  '8A-3': true, '8A-4.1B': true, '8A-5.1A': false, '8A-5.1B': false, '8A-6.1A': true, '8A-6.1B': true, '8A-6.1C': true, '8A-6.1D': true, '8A-8A': true, '8A-8B': true,
  // Row 8B
  '8B-3': true, '8B-4.1B': true, '8B-5.1A': false, '8B-5.1B': true, '8B-6.1A': true, '8B-6.1B': true, '8B-6.1C': true, '8B-6.1D': true, '8B-8A': true, '8B-8B': true,
};

export const CATEGORY_LABELS: Record<StorageCategory, string> = {
  [StorageCategory.CAT_1]: '爆炸物 (1)',
  [StorageCategory.CAT_4_1A]: '自反应物质和有机过氧化物 A/B型 (4.1A)',
  [StorageCategory.CAT_5_2]: '自反应物质和有机过氧化物 C-F型 (5.2)',
  [StorageCategory.CAT_4_2]: '自燃/自热物质 (4.2)',
  [StorageCategory.CAT_4_3]: '遇水放出易燃气体物质 (4.3)',
  [StorageCategory.CAT_4_1B]: '易燃固体 (4.1B)',
  [StorageCategory.CAT_5_1A]: '强氧化性物质 (5.1A)',
  [StorageCategory.CAT_5_1B]: '普通氧化性物质 (5.1B)',
  [StorageCategory.CAT_3]: '易燃液体 (3)',
  [StorageCategory.CAT_6_1A]: '急性毒性 Cat 1/2 可燃 (6.1A)',
  [StorageCategory.CAT_6_1B]: '急性毒性 Cat 1/2 不可燃 (6.1B)',
  [StorageCategory.CAT_6_1C]: '急性毒性 Cat 3 可燃 (6.1C)',
  [StorageCategory.CAT_6_1D]: '急性毒性 Cat 3 不可燃 (6.1D)',
  [StorageCategory.CAT_8A]: '皮肤腐蚀 Cat 1 可燃 (8A)',
  [StorageCategory.CAT_8B]: '皮肤腐蚀 Cat 1 不可燃 (8B)',
  [StorageCategory.UNKNOWN]: '未识别/不在相容矩阵内'
};
