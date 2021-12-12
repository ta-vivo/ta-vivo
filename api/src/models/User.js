import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

const User = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true
  }
}, {});

export default User;