import { Component, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectsApi } from '@portfolio/data-access';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-project-create',
  imports: [FormsModule],
  template: `
    <h2>Create Project</h2>
    <form (ngSubmit)="onSubmit()">
      <label>
        Name:
        <input [(ngModel)]="name" name="name" />
      </label>
      <br />
      <label>
        Status:
        <select [(ngModel)]="status" name="status">
          <option value="PLANNED">Planned</option>
          <option value="IN_PROGRESS">In progress</option>
        </select>
      </label>
      <br />
      <label>
        Owner:
        <input [(ngModel)]="owner" name="owner" />
      </label>
      <br />
      <button type="submit">Create</button>
    </form>
  `,
})
export class ProjectCreateComponent {
  name = '';
  status = 'PLANNED';
  owner = '';

  constructor(private api: ProjectsApi, private router: Router) {}

  onSubmit() {
    this.api
      .createProject({
        name: this.name,
        status: this.status,
        owner: this.owner,
        riskLevel: 'LOW',
      })
      .subscribe(() => this.router.navigate(['/projects']));
  }
}
