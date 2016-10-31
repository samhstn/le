((exp) => {
  const request = (method, url, payload, cb) => {
    const xhr = new XMLHttpRequest();
    const payloadString = JSON.stringify(payload);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        cb(xhr.responseText);
      }
    };
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(payloadString);
  };

  const get = (url, cb) => request('GET', url, null, cb);
  const post = (url, payload, cb) => request('POST', url, payload, cb);
  const put = (url, payload, cb) => request('PUT', url, payload, cb); 
  const del = (url, cb) => request('DELETEE', url, null, cb);

  exp.request = {
    get,
    post,
    put,
    del
  };
})(window);
