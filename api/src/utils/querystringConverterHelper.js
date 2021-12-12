import { Op } from 'sequelize';
import querystringConverter from 'sequelize-querystring-converter';
/**
 * Helper class for using with sequelize-querystring-converter dependency
 * https://github.com/perbert27/sequelize-querystring-converter#readme
 */
class querystringConverterHelper {
  /**
   * Entry point for get query string and using pagination, filters and more...
   * @param {Object} query 
   */
  static parseQuery(query) {

    let criterian = querystringConverter.convert({ query });
    criterian.where = this.parseSearch(criterian.where);
    let { where, order } = criterian;

    let page = this.getOffset(where);
    if (where){
      delete where.page;
    }

    order = querystringConverterHelper.getOrder(order);

    return { where, limit: 10, offset: page, order };
  }

  static getOffset(where) {
    if (where) {
      if (where.page) {
        return ((where.page - 1) * 10);
      }
    }
    return ((1 - 1) * 10);
  }

  /**
   * 
   * @param {Object} params
   */
  static parseSearch(where) {
    if (where) {
      if (where.search && where.where) {
        let searchValue = where.search;
        let columns = where.where.split(',');

        delete where.search;
        delete where.where;

        let like = this.getLike(searchValue, columns);

        // Set back all properties
        for (let key in where) {
          like[key] = where[key];
        }

        return like;
      }
    }

    return where;
  }

  /**
   * Convert all columns in sequelize where using like operator
   * @param {String} value 
   * @param {Array} columns 
   */
  static getLike(value, columns) {
    let result = [];

    columns.forEach(column => {
      result.push({
        [column]: {
          [Op.like]: '%' + value + '%'
        }
      });
    });

    return { [Op.or]: result };
  }

  static getOrder(order) {
    let result = [];

    if (order) {
      order.forEach((el, index) => {
        result[index] = [];
        el.forEach(name => {
          result[index].push(name.trim());
        });
      });
      return result;
    }
  }

}

export default querystringConverterHelper;