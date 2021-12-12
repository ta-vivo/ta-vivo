import {Check} from '../models/';

class CheckService {

  static async create(newUser) {
    try {
      const entityCreated = await Check.create(newUser);
      return entityCreated;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, user) {
    try {
      await Check.update(user, { where: { id: id } });
      return await this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  static async getAll(params) {
    const { criterions } = params;

    try {
      const { rows } = await Check.findAndCountAll({ ...criterions });
      return { rows, count: rows.length };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {

    try {
      const check = await Check.findOne({ where: { id } });
      return check;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const rowCount = await Check.destroy({
        where: { id }
      });
      return { count: rowCount };
    } catch (error) {
      throw error;
    }
  }

}

export default CheckService;