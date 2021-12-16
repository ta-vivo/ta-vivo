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

}

export default IntegrationService;