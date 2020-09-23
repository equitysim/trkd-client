const regex = new RegExp(/(bound\w*)*/gi)

/**
 *
 * Formats a bound function name
 *
 * @param {function} fn
 * @returns {string}
 */
export const formatFunc = (fn) => fn.name.replace(regex, '').trim()

/**
 *
 * Converts dashes to camelcase
 *
 * @param {string} file
 * @returns {string}
 */
export const formatFile = (file) => file.replace(/-([a-z])/g, (group) => group[1].toUpperCase())

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
    const chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash
}

/**
 *
 * @param {[ { Type: {string}, Value: {any} } ]} arr
 * @param {string} field - the requested key of the value
 * @returns {any|null}
 */
export const valueByType = (arr, field) => {
  let result
  try {
    result = arr.find(({ Type }) => Type === field)['Value']
    // TRKD uses this number to mean null
    if (result === -99999.99) {
      result = null
    }
  } catch (e) {
    result = null
  }
  return result
}

/**
 * Validate a Date object is not "Invalid Date"
 * @param {Date} date
 * @returns {boolean}
 */
export const validDate = (date) => !isNaN(date.getTime())

/**
 * Traverses down an object and safeguards to null if not found
 * eg. fn = () => object.key.deeperKey.innerKey
 * @param {function} fn
 * @returns {any|null}
 */
export const getSafe = (fn) => {
  try {
    return fn()
  } catch (e) {
    return null
  }
}
