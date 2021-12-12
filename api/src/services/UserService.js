import User from '../models/User';

class UserService {

  static async create(newUser) {
    try {
      const entityCreated = await User.create(newUser);
      return entityCreated;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, user) {
    try {
      await User.update(user, { where: { id: id } });
      return await this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  static async getAll(params) {
    const { criterions } = params;

    try {
      const { rows } = await User.findAndCountAll({ ...criterions });
      return { rows, count: rows.length };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {

    try {
      const user = await User.findOne({ where: { id } });
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const rowCount = await User.destroy({
        where: { id }
      });
      return { count: rowCount };
    } catch (error) {
      throw error;
    }
  }

}

export default UserService;