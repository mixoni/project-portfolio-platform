import { ProjectsService } from './projects.service';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repo: jest.Mocked<Repository<Project>>;

  beforeEach(() => {
    repo = {
      createQueryBuilder: jest.fn().mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      }),
    } as any;

    service = new ProjectsService(repo);
  });

  it('should pass filters into query builder', async () => {
    await service.findAll({ status: 'PLANNED', owner: 'admin' });

    expect(repo.createQueryBuilder).toHaveBeenCalledWith('p');
  });
});
