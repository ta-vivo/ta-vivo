import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

const Integration = sequelize.define('integrations', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.ENUM('telegram'),
  },
  appUserId: {
    type: Sequelize.TEXT,
    allowNull: false
  },
}, {});

export default Integration;