// @ts-ignore
import type { Meta, StoryObj } from '@storybook/angular';
import { ProjectFormComponent } from './project-form.component';

type Story = StoryObj<ProjectFormComponent>;

const meta: Meta<ProjectFormComponent> = {
  component: ProjectFormComponent,
  title: 'Portfolio/ProjectForm',
};
export default meta;

export const CreateNew: Story = {
  args: {
    title: 'Create project',
    initialValue: null,
    loading: false,
    saving: false,
    error: null,
    appearance: 'default',
  },
};

export const EditExisting: Story = {
  args: {
    title: 'Edit project',
    initialValue: {
      name: 'Migration to Nx',
      status: 'IN_PROGRESS',
      owner: 'Miljan',
      riskLevel: 'HIGH',
      budget: 120000,
      startDate: '2025-01-01',
      endDate: '2025-03-31',
    },
    saving: false,
    error: null,
  },
};

export const WithError: Story = {
  args: {
    title: 'Create project',
    initialValue: null,
    error: 'Failed to save project. Please try again.',
  },
};
