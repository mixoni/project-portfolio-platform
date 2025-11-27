import { DataSourceOptions } from 'typeorm';
import { User, Role } from '../users/user.entity';
import { Project } from '../projects/project.entity';

const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5435),
  username: process.env.DB_USER || 'portfolio_user',
  password: process.env.DB_PASS || 'portfolio_pass',
  database: process.env.DB_NAME || 'portfolio_db',
  entities: [User, Role, Project],
  synchronize: false
};

export default ormconfig;
