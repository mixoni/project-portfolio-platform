import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { ProjectListComponent } from './project-list.component';
import { ProjectsApi, Project } from '@portfolio/data-access';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: any;
  let api: jest.Mocked<ProjectsApi>;

  beforeEach(async () => {
    const apiMock: jest.Mocked<ProjectsApi> = {
      getProjects: jest.fn(),
      getProject: jest.fn(),
      createProject: jest.fn(),
      updateProject: jest.fn(),
      deleteProject: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ProjectListComponent,     // standalone component
        RouterTestingModule,      
      ],
      providers: [
        { provide: ProjectsApi, useValue: apiMock },
      ],
    }).compileComponents();

    api = TestBed.inject(ProjectsApi) as jest.Mocked<ProjectsApi>;
    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
  });

  it('should load projects on init', () => {
    const projects: Project[] = [
      {
        id: 1,
        name: 'Demo Project',
        status: 'IN_PROGRESS',
        owner: 'Miljan',
        riskLevel: 'MEDIUM',
        budget: 10000,
        startDate: '2024-01-01',
        endDate: '2024-06-01',
      },
    ];

    api.getProjects.mockReturnValue(of(projects));

    // trigger ngOnInit
    fixture.detectChanges();

    expect(api.getProjects).toHaveBeenCalledTimes(1);
    expect(component.projects()).toEqual(projects);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('should set error on load failure', () => {
    api.getProjects.mockReturnValue(throwError(() => new Error('boom')));

    fixture.detectChanges();

    expect(api.getProjects).toHaveBeenCalledTimes(1);
    expect(component.error()).toBe('Failed to load projects');
    expect(component.loading()).toBe(false);
  });
});
