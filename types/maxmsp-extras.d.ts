/**
 * Max Dict API surface used by DynamicColor; extend if @types/maxmsp lags.
 */
interface Dict {
  import_json(filename: string): void;
  stringify(): string;
  freepeer(): void;
}

declare const Dict: {
  new (name?: string): Dict;
};
