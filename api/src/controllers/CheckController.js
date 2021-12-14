import CheckService from '../services/CheckService';
import Response from '../utils/response';
import querystringConverterHelper from '../utils/querystringConverterHelper';

class CheckController {

  static async create(req, res) {
    const newCheck = req.body;
    newCheck.user = req.user;
    try {
      const entityCreated = await CheckService.create(newCheck);
      return res.json(Response.get('Check created', entityCreated));
    } catch (error) {
      res.status(500).json({
        message: 'Something goes wrong',
        data: error
      });
    }
  }

  static async getAll(req, res) {
    try {
      const { query } = req;

      let { where, limit, offset, order } = querystringConverterHelper.parseQuery(query);
      if (where) {
        where = { ...where, userId: req.user.userId };
      } else {
        where = { userId: req.user.userId };
      }

      const { rows, count, total } = await CheckService.getAll({
        criterions: {
          where,
          limit,
          offset,
          order,
        }
      });

      return res.json(Response.get('Check list', rows, 200, { count, total, offset }));
    } catch (error) {
      return res.json(Response.get('Something goes wrong', error, 500));
    }
  }


  static async getById(req, res) {
    try {
      const check = await CheckService.getById({ id: req.params.id, user: req.user });

      if (check) {
        return res.json(Response.get('Check found', check));
      }
      return res.json(Response.get('Check not found', {}));
    } catch (error) {
      return res.json(Response.get('Something goes wrong', error, 500));
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const check = req.body;
    check.user = req.user;

    try {
      const updateCheck = await CheckService.update(id, check);

      return res.json(Response.get('Check Updated', updateCheck));
    } catch (error) {
      return res.json(Response.get('Something goes wrong', error, 500));
    }
  }

  static async delete(req, res) {
    try {
      await CheckService.delete({ id: req.params.id, user: req.user });
      return res.json(Response.get('Check deleted', {}));
    } catch (error) {
      return res.json(Response.get('Something goes wrong', error, 500));
    }
  }
}

export default CheckController;