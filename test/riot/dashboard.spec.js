 /** Dashboard Tests Contents Page
 *
 * Each of the most nexted 'contexts'
 * should have only 1 'it' and one 'expect' assertion
 * inside of that 'it'
 *
 * describe(‘dashboard’)
 * | describe(‘initial state’)
 * | | context(‘no opts’)
 * | | context(‘single collection opts’)
 * | | context(‘two collections opts’)
 * | describe(‘new collection state’)
 * | | context(‘no opts’)
 * | | | context(‘cancel’)
 * | | | context(‘done’)
 * | | context(‘single collection opts’)
 * | | | context(‘cancel’)
 * | | | | context(‘view change’)
 * | | | | context(‘another new collection state’)
 * | | | context(‘done’)
 * | | | | context(‘view change’)
 * | | | | context(‘another new collection state’)
 * | describe(‘edit collection state’)
 * | | context(‘no opts’)
 * | | | context(‘done’)
 * | | | | context(‘no change’)
 * | | | | | context(‘view change’)
 * | | | | | context(‘another edit collection state’)
 * | | | | context(‘change’)
 * | | | | | context(‘view change’)
 * | | | | | context(‘another edit collection state’)
 * | | | context(‘cancel’)
 * | | | | context(‘no change’)
 * | | | | | context(‘view change’)
 * | | | | | context(‘another edit collection state’)
 * | | | | context(‘change’)
 * | | | | | context(‘view change’)
 * | | | | | context(‘another edit collection state’)
 * | | | context(‘delete’)
 * | | | | context(‘no change’)
 * | | | | | context(‘view change’)
 * | | | | | context(‘another edit collection state’)
 * | | | | context(‘change’)
 * | | | | | context(‘view change’)
 * | | | | | context(‘another edit collection state’)
 * | | context(‘single collection opts’)
 * | | | context(‘done’)
 * | | | | context(‘no change’)
 * | | | | | context(‘view change’)
 * | | | | | context(‘another edit collection state’)
 * | | | | context(‘change’)
 * | | | | | context(‘view change’)
 * | | | | | context(‘another edit collection state’)
 * | | | context(‘cancel’)
 * | | | | context(‘no change’)
 * | | | | | context(‘view change’)
 * | | | | | context(‘another edit collection state’)
 * | | | | context(‘change’)
 * | | | | | context(‘view change’)
 * | | | | | context(‘another edit collection state’)
 * | | | context(‘delete’)
 * | | | | context(‘no change’)
 * | | | | | context(‘view change’)
 * | | | | | context(‘another edit collection state’)
 * | | | | context(‘change’)
 * | | | | | context(‘view change’)
 * | | | | | context(‘another edit collection state’) */

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
