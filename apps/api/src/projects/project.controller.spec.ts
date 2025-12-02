import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: jest.Mocked<ProjectsService>;

  beforeEach(async () => {
    const serviceMock: jest.Mocked<ProjectsService> = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        { provide: ProjectsService, useValue: serviceMock },
      ],
    }).compile();

    controller = module.get(ProjectsController);
    service = module.get(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('GET /projects -> calls service.findAll with mapped filters', async () => {
    const result = [{ id: 1, name: 'Demo' }];

    service.findAll.mockResolvedValue(result as any);

    const response = await controller.findAll('IN_PROGRESS', 'Miljan');

    expect(service.findAll).toHaveBeenCalledWith({
      status: 'IN_PROGRESS',
      owner: 'Miljan',
    });
    expect(response).toBe(result as any);
  });

  it('GET /projects/:id -> calls service.findOne', async () => {
    const project = { id: 1, name: 'Demo' };

    service.findOne.mockResolvedValue(project as any);

    const result = await controller.findOne(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toBe(project as any);
  });

  it('POST /projects -> calls service.create', async () => {
    const dto = {
      name: 'New',
      status: 'PLANNED',
      owner: 'Miljan',
      riskLevel: 'LOW',
    };

    const created = { id: 10, ...dto };

    service.create.mockResolvedValue(created as any);

    const result = await controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(created as any);
  });

  it('PATCH /projects/:id -> calls service.update', async () => {
    const dto = { name: 'Updated' };
    const updated = { id: 1, name: 'Updated' };

    service.update.mockResolvedValue(updated as any);

    const result = await controller.update(1, dto);

    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toBe(updated as any);
  });

  it('DELETE /projects/:id -> calls service.delete', async () => {
    const deleted = { affected: 1 };

    service.delete.mockResolvedValue(deleted as any);

    const result = await controller.remove(1);

    expect(service.delete).toHaveBeenCalledWith(1);
    expect(result).toBe(deleted as any);
  });
});
