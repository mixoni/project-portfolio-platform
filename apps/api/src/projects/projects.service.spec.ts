import { Test } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from './project.entity';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repoMock: any;

  beforeEach(async () => {
    repoMock = {
      createQueryBuilder: jest.fn().mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      }),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = moduleRef.get(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('calls getMany on repo', async () => {
    await service.findAll({});
    const qb = repoMock.createQueryBuilder.mock.results[0].value;
    expect(qb.getMany).toHaveBeenCalled();
  });
});
