import Sequelize from 'sequelize';
import { sequelize } from '../database/database';
import { User } from './index';

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
    type: Sequelize.ENUM('telegram', 'email'),
  },
  appUserId: {
    type: Sequelize.TEXT,
    allowNull: false
  },
}, {});

Integration.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
User.hasMany(Integration);

export default Integration;