import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('owner') owner?: string,
  ) {
    return this.projects.findAll({
      status: status || undefined,
      owner: owner || undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projects.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      name: string;
      status: string;
      owner: string;
      riskLevel: string;
      budget?: number;
      startDate?: string;
      endDate?: string;
    },
  ) {
    return this.projects.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: Partial<{
      name: string;
      status: string;
      owner: string;
      riskLevel: string;
      budget?: number;
      startDate?: string;
      endDate?: string;
    }>,
  ) {
    return this.projects.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projects.delete(id);
  }
}
