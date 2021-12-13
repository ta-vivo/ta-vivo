import Sequelize from 'sequelize';
import { sequelize } from '../database/database';
import { User } from './';

const UserCredential = sequelize.define('users_credentials', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {});

UserCredential.belongsTo(User);
User.hasMany(UserCredential);

export default UserCredential;