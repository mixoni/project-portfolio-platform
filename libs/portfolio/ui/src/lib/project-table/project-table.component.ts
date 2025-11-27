import { Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';
import { Project } from '@portfolio/data-access';

@Component({
  standalone: true,
  selector: 'portfolio-project-table',
  imports: [NgForOf],
  template: `
    <table border="1" cellpadding="4" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Status</th>
          <th>Owner</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let p of projects">
          <td>{{ p.id }}</td>
          <td>{{ p.name }}</td>
          <td>{{ p.status }}</td>
          <td>{{ p.owner }}</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class ProjectTableComponent {
  @Input() projects: Project[] = [];
}
