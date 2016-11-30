describe.only('assign', function () {
  it('should merge objects into one', function () {
    expect(assign({ key1: 'value1' }, { key2: 'value2' }))
      .to.eql({ key1: 'value1', key2: 'value2' });
  });
  it('should more more than two objects into one', function () {
    expect(assign({ key1: 'value1' }, { key2: 'value2' }, { key3: 'value3' }))
      .to.eql({ key1: 'value1', key2: 'value2', key3: 'value3' });
  });
  it('should overwrite keys in an object correctly', function () {
    expect(assign({ key1: 'value1' }, { key1: 'value2'}))
      .to.eql({ key1: 'value2' });
  });
  it('should overwrite an object', function () {
    var obj = { key1: 'value1' };
    var resObj = assign(obj, { key2: 'value2' });
    expect(obj)
      .to.eql({ key1: 'value1', key2: 'value2' });
    expect(resObj)
      .to.eql({ key1: 'value1', key2: 'value2' });
  });
  it('should not overwrite objects as the second argument', function () {
    var obj = { key2: 'value2' };
    var resObj = assign({ key1: 'value1' }, obj);
    expect(obj)
      .to.eql({ key2: 'value2' });
    expect(resObj)
      .to.eql({ key1: 'value1', key2: 'value2' });
  });
  it('should not overwrite any arguments which are not the first argument', function () {
    var obj1 = { key1: 'value1' };
    var obj2 = { key2: 'value2' };
    var obj3 = { key3: 'value3' };

    var obj4 = assign(obj1, obj2, obj3);
    
    expect(obj4)
      .to.eql({ key1: 'value1', key2: 'value2', key3: 'value3' });
    expect(obj1)
      .to.eql(obj4);
    expect(obj2)
      .to.eql({ key2: 'value2' });
    expect(obj3)
      .to.eql({ key3: 'value3' });
  });
  it('should not overwrite any non first arguments when dealing with the same keys', function () {
    var obj1 = { key: 'value' };
    var obj2 = { key: 'value' };
    var obj3 = { key: 'value' };

    var obj4 = assign(obj1, obj2, obj3);

    expect(obj1)
      .to.eql(obj4);
    expect(obj2)
      .to.eql(obj4);
    expect(obj3)
      .to.eql(obj4);
    expect(obj4)
      .to.eql({ key: 'value' });
  });
});
