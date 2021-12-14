import { Checks } from '../models/';

class CheckService {

  static async create(newCheck) {
    const checkForCreate = {
      target: newCheck.target,
      periodToCheck: newCheck.periodToCheck,
      enabled: newCheck.enabled ? newCheck.enabled : false,
      userId: newCheck.user.userId
    };

    try {
      const entityCreated = await Checks.create(checkForCreate);
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
      // eslint-disable-next-line no-prototype-builtins
      if (check.hasOwnProperty('enabled')) {
        checkForUpdate.enabled = check.enabled;
      }
      await Checks.update(checkForUpdate, { where: { id: id } });
      return await this.getById({id, user: check.user});
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

  static async getById({id, user}) {

    try {
      const check = await Checks.findOne({ where: { id, userId: user.userId } });
      return check;
    } catch (error) {
      throw error;
    }
  }

  static async delete({id, user}) {
    try {
      const rowCount = await Checks.destroy({
        where: { id, userId: user.userId }
      });
      return { count: rowCount };
    } catch (error) {
      throw error;
    }
  }

}

export default CheckService;