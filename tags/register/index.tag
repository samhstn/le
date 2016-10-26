<app>
  <h1>Register View</h1>

  Have an account? Login <a href="/login">here</a>

  <form onsubmit={ register }>

    <label>Username: </label><input type="text" />
    <label>Password: </label><input type="password" />

    <button type="submit">SUBMIT</button>

  </form>

  <p style="display:{timeout}">Your session has timed out</p>

  <script>

    console.log(opts.param);

    this.timeout = (opts.param || {}).timeout ? 'inerit' : 'none';

    register (e) {
      var user = e.target[0].value
      var pass = e.target[1].value
      var payload = {
        username: user,
        password: pass
      };
      request.post('/api/register', payload, function (res) {
        console.log('Response: ', JSON.parse(res));
        window.location.href = JSON.parse(res).redirect;
      });
    }

  </script>
</app>
