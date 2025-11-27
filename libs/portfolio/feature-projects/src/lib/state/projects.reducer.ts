import { createReducer, on } from '@ngrx/store';
import * as ProjectsActions from './projects.actions';
import { Project } from '@portfolio/data-access';

export interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error?: string;
}

export const initialState: ProjectsState = {
  projects: [],
  loading: false,
};

export const projectsReducer = createReducer(
  initialState,
  on(ProjectsActions.loadProjects, state => ({ ...state, loading: true, error: undefined })),
  on(ProjectsActions.loadProjectsSuccess, (state, { projects }) => ({
    ...state,
    loading: false,
    projects,
  })),
  on(ProjectsActions.loadProjectsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
