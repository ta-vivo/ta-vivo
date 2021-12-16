import { Integration, PendingIntegration } from '../models';

class IntegrationService {

  static async create({newIntegration, user}) {
    try {
      const pendingIntegration = await PendingIntegration.findOne({
        where: {
          uniqueCode: newIntegration.uniqueCode
        }
      });
      if (!pendingIntegration) {
        throw ({status: 400, message: 'Integration not found'});
      }

      const integration = {
        appUserId: pendingIntegration.appUserId,
        type: pendingIntegration.integrationType,
        userId: user.userId,
        name: newIntegration.name,
      };
      const entityCreated = await Integration.create(integration);
      await pendingIntegration.destroy();
      return entityCreated;
    } catch (error) {
      throw error;
    }
  }

  static async getAll({ criterions, user}) {
    try {
      if (criterions.where) {
        criterions.where.userId = user.userId;
      } else {
        criterions.where = { userId: user.userId };
      }

      const { rows } = await Integration.findAndCountAll({ ...criterions });
      return { rows, count: rows.length };
    } catch (error) {
      throw error;
    }
  }

  static async delete({ id, user }) {
    try {
      const rowCount = await Integration.destroy({
        where: { id, userId: user.userId }
      });
      return { count: rowCount };
    } catch (error) {
      throw error;
    }
  }

}

export default IntegrationService;