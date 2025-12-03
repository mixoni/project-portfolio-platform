// @ts-ignore
import type { Meta, StoryObj } from '@storybook/angular';
import { LabelValueComponent } from './label.component';

const meta: Meta<LabelValueComponent> = {
  component: LabelValueComponent,
  title: 'LabelValueComponent',
};
export default meta;
type Story = StoryObj<LabelValueComponent>;

export const Primary: Story = {
  args: {
    label: '',
    format: 'text',
    emptyPlaceholder: '—',
    currency: 'EUR',
  },
};
