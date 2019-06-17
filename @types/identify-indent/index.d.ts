declare module 'identify-indent' {
  export interface Result {
    character: '\t' | ' ';
    size: number;
    certainty: number;
  }
  export function file(filePath: string): Result | null;
  export function string(sourceCode: string): Result | null;
}
