import { Dictionary, HanziInfo, WordInfo, DictionaryProgress } from '../types/game';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Comprehensive dictionary validation function
 * Validates structure, hanzi composition, and level progression integrity
 */
export function validateDictionary(data: any): ValidationResult {
  const errors: string[] = [];

  // ===== 1. Basic Structure Validation =====
  
  // Check required top-level fields
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Missing or invalid "name" field. Must be a non-empty string.');
  }
  
  if (!data.hanzi || typeof data.hanzi !== 'object' || Object.keys(data.hanzi).length === 0) {
    errors.push('Invalid "hanzi" format. Must be an object with hanzi characters as keys.');
  }
  
  if (!data.targetWords || typeof data.targetWords !== 'object' || Object.keys(data.targetWords).length === 0) {
    errors.push('Invalid "targetWords" format. Must be an object with words as keys.');
  }

  // If basic structure is invalid, return early
  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Validate hanzi entries have required fields
  for (const [hanzi, info] of Object.entries(data.hanzi)) {
    if (!info || typeof info !== 'object') {
      errors.push(`Invalid hanzi entry for "${hanzi}". Must be an object.`);
      continue;
    }
    const hanziInfo = info as any;
    if (!hanziInfo.pinyin || typeof hanziInfo.pinyin !== 'string') {
      errors.push(`Invalid hanzi entry for "${hanzi}". Missing or invalid "pinyin" field.`);
    }
    if (!hanziInfo.en || typeof hanziInfo.en !== 'string') {
      errors.push(`Invalid hanzi entry for "${hanzi}". Missing or invalid "en" field.`);
    }
    if (!hanziInfo.pt || typeof hanziInfo.pt !== 'string') {
      errors.push(`Invalid hanzi entry for "${hanzi}". Missing or invalid "pt" field.`);
    }
  }

  // Validate targetWords entries have required fields
  for (const [word, info] of Object.entries(data.targetWords)) {
    if (!info || typeof info !== 'object') {
      errors.push(`Invalid targetWords entry for "${word}". Must be an object.`);
      continue;
    }
    const wordInfo = info as any;
    if (!wordInfo.pinyin || typeof wordInfo.pinyin !== 'string') {
      errors.push(`Invalid targetWords entry for "${word}". Missing or invalid "pinyin" field.`);
    }
    if (!wordInfo.en || typeof wordInfo.en !== 'string') {
      errors.push(`Invalid targetWords entry for "${word}". Missing or invalid "en" field.`);
    }
    if (!wordInfo.pt || typeof wordInfo.pt !== 'string') {
      errors.push(`Invalid targetWords entry for "${word}". Missing or invalid "pt" field.`);
    }
  }

  // If field validation failed, return early
  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // ===== 2. Validate targetWords Only Use Hanzi from hanzi Block =====
  
  const availableHanzi = new Set(Object.keys(data.hanzi));
  
  for (const word of Object.keys(data.targetWords)) {
    // Split word into individual characters
    const characters = word.split('');
    
    for (const char of characters) {
      if (!availableHanzi.has(char)) {
        errors.push(
          `targetWords entry "${word}" contains character "${char}" which is not defined in the hanzi block.`
        );
      }
    }
  }

  // ===== 3-5. Validate Progress Levels (if present) =====
  
  if (data.progress) {
    if (typeof data.progress !== 'object') {
      errors.push('Invalid "progress" field. Must be an object.');
    } else {
      const progress = data.progress as any;
      
      // Validate progress structure
      if (!progress.levels || !Array.isArray(progress.levels)) {
        errors.push('Invalid "progress.levels" field. Must be an array.');
      } else {
        const levels = progress.levels;
        
        // Track hanzi and words across levels for cross-level validation
        const seenHanzi = new Set<string>();
        const seenExamples = new Set<string>();
        
        for (let i = 0; i < levels.length; i++) {
          const level = levels[i];
          const levelNum = level.id || (i + 1);
          
          // Validate level structure
          if (!level.hanzi || !Array.isArray(level.hanzi)) {
            errors.push(`Level ${levelNum}: "hanzi" field must be an array.`);
            continue;
          }
          
          if (!level.availableExamples || !Array.isArray(level.availableExamples)) {
            errors.push(`Level ${levelNum}: "availableExamples" field must be an array.`);
            continue;
          }
          
          // ===== 4. Within-Level Validation =====
          
          // Check for duplicate hanzi within this level
          const levelHanziSet = new Set<string>();
          for (const hanzi of level.hanzi) {
            if (levelHanziSet.has(hanzi)) {
              errors.push(`Level ${levelNum}: Duplicate hanzi "${hanzi}" found within the same level.`);
            }
            levelHanziSet.add(hanzi);
          }
          
          // Check for duplicate availableExamples within this level
          const levelExamplesSet = new Set<string>();
          for (const example of level.availableExamples) {
            if (levelExamplesSet.has(example)) {
              errors.push(`Level ${levelNum}: Duplicate availableExamples entry "${example}" found within the same level.`);
            }
            levelExamplesSet.add(example);
          }
          
          // ===== 5. Cross-Level Validation =====
          
          // Check that hanzi don't reappear from previous levels
          for (const hanzi of level.hanzi) {
            if (seenHanzi.has(hanzi)) {
              errors.push(`Level ${levelNum}: Hanzi "${hanzi}" was already introduced in a previous level.`);
            }
          }
          
          // Check that availableExamples don't reappear from previous levels
          for (const example of level.availableExamples) {
            if (seenExamples.has(example)) {
              errors.push(`Level ${levelNum}: availableExamples entry "${example}" was already listed in a previous level.`);
            }
          }
          
          // ===== 3. Validate availableExamples Exist in targetWords =====
          
          for (const example of level.availableExamples) {
            if (!data.targetWords[example]) {
              errors.push(`Level ${levelNum}: availableExamples entry "${example}" does not exist in targetWords.`);
            }
          }
          
          // Add current level's hanzi and examples to seen sets
          level.hanzi.forEach((h: string) => seenHanzi.add(h));
          level.availableExamples.forEach((e: string) => seenExamples.add(e));
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Helper function to format validation errors for display
 */
export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 0) return '';
  
  if (errors.length === 1) {
    return errors[0];
  }
  
  return errors.map((error, index) => `${index + 1}. ${error}`).join('\n');
}
