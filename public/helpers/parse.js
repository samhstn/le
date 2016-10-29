(function (exp) {
  function parse(param) {
    var obj = {};

    if (!param || typeof param !== 'string') {
      return obj;
    }

    param.split('&').forEach((el) => {
      obj[el.split('=')[0]] = el.split('=')[1];
    });

    return obj;
  }

  exp.parse = parse;
})(window);
