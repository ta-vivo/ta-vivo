import TaskService from '../services/TaskService';
import Response from '../utils/response';
import querystringConverterHelper from '../utils/querystringConverterHelper';

class TaskController {

  static async create(req, res) {
    const newTask = req.body;
    try {
      const task = await TaskService.create(newTask);
      return res.json(Response.get('Task Created', task));
    } catch (error) {
      res.status(500).json({
        message: 'Something goes wrong',
        data: error
      });
    }
  }

  static async getAll(req, res) {
    const { query } = req;

    let { where, limit, offset, order } = querystringConverterHelper.parseQuery(query);

    try {
      const { rows, count, total } = await TaskService.getAll({
        criterions: {
          where,
          limit,
          offset,
          order,
        }
      });

      return res.json(Response.get('Tasks list', rows, 200, { count, total, offset }));
    } catch (error) {
      return res.json(Response.get('Something goes wrong', error, 500));
    }
  }


  static async getById(req, res) {
    try {
      const task = await TaskService.getById(req.params.id);

      if (task) {
        return res.json(Response.get('Task found', task));
      }
      return res.json(Response.get('Task not found', {}));
    } catch (error) {
      return res.json(Response.get('Something goes wrong', error, 500));
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const task = req.body;

    try {
      const updateTask = await TaskService.update(id, task);

      return res.json(Response.get('Task Updated', updateTask));
    } catch (error) {
      return res.json(Response.get('Something goes wrong', error, 500));
    }
  }

  static async delete(req, res) {
    try {
      await TaskService.delete(req.params.id);
      return res.json(Response.get('Task deleted', {}));
    } catch (error) {
      return res.json(Response.get('Something goes wrong', error, 500));
    }
  }
}

export default TaskController;