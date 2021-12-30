
/**
 * Check is a string domain name is valid.
 * @param {String} domain 
 * @returns 
 */
const isValidDomain = (domain) => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9\-\.]){1,61}(?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/;
  return regex.test(domain);
};

/**
 * Check if a string is a valid IPv4 address like 127.0.0.1
 * @param {String} ipaddress 
 * @returns 
 */
function isValidIpv4(ipaddress) {
  const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ipaddress);
}

/**
 * Check if a string is a valid IPv6 address like http://127.0.0.1
 * @param {String} ipaddress 
 * @returns 
 */
function isValidIpv4WithProtocol(ipaddress) {
  let protocol = ipaddress.startsWith('http://') ? 'http://' : 'https://';

  if (hasPort(ipaddress)) {
    const cleanIp = ipaddress.replace(getPort(ipaddress), '').replace(protocol, '').replace(':', '');
    return isValidIpv4(cleanIp);
  }

  if (protocol) {
    return isValidIpv4(ipaddress.replace(protocol, ''));
  }

  return false;
}

/**
 * 
 * @param {String} url 
 * @returns 
 */
function hasPort(url) {
  const hasMultipleColon = (url.match(/:/g) || []).length;

  return hasMultipleColon > 1;
}

/**
 * 
 * @param {String} url 
 * @returns 
 */
function getPort(url) {
  return url.substring(url.lastIndexOf(':') + 1);
}

export { isValidDomain, isValidIpv4, isValidIpv4WithProtocol };