import Sequelize from 'sequelize';
import { sequelize } from '../database/database';
import User from './User';

const Task = sequelize.define('tasks', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  done: {
    type: Sequelize.BOOLEAN
  },
}, {});

User.hasMany(Task);
Task.belongsTo(User);

export default Task;