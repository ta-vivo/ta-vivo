import IntegrationService from '../services/IntegrationService';
import Response from '../utils/response';
import querystringConverterHelper from '../utils/querystringConverterHelper';


class IntegrationsController {

  static async create(req, res) {
    const newIntegration = req.body;
    try {
      const entityCreated = await IntegrationService.create({ newIntegration, user: req.user });
      return res.json(Response.get('Integration created', entityCreated));
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Something goes wrong',
        data: error
      });
    }
  }

  static async requestEmailConfirmation(req, res) {
    const { email } = req.body;
    try {
      await IntegrationService.requestEmailConfirmation({ email, user: req.user });
      return res.json(Response.get('Confirmation sent', {}));
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Something goes wrong',
        data: error
      });
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const entityUpdated = await IntegrationService.update({ id, integration: { name }, user: req.user });
      return res.json(Response.get('Integration updated', entityUpdated));
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Something goes wrong',
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

      const { rows, count, total } = await IntegrationService.getAll({
        user: req.user,
        criterions: {
          where,
          limit,
          offset,
          order,
        }
      });

      return res.json(Response.get('Integrations list', rows, 200, { count, total, offset }));
    } catch (error) {
      return res.json(Response.get('Something goes wrong', error, 500));
    }
  }

  static async delete(req, res) {
    try {
      await IntegrationService.delete({ id: req.params.id, user: req.user });
      return res.json(Response.get('Integration deleted', {}));
    } catch (error) {
      return res.json(Response.get('Something goes wrong', error, 500));
    }
  }
}

export default IntegrationsController;