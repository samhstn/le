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

function createDashboard () {
  var dashboard = document.createElement('dashboard');
  document.body.appendChild(dashboard);
  [].unshift.call(arguments, 'dashboard');
  riot.mount.apply(null, arguments);
}

function removeDashboard () {
  document.body.removeChild(document.querySelector('dashboard'));
}

function selectorsTextContent (tag) {
  return [].map.call(document.querySelectorAll(tag), function (t) {
    return t.textContent
  })
}

describe('dashboard', function () {
describe('initial states', function () {
  context('no opts', function () {
    before(createDashboard);
    after(removeDashboard);

    it('should only have two buttons', function () {
      expect(document.querySelectorAll('button').length)
        .to.be(2);
    });
    it('should have a logout button', function () {
      expect(document.querySelector('form > button').textContent)
        .to.be('logout');
    });
    it('should only have one div on the page', function () {
      expect(document.querySelectorAll('div').length)
        .to.be(1);
    });
    it('should have the collection_view div on the page', function () {
      expect(document.querySelector('#collection_list_id'))
        .to.be.an('object');
    });
    it('should contain a button with `Add a collection` content', function () {
      expect(document.querySelector('div > button').textContent)
        .to.be('Add a collection');
    });
  });

  context('with a single collection', function () {
    context('default collection state', function () {
      before(function () {
        createDashboard({
          collections: {
            '100': {
              collection_name: 'col1',
              collection_description: 'col1 description',
              average_score: null,
              number_of_words: 0
            }
          }
        });
      });
      after(removeDashboard);
      
      it('should have the right number of divs for one collection', function () {
        expect(document.querySelectorAll('div').length).to.be(2);
      });
      it('should display the collection name in a h4', function () {
        expect(document.querySelector('h4').textContent)
          .to.be('col1');
      });
      it('should display the collection description in a h6', function () {
        expect(document.querySelector('h6').textContent)
          .to.be('col1 description');
      })
      it('should display 0 number of words', function () {
        expect(document.querySelector('p').textContent)
          .to.be('Number of Words: 0');
      });
    });

    context('collection with words state', function () {
      before(function () {
        createDashboard();
        riot.mount('dashboard', {
          collections: {
            '100': {
              collection_name: 'col1',
              collection_description: 'col1 description',
              average_score: 5.5,
              number_of_words: 5
            }
          }
        });
      });
      after(removeDashboard);

      it('should have the right number of divs for one collection', function () {
        expect(document.querySelectorAll('div').length)
          .to.be(2);
      });
      it('should display the collection name in a h4', function () {
        expect(document.querySelector('h4').textContent)
          .to.be('col1');
      });
      it('should display the collection description in a h6', function () {
        expect(document.querySelector('h6').textContent)
          .to.be('col1 description');
      })
      it('should display the right words number and score', function () {
        expect(document.querySelector('p').textContent)
          .to.be('Average Score: 5.5, Number of Words: 5');
      });
    });
  });

  context('with two collections', function () {
    before(function () {
      createDashboard({
        collections: {
          '100': {
            collection_name: 'col1',
            collection_description: 'col1 description',
            average_score: 6.6,
            number_of_words: 3
          },
          '101': {
            collection_name: 'col2',
            collection_description: 'col2 description',
            average_score: null,
            number_of_words: 0
          }
        }
      });
    });
    after(removeDashboard);

    it('should have the right number of divs for two collections', function () {
      expect(document.querySelectorAll('div').length).to.be(3);
    });
    it('should display the collection names in a h4', function () {
      expect(selectorsTextContent('h4'))
        .to.eql([ 'col1', 'col2' ]);
    });

    it('should display the collection description in a h6', function () {
      expect(selectorsTextContent('h6'))
        .to.eql([ 'col1 description', 'col2 description' ]);
    })

    it('should display the right words number and score', function () {
      expect(selectorsTextContent('p'))
        .to.eql([ 'Average Score: 6.6, Number of Words: 3', 'Number of Words: 0' ]);
    });
  });
});
});
