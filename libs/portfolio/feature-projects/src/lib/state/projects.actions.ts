import { createAction, props } from '@ngrx/store';
import { Project } from '@portfolio/data-access';

export const loadProjects = createAction(
  '[Projects] Load Projects',
  props<{ status?: string; owner?: string }>(),
);

export const loadProjectsSuccess = createAction(
  '[Projects] Load Projects Success',
  props<{ projects: Project[] }>(),
);

export const loadProjectsFailure = createAction(
  '[Projects] Load Projects Failure',
  props<{ error: string }>(),
);
