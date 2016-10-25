const tape = require('tape');

const setDefinedValues = require('../../db/pg/setDefinedValues.js');

tape('setDefinedValues', (t) => {
  const obj = {
    key1: 'value1',
    key2: 'value2'
  };
  const val = setDefinedValues(obj);

  t.deepEqual(val, ['value1', 'value2'], 'JPubxOUd5q');
  t.end();
});
