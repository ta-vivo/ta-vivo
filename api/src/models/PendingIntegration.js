import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

const PendingIntegration = sequelize.define('pending_integrations', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  uniqueCode: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  integrationType: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  appUserId: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  // To store temp data like emails, phone numbers or others
  data: {
    type: Sequelize.JSON,
    allowNull: true
  }

}, {});

export default PendingIntegration;