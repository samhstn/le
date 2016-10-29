<app>
  <h1>Register View</h1>

  Have an account? Login <a href="/login">here</a>

  <form action="/register" method="post">

    <label>Username: </label>
    <input name="username" type="text" value={ user || '' } />
    <label if={ unavailable_username }>
      Username Not available
    </label>

    <label>Password: </label>
    <input name="password" type="password" />

    <button type="submit">SUBMIT</button>

  </form>

  <p if={ timeout }>Your session has timed out</p>

  <script>

    var params = parse(opts.param)

    this.unavailable_username = params.unavailable_username;
    this.user = params.user;

  </script>
</app>
