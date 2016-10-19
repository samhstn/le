const tape = require('tape');

const setDefinedString = require('../../db/pg/setDefinedString.js');

tape('setDefinedString', (t) => {
  const obj = {
    key1: 'value1',
    key2: 'value2'
  };
  const str = setDefinedString(obj);

  t.equal(str, 'set key1 = $2, key2 = $3 ');
  t.end();
});
