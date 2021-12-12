/**
 * Response for set a unique structure response
 */
class Response {

  /**
   *  Get standar object for all response
   * 
   * @param {string} message 
   * @param {object | array} data 
   * @param {number} status 
   * @param {object} pagination
   */
  static get(message, data, status = 200, pagination = null) {
    try {

      if (!this.isObject(data) && !Array.isArray(data)) {
        throw ('data param is not an object or array ');
      }

      let response = { message, data, status };

      if (pagination) {
        response.pagination = pagination;
      }

      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  /**
   * Check is a param object
   * 
   * @param {any} data 
   */
  static isObject(data) {
    return typeof data === 'object' && data !== null;
  }

}

export default Response;