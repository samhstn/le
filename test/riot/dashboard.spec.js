 /** Dashboard Tests Contents Page
 *
 * Each of the most nexted 'contexts'
 * should have only 1 'it' and one 'expect' assertion
 * inside of that 'it'
 *
 * describe('dashboard')
 * | describe('initial state') [x]
 * | | context('no opts') [x]
 * | | context('with a single collection') [x]
 * | | | context('default collection state') [x]
 * | | | context('collection with words state') [x]
 * | | context('with two collections') [x]
 * | describe('create a new collection') [x]
 * | | context('no opts') [x]
 * | | | context('change view') [x]
 * | | | context('cancel') [x]
 * | | | | context('another new collection state') [x]
 * | | | context('done') [x]
 * | | | | context('another new collection state') [x]
 * | | context('single collection opts') [x]
 * | | | context('change view') [x]
 * | | | context('cancel') [x]
 * | | | | context('another new collection state') [x]
 * | | | context('done') [x]
 * | | | | context('another new collection state') [x]
 * | describe('edit collection state') []
 * | | context('no opts') []
 * | | | context('done') []
 * | | | | context('no change') []
 * | | | | | context('view change') []
 * | | | | | context('another edit collection state') []
 * | | | | context('change') []
 * | | | | | context('view change') []
 * | | | | | context('another edit collection state') []
 * | | | context('cancel') []
 * | | | | context('no change') []
 * | | | | | context('view change') []
 * | | | | | context('another edit collection state') []
 * | | | | context('change') []
 * | | | | | context('view change') []
 * | | | | | context('another edit collection state') []
 * | | | context('delete') []
 * | | | | context('no change') []
 * | | | | | context('view change') []
 * | | | | | context('another edit collection state') []
 * | | | | context('change') []
 * | | | | | context('view change') []
 * | | | | | context('another edit collection state') []
 * | | context('single collection opts') []
 * | | | context('done') []
 * | | | | context('no change') []
 * | | | | | context('view change') []
 * | | | | | context('another edit collection state') []
 * | | | | context('change') []
 * | | | | | context('view change') []
 * | | | | | context('another edit collection state') []
 * | | | context('cancel') []
 * | | | | context('no change') []
 * | | | | | context('view change') []
 * | | | | | context('another edit collection state') []
 * | | | | context('change') []
 * | | | | | context('view change') []
 * | | | | | context('another edit collection state') []
 * | | | context('delete') []
 * | | | | context('no change') []
 * | | | | | context('view change') []
 * | | | | | context('another edit collection state') []
 * | | | | context('change') []
 * | | | | | context('view change') []
 * | | | | | context('another edit collection state') [] */

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

