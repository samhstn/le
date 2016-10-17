module.exports = (cookie) => {
  JSON.parse(
    (
      Buffer.from(cookie.split('cookie=')[1], 'base64')
    ).toString()
  ).username
};
