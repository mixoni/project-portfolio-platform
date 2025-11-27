import { Controller, Get, Param, Query, UseGuards, Post, Body, Patch } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}


  @Post()
  @Roles('ADMIN')
  createProject(@Body() dto: { name: string; status: string; owner: string; riskLevel: string; budget?: number; startDate?: string; endDate?: string }) {
    return this.projects.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  updateProject(@Param('id') id: string, @Body() dto: Partial<{ name: string; status: string; owner: string; riskLevel: string; budget?: number; startDate?: string; endDate?: string }>) {
    return this.projects.update(Number(id), dto);
  }

  @Get()
  getProjects(
    @Query('status') status?: string,
    @Query('owner') owner?: string,
  ) {
    return this.projects.findAll({ status, owner });
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  getProject(@Param('id') id: string) {
    return this.projects.findOne(Number(id));
  }
}
