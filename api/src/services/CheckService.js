import axios from 'axios';
import cron from 'cron';
import { Checks } from '../models/';

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
      target: newCheck.target,
      periodToCheck: newCheck.periodToCheck,
      enabled: newCheck.enabled ? newCheck.enabled : false,
      userId: newCheck.user.userId
    };

    try {
      if (!cronTimeTable.find(item => item.label === newCheck.periodToCheck)) {
        throw ({ status: 400, message: 'periodToCheck is not valid' });
      }

      checkForCreate.periodToCheck = cronTimeTable.find(item => item.label === newCheck.periodToCheck).value;

      let entityCreated = await Checks.create(checkForCreate);
      entityCreated = JSON.parse(JSON.stringify(entityCreated));
      this.runCheck(entityCreated);
      return entityCreated;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, check) {
    try {
      const checkForUpdate = {
        target: check.target,
        periodToCheck: check.periodToCheck,
        enabled: check.enabled ? check.enabled : false
      };
      const currentCheck = await Checks.findOne({ where: { id } });

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
      return await this.getById({ id, user: check.user });
    } catch (error) {
      throw error;
    }
  }

  static async getAll(params) {
    const { criterions } = params;

    try {
      const { rows } = await Checks.findAndCountAll({ ...criterions });
      return { rows, count: rows.length };
    } catch (error) {
      throw error;
    }
  }

  static async getById({ id, user }) {

    try {
      const check = await Checks.findOne({ where: { id, userId: user.userId } });
      return check;
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
      const { target } = check;
      const dateTime = new Date();
      const dateTimeString = `${dateTime.getDate()}/${dateTime.getMonth()}/${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
      try {
        await axios.get(target, {
          timeout: 5000
        });
        console.log(`✅ ${target} is alive at ${dateTimeString}`);
      } catch (error) {
        console.log(`🔥 send alert for ${check.target} at ${dateTimeString}`);
        // send alert
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

}

export default CheckService;