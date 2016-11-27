describe('dashboard', function () {
  context('initial state', function () {
    before(function () {
      var dashboard = document.createElement('dashboard');
      document.body.appendChild(dashboard);
      riot.mount('dashboard');
    });

    after(function () {
      document.body.removeChild(document.querySelector('dashboard'));
    });

    it('should have a logout button', function () {
      var logoutButton = document.querySelector('form > button');
      expect(logoutButton.textContent).to.be('logout');
    });

    it('should only have the collection view div on the page', function () {
      expect(document.querySelectorAll('div').length).to.be(1);
    });

    it('should contain a button with `Add a collection` content', function () {
      expect(document.querySelector('div > button').textContent).to.be('Add a collection');
    });

    it('should not display any other tags', function () {
      expect(document.querySelectorAll('form').length).to.be(1);
    });
  });
});
