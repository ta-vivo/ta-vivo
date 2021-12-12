import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

const Integration = sequelize.define('integrations', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.ENUM('telegram'),
  },
}, {});

export default Integration;