describe('create a new collection', function () {
  context('no initial collections', function () {
    context('should change view', function () {
      before(function () {
        createDashboard();
        document.querySelectorAll('button')[1].click(); // Add a collection
      });
      after(removeDashboard);

      it('should no longer show the collection_list_id', function () {
        expect(document.querySelector('#collection_list_id'))
          .to.be.null;
      });
      it('should show the new_collection_id', function () {
        expect(document.querySelector('#new_collection_id'))
          .to.be.an('object');
      });
      it('should have two empty input boxes', function () {
        expect(selectorsTextContent('input'))
          .to.eql(['', '']);
      });
    });

    context('cancel button', function () {
      before(function () {
        createDashboard();
        document.querySelectorAll('button')[1].click(); // Add new collection
        document.querySelectorAll('input')[0].value = 'col name'; // name input
        document.querySelectorAll('input')[1].value = 'col description'; // desc input
        document.querySelectorAll('button')[2].click(); // cancel
      });

      after(removeDashboard);

      context('should change view', function () {
        it('should not show the create new collection view', function () {
          expect(document.querySelector('#new_colleciton_id'))
            .to.be.null;
        });
        it('should show the collection view', function () {
          expect(document.querySelector('#collection_list_id'))
            .to.be.an('object');
        });
      });

      context('should not have a changed state for creating a new collection', function () {
        before(function () {
          document.querySelectorAll('button')[1].click(); // Add new collection
        });

        it('should no longer show the collection_list_id', function () {
          expect(document.querySelector('#collection_list_id'))
            .to.be.null;
        });
        it('should show the new_collection_id', function () {
          expect(document.querySelector('#new_collection_id'))
            .to.be.an('object');
        });
        it('should have two empty input boxes', function () {
          expect(selectorsTextContent('input'))
            .to.eql(['', '']);
        });
      });
    });

    context('done button', function () {
      var get, post;
      before(function () {
        get = sinon.stub(request, 'get', function (url, cb) {
          cb({
            collections:{
              '100': {
                collection_name: 'col name',
                collection_description: 'col description',
                average_score: null,
                number_of_words: 0
              }
            }
          });
        });
        post = sinon.stub(request, 'post', function (url, payload, cb) { cb(); });
        createDashboard();
        document.querySelectorAll('button')[1].click(); // Add new collection
        document.querySelectorAll('input')[0].value = 'col name'; // name input
        document.querySelectorAll('input')[1].value = 'col description'; // desc input
        document.querySelectorAll('button')[1].click(); // done
      });
      after(function () {
        removeDashboard();
        get.restore();
        post.restore();
      });

      context('send requests', function () {
        it('should send a get request', function () {
          expect(get.callCount)
            .to.be(1);
        });
        it('should have been called with "/api/collection"', function () {
          expect(get.getCall(0).args[0])
            .to.be('/api/collection');
        });
        it('should send a post request', function () {
          expect(post.callCount)
            .to.be(1);
        });
        it('should have been called with "/api/collection" and the correct payload', function () {
          expect(post.getCall(0).args.slice(0, 2))
            .to.eql([
              '/api/collection',
              { collection_name: 'col name', collection_description: 'col description' }
            ]);
        });
        it('should have called post before get', function () {
          expect(post.calledBefore(get))
            .to.be(true);
        });
      });

      context('change view and display new collection', function () {
        it('should not show the create new collection view', function () {
          expect(document.querySelector('#new_colleciton_id'))
            .to.be.null;
        });
        it('should show the collection view', function () {
          expect(document.querySelector('#collection_list_id'))
            .to.be.an('object');
        });
        it('should show the created collection name', function () {
          expect(selectorsTextContent('h4'))
            .to.eql(['col name']);
        });
        it('should show the created collection description', function () {
          expect(selectorsTextContent('h6'))
            .to.eql(['col description']);
        });
        it('should show the created collection name', function () {
          expect(selectorsTextContent('p'))
            .to.eql(['Number of Words: 0']);
        });
      });

      context('should not have a changed state for creating a new collection', function () {
        before(function () {
          document.querySelectorAll('button')[1].click(); // Add new collection
        });

        it('should no longer show the collection_list_id', function () {
          expect(document.querySelector('#collection_list_id'))
            .to.be.null;
        });
        it('should show the new_collection_id', function () {
          expect(document.querySelector('#new_collection_id'))
            .to.be.an('object');
        });
        it('should have two empty input boxes', function () {
          expect(selectorsTextContent('input'))
            .to.eql(['', '']);
        });
      });
    });
  });

  context('with single initial collection', function () {
    context('should change view', function () {
      before(function () {
        createDashboard({
          collections: {
            '100': {
              collection_name: 'initial col name',
              collection_description: 'initial col description',
              average_score: null,
              number_of_words: 0
            }
          }
        });
        document.querySelectorAll('button')[1].click(); // Add a collection
      });
      after(removeDashboard);

      it('should no longer show the collection_list_id', function () {
        expect(document.querySelector('#collection_list_id'))
          .to.be.null;
      });
      it('should show the new_collection_id', function () {
        expect(document.querySelector('#new_collection_id'))
          .to.be.an('object');
      });
      it('should have two empty input boxes', function () {
        expect(selectorsTextContent('input'))
          .to.eql(['', '']);
      });
    });

    context('cancel button', function () {
      before(function () {
        createDashboard({
          collections: {
            '100': {
              collection_name: 'initial col name',
              collection_description: 'initial col description',
              average_score: null,
              number_of_words: 0
            }
          }
        });
        document.querySelectorAll('button')[1].click(); // Add a collection
        document.querySelectorAll('input')[0].value = 'col name'; // name input
        document.querySelectorAll('input')[1].value = 'col description'; // desc input
        document.querySelectorAll('button')[2].click(); // cancel
      });
      after(removeDashboard);

      context('should change view', function () {
        it('should not show the create new collection view', function () {
          expect(document.querySelector('#new_colleciton_id'))
            .to.be.null;
        });
        it('should show the collection view', function () {
          expect(document.querySelector('#collection_list_id'))
            .to.be.an('object');
        });
        it('should show a single collection name in a h4', function () {
          expect(selectorsTextContent('h4'))
            .to.eql(['initial col name']);
        });
        it('should show a single collection description in a h6', function () {
          expect(selectorsTextContent('h6'))
            .to.eql(['initial col description']);
        });
        it('should show the created collection name', function () {
          expect(selectorsTextContent('p'))
            .to.eql(['Number of Words: 0']);
        });
      });

      context('should not have a changed state for creating a new collection', function () {
        before(function () {
          document.querySelectorAll('button')[1].click(); // Add new collection
        });

        it('should no longer show the collection_list_id', function () {
          expect(document.querySelector('#collection_list_id'))
            .to.be.null;
        });
        it('should show the new_collection_id', function () {
          expect(document.querySelector('#new_collection_id'))
            .to.be.an('object');
        });
        it('should have two empty input boxes', function () {
          expect(selectorsTextContent('input'))
            .to.eql(['', '']);
        });
      });
    });

    context('done button', function () {
      var get, post;
      before(function () {
        get = sinon.stub(request, 'get', function (url, cb) {
          cb({
            collections:{
              '100': {
                collection_name: 'initial col name',
                collection_description: 'initial col description',
                average_score: null,
                number_of_words: 0
              },
              '101': {
                collection_name: 'col name',
                collection_description: 'col description',
                average_score: null,
                number_of_words: 0
              }
            }
          });
        });
        post = sinon.stub(request, 'post', function (url, payload, cb) { cb(); });
        createDashboard({
          collections: {
            '100': {
              collection_name: 'initial col name',
              collection_description: 'initial col description',
              average_score: null,
              number_of_words: 0
            }
          }
        });
        document.querySelectorAll('button')[1].click(); // Add new collection
        document.querySelectorAll('input')[0].value = 'col name'; // name input
        document.querySelectorAll('input')[1].value = 'col description'; // desc input
        document.querySelectorAll('button')[1].click(); // done
      });
      after(function () {
        removeDashboard();
        get.restore();
        post.restore();
      });

      context('send requests', function () {
        it('should send a get request', function () {
          expect(get.callCount)
            .to.be(1);
        });
        it('should have been called with "/api/collection"', function () {
          expect(get.getCall(0).args[0])
            .to.be('/api/collection');
        });
        it('should send a post request', function () {
          expect(post.callCount)
            .to.be(1);
        });
        it('should have been called with "/api/collection" and the correct payload', function () {
          expect(post.getCall(0).args.slice(0, 2))
            .to.eql([
              '/api/collection',
              { collection_name: 'col name', collection_description: 'col description' }
            ]);
        });
        it('should have called post before get', function () {
          expect(post.calledBefore(get))
            .to.be(true);
        });
      });

      context('change view and display new collection', function () {
        it('should not show the create new collection view', function () {
          expect(document.querySelector('#new_colleciton_id'))
            .to.be.null;
        });
        it('should show the collection view', function () {
          expect(document.querySelector('#collection_list_id'))
            .to.be.an('object');
        });
        it('should show the correct collection names', function () {
          expect(selectorsTextContent('h4'))
            .to.eql(['initial col name', 'col name']);
        });
        it('should show the created collection description', function () {
          expect(selectorsTextContent('h6'))
            .to.eql(['initial col description', 'col description']);
        });
        it('should show the created collection name', function () {
          expect(selectorsTextContent('p'))
            .to.eql(['Number of Words: 0', 'Number of Words: 0']);
        });
      });

      context('should not have a changed state for creating a new collection', function () {
        before(function () {
          document.querySelectorAll('button')[1].click(); // Add new collection
        });

        it('should no longer show the collection_list_id', function () {
          expect(document.querySelector('#collection_list_id'))
            .to.be.null;
        });
        it('should show the new_collection_id', function () {
          expect(document.querySelector('#new_collection_id'))
            .to.be.an('object');
        });
        it('should have two empty input boxes', function () {
          expect(selectorsTextContent('input'))
            .to.eql(['', '']);
        });
      });
    });
  });
});
});
