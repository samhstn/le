<app>
  <h1>Register View</h1>

  <form onsubmit={ register }>

    <label>Username: </label><input type="text" />
    <label>Password: </label><input type="password" />

    <button type="submit">SUBMIT</button>

  </form>

  <script>

    register (e) {
      var user = e.target[0].value
      var pass = e.target[1].value
      var payload = {
        username: user,
        password: pass
      };
      request.post('/api/register', payload, function (res) {
        console.log('Response: ', res);
      });
    }

  </script>
</app>
