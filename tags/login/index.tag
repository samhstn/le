<app>
  <h1>Login View</h1>

  Dont have an account? Register <a href="/register">here</a>

  <form onsubmit={ login }>

    <label>Username: </label><input value={user} type="text" />
    <label>Password: </label><input type="password" />

    <button type="submit">SUBMIT</button>

  </form>

  <p style="display:{logged_out}">You have been logged out</p>

  <p style="display:{incorrect_pass}">Incorrect Password</p>

  <p style="display:{timeout}">Your session has timed out</p>

  <script>

    console.log(opts.param);

    var paramObj = parse(opts.param);

    this.logged_out = paramObj.logged_out ? 'inherit' : 'none';
    this.incorrect_pass = paramObj.incorrect_pass ? 'inherit' : 'none';
    this.timeout = paramObj.timeout ? 'inherit' : 'none';
    this.user = paramObj.user || '';

    login (e) {
      var user = e.target[0].value
      var pass = e.target[1].value
      var payload = {
        username: user,
        password: pass
      };
      request.post('/api/login', payload, function (res) {
        console.log('Response: ', res);
        window.location.href = JSON.parse(res).redirect;
      });
    }

  </script>
</app>
