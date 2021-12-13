import Sequelize from 'sequelize';
import dotenv from 'dotenv';
// Load env file
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      required: 30000,
      idle: 10000
    },
    logging: false,
    define: {
      underscored: true,
      timestamps: true
    }
  }
);

export default { sequelize };