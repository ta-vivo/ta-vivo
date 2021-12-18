import axios from 'axios';
import cron from 'cron';
import { Checks, CheckLogs, CheckIntegration, Integration } from '../models/';
import TelegramService from './TelegramService';
import { Op } from 'sequelize';

const cronTimeTable = [
  { label: '10s', value: '*/10 * * * * *' },
  { label: '30s', value: '*/30 * * * * *' },
  { label: '1m', value: '* * * * *' },
  { label: '5m', value: '*/5 * * * *' },
  { label: '10m', value: '*/10 * * * *' },
  { label: '30m', value: '*/30 * * * *' },
  { label: '1h', value: '* */1 * * *' },
  { label: '2h', value: '* */2 * * *' },
  { label: '12h', value: '* */12 * * *' },
];

let cronJobs = {};

class CheckService {

  static async create(newCheck) {
    const checkForCreate = {
      name: newCheck.name,
      target: newCheck.target,
      periodToCheck: newCheck.periodToCheck,
      enabled: newCheck.enabled ? newCheck.enabled : false,
      userId: newCheck.user.userId
    };

    try {
      if (!cronTimeTable.find(item => item.label === newCheck.periodToCheck)) {
        throw ({ status: 400, message: 'periodToCheck is not valid' });
      }

      const periodToCheck = cronTimeTable.find(item => item.label === newCheck.periodToCheck).value;
      if (!periodToCheck) {
        throw ({ status: 400, message: 'periodToCheck is not valid' });
      }

      const exists = await this.isTargetExists(checkForCreate.target, checkForCreate.userId);
      if (exists) {
        throw ({ status: 400, message: 'Target already exists' });
      }

      checkForCreate.periodToCheck = periodToCheck;
      checkForCreate.periodToCheckLabel = cronTimeTable.find(item => item.label === newCheck.periodToCheck).label;

      let entityCreated = await Checks.create(checkForCreate);
      entityCreated = JSON.parse(JSON.stringify(entityCreated));

      if (newCheck.addIntegrations) {
        this.addIntegrations(entityCreated.id, newCheck.addIntegrations);
      }

      this.runCheck(entityCreated);
      return entityCreated;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, check, user) {
    try {
      const checkForUpdate = {
        target: check.target,
        periodToCheck: check.periodToCheck,
        enabled: check.enabled ? check.enabled : false
      };

      if (check.name) {
        checkForUpdate.name = check.name;
      }

      const periodToCheck = cronTimeTable.find(item => item.label === check.periodToCheck).value;
      if (!periodToCheck) {
        throw ({ status: 400, message: 'periodToCheck is not valid' });
      }

      checkForUpdate.periodToCheck = periodToCheck;
      checkForUpdate.periodToCheckLabel = cronTimeTable.find(item => item.label === checkForUpdate.periodToCheck).label;

      let currentCheck = await Checks.findOne({ where: { id } });
      currentCheck = JSON.parse(JSON.stringify(currentCheck));

      // eslint-disable-next-line no-prototype-builtins
      if (check.hasOwnProperty('enabled')) {
        checkForUpdate.enabled = check.enabled;
        if (check.enabled === true && currentCheck.enabled === false) {
          this.runCheck(currentCheck);
        } else if (check.enabled === false && currentCheck.enabled === true) {
          this.stopCheck(currentCheck);
        }
      }

      await Checks.update(checkForUpdate, { where: { id: id } });

      if (check.addIntegrations) {
        this.addIntegrations(id, check.addIntegrations);
      }

      if (check.removeIntegrations) {
        this.removeIntegrations(id, check.removeIntegrations);
      }

      let checkUpdated = await this.getById({ id, user });
      checkUpdated = JSON.parse(JSON.stringify(checkUpdated));

      if (checkForUpdate.target !== currentCheck.target) {
        this.stopCheck(currentCheck);
        this.runCheck(checkUpdated);
      }
      return checkUpdated;
    } catch (error) {
      throw error;
    }
  }

  static async getAll(params) {
    const { criterions } = params;

    try {
      const { rows } = await Checks.findAndCountAll({
        ...criterions,
        include: [{ model: CheckIntegration, include: [{ model: Integration }] }]
      });
      return { rows, count: rows.length };
    } catch (error) {
      throw error;
    }
  }

  static async getById({ id, user }) {

    try {
      const check = await Checks.findOne({
        where: { id, userId: user.userId },
        include: [{ model: CheckIntegration, include: [{ model: Integration }] }]
      });
      return check;
    } catch (error) {
      throw error;
    }
  }

  static async getLogsByCheckId({ id, criterions }) {

    try {
      if (criterions.where) {
        criterions.where.checkId = Number(id);
      } else {
        criterions.where = { checkId: Number(id) };
      }
      const { rows } = await CheckLogs.findAndCountAll({
        ...criterions
      });
      return { rows, count: rows.length };
    } catch (error) {
      throw error;
    }
  }

  static async delete({ id, user }) {
    try {
      const check = await Checks.findOne({ where: { id, userId: user.userId } });
      const rowCount = await Checks.destroy({
        where: { id, userId: user.userId }
      });
      // stop cron job
      this.stopCheck(check);
      return { count: rowCount };
    } catch (error) {
      throw error;
    }
  }

  static runCheck(check) {
    const cronJob = new cron.CronJob(check.periodToCheck, async () => {
      const { id, target, userId } = check;
      const dateTime = new Date();
      const dateTimeString = `${dateTime.getDate()}/${dateTime.getMonth()}/${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
      try {
        await axios.get(target, {
          timeout: 5000
        });
        console.log(`✅ ${target} is alive at ${dateTimeString}`);
        CheckLogs.create({
          checkId: id,
          status: 'up'
        });
      } catch (error) {
        CheckLogs.create({
          checkId: id,
          status: 'down'
        });

        const mostUpdatedCheck = await this.getById({ id: id, user: { userId } });
        mostUpdatedCheck.check_integrations.forEach(async (integrationCheck) => {
          if (integrationCheck.integration.type === 'telegram') {
            TelegramService.sendMessage({
              userId: integrationCheck.integration.appUserId,
              message: `🚨 ${target} is down at ${dateTimeString}`
            });
          }
        });
        console.log(`🔥 send alert for ${target} at ${dateTimeString}`);
      }
    });
    cronJobs = { ...cronJobs, [check.id]: cronJob };
    cronJob.start();
  }

  static stopCheck(check) {
    const cronJob = cronJobs[check.id];
    if (cronJob) {
      console.log(`stop cron job for ${check.target}`);
      cronJob.stop();
    }
  }

  static async addIntegrations(checkId, integrations) {
    const integrationsToAdd = integrations.map(integration => {
      return {
        checkId: checkId,
        integrationId: integration.id
      };
    });
    await CheckIntegration.bulkCreate(integrationsToAdd);
    return;
  }

  static async removeIntegrations(checkId, integrations) {
    const integrationsToRemove = integrations.map(integration => {
      return {
        checkId: checkId,
        integrationId: integration.id
      };
    });
    await CheckIntegration.destroy({
      where: {
        checkId: checkId,
        integrationId: integrationsToRemove.map(item => item.integrationId)
      }
    });
    return;
  }

  static async isTargetExists(target, userId) {
    const exits = await Checks.findOne({
      where: {
        target: {
          [Op.like]: `%${target}%`
        },
        userId
      }
    });
    return exits ? true : false;
  }

}

export default CheckService;