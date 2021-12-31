import { Integration, Checks, CheckLogs } from '../models';
import { Op } from 'sequelize';

class DashboardService {

  static async get(user) {
    try {

      const data = {};

      data.integrations = await Integration.count({
        where: {
          userId: user.userId
        }
      });

      data.checks = await Checks.count({
        where: {
          userId: user.userId
        }
      });

      data.recentActivity = await CheckLogs.findAll({
        include: [
          {
            model: Checks,
            attributes: ['name', 'id'],
            where: {
              userId: user.userId
            }
          }
        ],
        limit: 5,
        order: [
          ['createdAt', 'DESC']
        ]
      });

      data.lastLog = data.recentActivity[0];

      // Last issus found in 1 hour
      data.mostRecentIncident = await CheckLogs.findOne({
        where: {
          status: 'down',
          createdAt: {
            [Op.gt]: new Date(Date.now() - (60 * 60 * 1000))
          }
        },
        include: [
          {
            model: Checks,
            attributes: ['name', 'id'],
            where: {
              userId: user.userId
            }
          }
        ],
        limit: 1,
        order: [
          ['createdAt', 'DESC']
        ]
      });

      data.mostRecentIncident = data.mostRecentIncident ? data.mostRecentIncident : {};

      return data;
    } catch (error) {
      throw error;
    }
  }

}

export default DashboardService;