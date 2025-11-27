import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
  ) {}

  findAll(filter?: { status?: string; owner?: string }) {
    const qb = this.repo.createQueryBuilder('p');
    if (filter?.status) {
      qb.andWhere('p.status = :status', { status: filter.status });
    }
    if (filter?.owner) {
      qb.andWhere('p.owner = :owner', { owner: filter.owner });
    }
    return qb.orderBy('p.id', 'DESC').getMany();
  }


  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  create(data: {
    name: string;
    status: string;
    owner: string;
    riskLevel: string;
    budget?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const entity = this.repo.create(data as any);
    return this.repo.save(entity);
  }

  update(id: number, partial: Partial<{
    name: string;
    status: string;
    owner: string;
    riskLevel: string;
    budget?: number;
    startDate?: string;
    endDate?: string;
  }>) {
    return this.repo.save({ ...(partial as any), id });
  }

}
