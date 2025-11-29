export type ColumnDef<T extends Record<string, any>> = {
    key: keyof T;
    header: string;
    width?: string;
    align?: 'left' | 'right' | 'center';
    cell?: (row: T) => string | number;
  };
  