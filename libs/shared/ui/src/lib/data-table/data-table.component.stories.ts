// @ts-ignore 
import type { Meta, StoryObj } from '@storybook/angular';

import { DataTableComponent } from './data-table.component';
import { ColumnDef } from '../table-types';

type DemoStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
type DemoRisk = 'LOW' | 'MEDIUM' | 'HIGH';

interface DemoRow {
  id: number;
  name: string;
  owner: string;
  status: DemoStatus;
  riskLevel: DemoRisk;
  budget: number;
  startDate?: string | null;
  endDate?: string | null;
}

const demoColumns: ColumnDef<DemoRow>[] = [
  { key: 'name', header: 'Name' },
  { key: 'owner', header: 'Owner' },
  { key: 'status', header: 'Status' },
  { key: 'riskLevel', header: 'Risk' },
  {
    key: 'budget',
    header: 'Budget',
    format: 'currency',
  },
];

const demoRows: DemoRow[] = [
  {
    id: 1,
    name: 'Portfolio Platform',
    owner: 'Miljan',
    status: 'IN_PROGRESS',
    riskLevel: 'HIGH',
    budget: 120_000,
    startDate: '2025-01-10',
    endDate: '2025-03-31',
  },
  {
    id: 2,
    name: 'UI Library',
    owner: 'Admin',
    status: 'PLANNED',
    riskLevel: 'MEDIUM',
    budget: 60_000,
    startDate: '2025-04-01',
    endDate: null,
  },
  {
    id: 3,
    name: 'Reporting PoC',
    owner: 'Product',
    status: 'COMPLETED',
    riskLevel: 'LOW',
    budget: 30_000,
    startDate: '2024-10-01',
    endDate: '2024-12-15',
  },
];

const meta: Meta<DataTableComponent<DemoRow>> = {
  component: DataTableComponent,
  title: 'Shared UI/Data Table',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<DataTableComponent<DemoRow>>;

/**
 * Osnovni prikaz – par kolona, par redova.
 */
export const Basic: Story = {
  args: {
    columns: demoColumns,
    rows: demoRows,
    clickableRows: true,
  },
};

/**
 * Empty state – nema redova, prikazuje empty poruku.
 */
export const Empty: Story = {
  args: {
    columns: demoColumns,
    rows: [],
    emptyMessage: 'No projects found',
  },
};

/**
 * Loading state – skeleton.
 */
export const Loading: Story = {
  args: {
    columns: demoColumns,
    rows: [],
    loading: true,
  },
};

/**
 * Toolbar + search + create button 
 */
export const WithToolbarAndSearch: Story = {
  args: {
    columns: demoColumns,
    rows: demoRows,
    showToolbar: true,
    enableSearch: true,
    searchPlaceholder: 'Search by owner or name…',
    showCreateButton: true,
    createLabel: 'New project',
  },
};

/**
 * Row menu (⋮) with Edit/Delete akcijama.
 */
export const WithRowMenu: Story = {
  args: {
    columns: demoColumns,
    rows: demoRows,
    showRowMenu: true,
    clickableRows: true,
  },
};
