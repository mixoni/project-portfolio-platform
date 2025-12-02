import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectsApi, ProjectsFilter } from './projects.api';
import { PROJECTS_API_CONFIG, ProjectsApiConfig } from './project-api.config';
import { RequestCacheService } from './cache/request-cache.service';

describe('ProjectsApi', () => {
  let api: ProjectsApi;
  let httpMock: HttpTestingController;

  const config: ProjectsApiConfig = {
    baseUrl: 'http://test-api',
    cacheTtlMs: 1000,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProjectsApi,
        RequestCacheService,
        { provide: PROJECTS_API_CONFIG, useValue: config },
      ],
    });

    api = TestBed.inject(ProjectsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call /projects with filter params', () => {
    const filter: ProjectsFilter = { status: 'PLANNED', owner: 'admin' };

    api.getProjects(filter).subscribe();

    const req = httpMock.expectOne(
      r => r.method === 'GET' && r.url === 'http://test-api/projects',
    );

    expect(req.request.params.get('status')).toBe('PLANNED');
    expect(req.request.params.get('owner')).toBe('admin');

    req.flush([]);
  });

  it('should use cache for same filter', () => {
    const filter: ProjectsFilter = { status: 'PLANNED' };

    const first$ = api.getProjects(filter);
    const second$ = api.getProjects(filter);

    let firstEmitted = 0;
    let secondEmitted = 0;

    first$.subscribe(() => firstEmitted++);
    second$.subscribe(() => secondEmitted++);

    const req = httpMock.expectOne('http://test-api/projects?status=PLANNED');
    req.flush([{ id: 1, name: 'P1' }]);

    expect(firstEmitted).toBe(1);
    expect(secondEmitted).toBe(1);


    httpMock.verify();
  });
});
