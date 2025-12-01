import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { AuthGuard } from './core/auth/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/project-list.component').then(m => m.ProjectListComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'projects/new',
        loadComponent: () =>
          import('./features/projects/project-create/project-create.component').then(m => m.ProjectCreateComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'projects/:id/edit',
        loadComponent: () =>
          import('./features/projects/project-edit/project-edit.component')
            .then(m => m.ProjectEditPageComponent),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./core/login/login.component').then(m => m.LoginComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'projects' },
    ],
  },
];
