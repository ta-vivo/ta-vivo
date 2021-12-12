import Sequelize from 'sequelize';
import { sequelize } from '../database/database';
import { Checks, Integration } from './index';

const CheckNotificationMethod = sequelize.define('check_notification_methods', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {});

CheckNotificationMethod.belongsTo(Checks);
Checks.hasMany(CheckNotificationMethod);

CheckNotificationMethod.belongsTo(Integration);
Integration.hasMany(CheckNotificationMethod);

export default CheckNotificationMethod;