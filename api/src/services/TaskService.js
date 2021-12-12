import Task from '../models/Task';
import User from '../models/User';

class TaskService {

  static async create( task) {
    try {
      const entityCreated = await Task.create(task);
      return entityCreated;
    } catch (error) {
      throw error;
    }
  }

  static async getAll(params) {
    const { criterions } = params;

    try {
      const { rows } = await Task.findAndCountAll({
        ...criterions,
        attributes: {
          exclude: ['userId']
        },
        include: [
          { model: User, required: true }
        ]
      });

      return { rows, count: rows.length };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {

    try {
      const task = await Task.findOne({
        where: { id },
        attributes: {
          exclude: ['userId']
        },
        include: [
          { model: User, required: true }
        ]
      });
      return task;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, task) {
    try {
      await Task.update(task, { where: { id: id } });
      return await this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const rowCount = await Task.destroy({
        where: { id }
      });
      return { count: rowCount };
    } catch (error) {
      throw error;
    }
  }

}

export default TaskService;