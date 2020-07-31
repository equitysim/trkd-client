/**
 * Given any arrays nested many times inside other arrays flatten into one
 *
 * array = [ ['1', '2'], [ '3', ['4', 5', [ '6' ]]], '7']
 * return = [ '1', '2', '3', '4', 5', '6', '7']
 * @param {[any]} array
 * @returns {[any]}
 */
export const flatten = (arr) => arr.reduce((acc, _) => acc.concat(Array.isArray(_) ? flatten(_) : [_]), []);

export const lowerFirst = (str) => str.charAt(0).toLowerCase() + str.slice(1)

export const arrayToObject = (arr) => arr.reduce((acc, _) => ({ [_]: _ }), {})