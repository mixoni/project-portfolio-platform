export type ColumnFormat = 'text' | 'number' | 'currency' | 'date'

export type ColumnDef<T extends Record<string, any>> = {
    key: keyof T;
    header: string;
    width?: string;
    format?: ColumnFormat;
    align?: 'left' | 'right' | 'center';
    cell?: (row: T) => string | number;
  };
  