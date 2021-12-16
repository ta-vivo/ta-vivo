import Sequelize from 'sequelize';
import { sequelize } from '../database/database';
import { Checks, Integration } from './index';

const CheckIntegration = sequelize.define('check_integrations', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {});

CheckIntegration.belongsTo(Checks, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Checks.hasMany(CheckIntegration);

CheckIntegration.belongsTo(Integration, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Integration.hasMany(CheckIntegration);

export default CheckIntegration;