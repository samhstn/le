module.exports = (obj) => {
  let str = 'set ';

  Object.keys(obj).forEach((key, i) => {
    str += key + ' = $' + (i + 2) + ', ';
  });

  return str.substring(0, str.length - 2) + ' ';
};
