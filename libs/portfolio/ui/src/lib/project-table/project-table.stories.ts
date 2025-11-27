import type { Meta, StoryObj } from '@storybook/angular';
import { ProjectTableComponent } from './project-table.component';

const meta: Meta<ProjectTableComponent> = {
  title: 'Portfolio/ProjectTable',
  component: ProjectTableComponent,
};

export default meta;
type Story = StoryObj<ProjectTableComponent>;

export const Default: Story = {
  args: {
    projects: [
      { id: 1, name: 'Project Alpha', status: 'IN_PROGRESS', owner: 'admin', riskLevel: 'MEDIUM', budget: 100000, startDate: '2024-01-01', endDate: '2024-12-31' },
      { id: 2, name: 'Project Beta', status: 'PLANNED', owner: 'user', riskLevel: 'LOW', budget: 50000, startDate: '2024-03-01', endDate: '2024-10-31' }
    ],
  },
};
