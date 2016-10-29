<app>
  <h1>Login View</h1>

  Dont have an account? Register <a href="/register">here</a>

  <form action="/login" method="post">

    <label>Username: </label><input name="username" value={user} type="text" />
    <label>Password: </label><input name="password" type="password" />

    <button type="submit">SUBMIT</button>

  </form>

  <p style="display:{logged_out}">You have been logged out</p>

  <p style="display:{incorrect_pass}">Incorrect Password</p>

  <p style="display:{timeout}">Your session has timed out</p>
  <p style="display:{user_not_registered}">Username is not registered</p>

  <script>

    var paramObj = parse(opts.param);

    this.logged_out = paramObj.logged_out ? 'inherit' : 'none';
    this.incorrect_pass = paramObj.incorrect_pass ? 'inherit' : 'none';
    this.timeout = paramObj.timeout ? 'inherit' : 'none';
    this.user_not_registered = paramObj.user_not_registered ? 'inherit' : 'none';

    this.user = paramObj.user || '';

  </script>
</app>
