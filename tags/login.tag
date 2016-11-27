<login>
  <h1>Login View</h1>

  Dont have an account? Register <a href="/register">here</a>

  <form action="/login" method="post">

    <label>Username: </label><input name="username" value={user} type="text" />
    <label>Password: </label><input name="password" type="password" />

    <button type="submit">SUBMIT</button>

  </form>

  <p if = { logged_out }>You have been logged out</p>
  <p if = { incorrect_pass }>Incorrect Password</p>
  <p if = { timeout }>Your session has timed out</p>
  <p if = { user_not_registered }>Username is not registered</p>

  <script>
    
    this.logged_out = opts.logged_out;
    this.incorrect_pass = opts.incorrect_pass;
    this.timeout = opts.timeout;
    this.user_not_registered = opts.user_not_registered;
    this.user = opts.user || '';

  </script>
</login>
