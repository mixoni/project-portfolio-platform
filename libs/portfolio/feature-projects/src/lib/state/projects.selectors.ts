import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectsState } from './projects.reducer';

export const selectProjectsState = createFeatureSelector<ProjectsState>('projects');

export const selectProjects = createSelector(
  selectProjectsState,
  state => state.projects,
);

export const selectProjectsLoading = createSelector(
  selectProjectsState,
  state => state.loading,
);
