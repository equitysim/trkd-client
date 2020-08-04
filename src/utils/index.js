/**
 *
 * Formats a bound function name
 *
 * @param {function} fn
 * @returns {string}
 */
export const formatFunc = (fn) => fn.name.replace('bound ', '')

/**
 *
 * Converts dashes to camelcase
 *
 * @param {string} file
 * @returns {string}
 */
export const formatFile = (file) => file.replace(/-([a-z])/g, group => group[1].toUpperCase())

/**
 * Hashes string
 *
 * @param {string} str
 * @returns {string}
 */
// https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
export const hashCode = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr
    hash |= 0
  }
  return hash
}