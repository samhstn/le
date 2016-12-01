function createDashboard () {
  var dashboard = document.createElement('dashboard');
  document.body.appendChild(dashboard);
  [].unshift.call(arguments, 'dashboard');
  riot.mount.apply(null, arguments);
}

function removeDashboard () {
  document.body.removeChild(document.querySelector('dashboard'));
}

function selectors (method) {
  return function (tag) {
    return [].map.call(document.querySelectorAll(tag), function (t) {
      return t[method];
    })
  }
}

var selectorsTextContent = selectors('textContent');
var selectorsValue = selectors('value');
var get, post, put;

describe('createDashboard', function () {
  context('with no arg', function () {
    var mount, createElement, appendChild;
    before(function () {
      mount = sinon.stub(riot, 'mount');
      createElement = sinon.stub(document, 'createElement').returns('child elem');
      appendChild = sinon.stub(document.body, 'appendChild');
      createDashboard();
    });
    after(function () {
      mount.restore();
      createElement.restore();
      appendChild.restore();
    });
    it('should have called createElement once', function () {
      expect(createElement.callCount)
        .to.be(1);
    });
    it('should have called createElement on "dashboard"', function () {
      expect(createElement.getCall(0).args)
        .to.eql(['dashboard']);
    });
    it('should have called appendChild once', function () {
      expect(appendChild.callCount)
        .to.be(1);
    });
    it('should have called appendChild on "child elem"', function () {
      expect(appendChild.getCall(0).args)
        .to.eql(['child elem']);
    });
    it('should have called riot.mount once', function () {
      expect(mount.callCount)
        .to.be(1);
    });
    it('should have called riot.mount with "dashboard" as its arg', function () {
      expect(mount.getCall(0).args)
        .to.eql(['dashboard']);
    });
  });

  context('with single arg', function () {
    var mount, createElement, appendChild;
    before(function () {
      mount = sinon.stub(riot, 'mount');
      createElement = sinon.stub(document, 'createElement').returns('child elem');
      appendChild = sinon.stub(document.body, 'appendChild');
      createDashboard({ collection: 'collection' });
    });
    after(function () {
      mount.restore();
      createElement.restore();
      appendChild.restore();
    });
    it('should have called createElement once', function () {
      expect(createElement.callCount)
        .to.be(1);
    });
    it('should have called createElement on "dashboard"', function () {
      expect(createElement.getCall(0).args)
        .to.eql(['dashboard']);
    });
    it('should have called appendChild once', function () {
      expect(appendChild.callCount)
        .to.be(1);
    });
    it('should have called appendChild on "child elem"', function () {
      expect(appendChild.getCall(0).args)
        .to.eql(['child elem']);
    });
    it('should have called riot.mount once', function () {
      expect(mount.callCount)
        .to.be(1);
    });
    it('should have called riot.mount with "dashboard" as its arg', function () {
      expect(mount.getCall(0).args)
        .to.eql(['dashboard', { collection: 'collection' }]);
    });
  });

  context('called multiple times', function () {
    var mount, createElement, appendChild;
    before(function () {
      mount = sinon.stub(riot, 'mount');
      createElement = sinon.stub(document, 'createElement').returns('child elem');
      appendChild = sinon.stub(document.body, 'appendChild');
      createDashboard({ collection: 'collection' });
      createDashboard({ collection1: 'collection1' });
      createDashboard({ collectionAnother: 'collectionAnother', collection2: 'collection2' });
    });
    after(function () {
      mount.restore();
      createElement.restore();
      appendChild.restore();
    });
    it('should have called createElement three times', function () {
      expect(createElement.callCount)
        .to.be(3);
    });
    it('should have called createElement on "dashboard"', function () {
      expect([
        createElement.getCall(0).args[0],
        createElement.getCall(1).args[0],
        createElement.getCall(2).args[0]
      ]).to.eql(['dashboard', 'dashboard', 'dashboard']);
    });
    it('should have called appendChild three times', function () {
      expect(appendChild.callCount)
        .to.be(3);
    });
    it('should have called appendChild on "child elem"', function () {
      expect([
        appendChild.getCall(0).args[0],
        appendChild.getCall(1).args[0],
        appendChild.getCall(2).args[0]
      ]).to.eql(['child elem', 'child elem', 'child elem']);
    });
    it('should have called riot.mount once', function () {
      expect(mount.callCount)
        .to.be(3);
    });
    it('should have called riot.mount with "dashboard" as its arg', function () {
      expect([
        mount.getCall(0).args,
        mount.getCall(1).args,
        mount.getCall(2).args
      ]).to.eql([
        ['dashboard', { collection: 'collection' }],
        ['dashboard', { collection1: 'collection1' }],
        ['dashboard', { collectionAnother: 'collectionAnother', collection2: 'collection2' }]
      ]);
    });
  });

  context('does not mutate the object passed into it', function () {
    var mount, createElement, appendChild;
    var data1 = { collection1: 'collection1' };
    var data2 = { collection: 'collection', collection2: 'collection2' };
    var data3 = { collection: 'collection' };
    before(function () {
      mount = sinon.stub(riot, 'mount');
      createElement = sinon.stub(document, 'createElement').returns('child elem');
      appendChild = sinon.stub(document.body, 'appendChild');
      createDashboard(data1);
      createDashboard(data2);
      createDashboard(data3);
    });
    after(function () {
      mount.restore();
      createElement.restore();
      appendChild.restore();
    });
    
    it('should have called createElement three times', function () {
      expect(createElement.callCount)
        .to.be(3);
    });
    it('should have called createElement on "dashboard"', function () {
      expect([
        createElement.getCall(0).args[0],
        createElement.getCall(1).args[0],
        createElement.getCall(2).args[0]
      ]).to.eql(['dashboard', 'dashboard', 'dashboard']);
    });
    it('should have called appendChild three times', function () {
      expect(appendChild.callCount)
        .to.be(3);
    });
    it('should have called appendChild on "child elem"', function () {
      expect([
        appendChild.getCall(0).args[0],
        appendChild.getCall(1).args[0],
        appendChild.getCall(2).args[0]
      ]).to.eql(['child elem', 'child elem', 'child elem']);
    });
    it('should have called riot.mount once', function () {
      expect(mount.callCount)
        .to.be(3);
    });
    it('should have called riot.mount with "dashboard" as its arg', function () {
      expect([
        mount.getCall(0).args,
        mount.getCall(1).args,
        mount.getCall(2).args
      ]).to.eql([
        ['dashboard', { collection1: 'collection1' }],
        ['dashboard', { collection: 'collection', collection2: 'collection2' }],
        ['dashboard', { collection: 'collection' }]
      ]);
    });
    it('should not have mutated data1', function () {
      expect(data1)
        .to.eql({ collection1: 'collection1' });
    });
    it('should not have mutated data2', function () {
      expect(data2)
        .to.eql({ collection: 'collection', collection2: 'collection2' });
    });
    it('should not have mutated data3', function () {
      expect(data3)
        .to.eql({ collection: 'collection' });
    });
  });
});

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
        .to.be('Logout');
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
        createDashboard(mock_opts.one_default_collection);
      });
      after(removeDashboard);
      
      it('should have the right number of divs for one collection', function () {
        expect(document.querySelectorAll('div').length).to.be(2);
      });
      it('should display the collection name in a h4', function () {
        expect(document.querySelector('h4').textContent)
          .to.be('col name');
      });
      it('should display the collection description in a h6', function () {
        expect(document.querySelector('h6').textContent)
          .to.be('col description');
      })
      it('should display 0 number of words', function () {
        expect(document.querySelector('p').textContent)
          .to.be('Number of Words: 0');
      });
    });

    context('collection with words state', function () {
      before(function () {
        createDashboard(mock_opts.one_collection_w_words);
      });
      after(removeDashboard);

      it('should have the right number of divs for one collection', function () {
        expect(document.querySelectorAll('div').length)
          .to.be(2);
      });
      it('should display the collection name in a h4', function () {
        expect(document.querySelector('h4').textContent)
          .to.be('col name');
      });
      it('should display the collection description in a h6', function () {
        expect(document.querySelector('h6').textContent)
          .to.be('col description');
      })
      it('should display the right words number and score', function () {
        expect(document.querySelector('p').textContent)
          .to.be('Average Score: 6.6, Number of Words: 3');
      });
    });
  });

  context('with two collections', function () {
    before(function () {
      createDashboard(mock_opts.two_collections_w_words);
    });
    after(removeDashboard);

    it('should have the right number of divs for two collections', function () {
      expect(document.querySelectorAll('div').length).to.be(3);
    });
    it('should display the collection names in a h4', function () {
      expect(selectorsTextContent('h4'))
        .to.eql([ 'col name', 'col2 name' ]);
    });

    it('should display the collection description in a h6', function () {
      expect(selectorsTextContent('h6'))
        .to.eql([ 'col description', 'col2 description' ]);
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
        expect(selectorsValue('input'))
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
          expect(selectorsValue('input'))
            .to.eql(['', '']);
        });
      });
    });

    context('done button', function () {
      before(function () {
        get = sinon.stub(request, 'get', function (url, cb) {
          cb(mock_responses.get['/collection'].one_default_collection);
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
          expect(selectorsValue('input'))
            .to.eql(['', '']);
        });
      });
    });
  });

  context('with single initial collection', function () {
    context('should change view', function () {
      before(function () {
        createDashboard(mock_opts.one_default_collection);
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
        expect(selectorsValue('input'))
          .to.eql(['', '']);
      });
    });

    context('cancel button', function () {
      before(function () {
        createDashboard(mock_opts.one_default_collection);
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
            .to.eql(['col name']);
        });
        it('should show a single collection description in a h6', function () {
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
          expect(selectorsValue('input'))
            .to.eql(['', '']);
        });
      });
    });

    context('done button', function () {
      context('send requests', function () {
        before(function () {
          get = sinon.stub(request, 'get', function (url, cb) {
            cb(mock_responses.get['/collection'].two_default_collections);
          });
          post = sinon.stub(request, 'post', function (url, payload, cb) { cb(); });
          createDashboard(mock_opts.one_default_collection);
          document.querySelectorAll('button')[1].click(); // Add new collection
          document.querySelectorAll('input')[0].value = 'col2 name'; // name input
          document.querySelectorAll('input')[1].value = 'col2 description'; // desc input
          document.querySelectorAll('button')[1].click(); // done
        });
        after(function () {
          removeDashboard();
          get.restore();
          post.restore();
        });

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
              { collection_name: 'col2 name', collection_description: 'col2 description' }
            ]);
        });
        it('should have called post before get', function () {
          expect(post.calledBefore(get))
            .to.be(true);
        });
      });

      context('change view and display new collection', function () {
        before(function () {
          get = sinon.stub(request, 'get', function (url, cb) {
            cb(mock_responses.get['/collection'].two_default_collections);
          });
          post = sinon.stub(request, 'post', function (url, payload, cb) { cb(); });
          createDashboard(mock_opts.one_default_collection);
          document.querySelectorAll('button')[1].click(); // Add new collection
          document.querySelectorAll('input')[0].value = 'col2 name'; // name input
          document.querySelectorAll('input')[1].value = 'col2 description'; // desc input
          document.querySelectorAll('button')[1].click(); // done
        });
        after(function () {
          removeDashboard();
          get.restore();
          post.restore();
        });

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
            .to.eql(['col name', 'col2 name']);
        });
        it('should show the created collection description', function () {
          expect(selectorsTextContent('h6'))
            .to.eql(['col description', 'col2 description']);
        });
        it('should show the created collection name', function () {
          expect(selectorsTextContent('p'))
            .to.eql(['Number of Words: 0', 'Number of Words: 0']);
        });
      });

      context('should not have a changed state for creating a new collection', function () {
        before(function () {
          get = sinon.stub(request, 'get', function (url, cb) {
            cb(mock_responses.get['/collection'].two_default_collections);
          });
          post = sinon.stub(request, 'post', function (url, payload, cb) { cb(); });
          createDashboard(mock_opts.one_default_collection);
          document.querySelectorAll('button')[1].click(); // Add new collection
          document.querySelectorAll('input')[0].value = 'col2 name'; // name input
          document.querySelectorAll('input')[1].value = 'col2 description'; // desc input
          document.querySelectorAll('button')[1].click(); // done
          document.querySelectorAll('button')[1].click(); // Add new collection
        });
        after(function () {
          removeDashboard();
          get.restore();
          post.restore();
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
          expect(selectorsValue('input'))
            .to.eql(['', '']);
        });
      });
    });
  });
});

/* | describe('editing a collection') []
 * | | context('without initial words') []
 * | | | context('initial state') []
 * | | | context('done') []
 * | | | | context('after editing the collection name') []
 * | | | | context('after adding and removing a word') []
 * | | | | context('after adding a word') []
 * | | | context('cancel') []
 * | | | | context('after editing the collection name') []
 * | | | | context('after adding and removing a word') []
 * | | | | context('after adding a word') []
 * | | | context('delete') []
 * | | context('with an initial word') []
 * | | | context('initial state') []
 * | | | context('done') []
 * | | | | context('after editing the collection name') []
 * | | | | context('after adding and removing a word') []
 * | | | | context('after adding a word') []
 * | | | context('cancel') []
 * | | | | context('after editing the collection name') []
 * | | | | context('after adding and removing a word') []
 * | | | | context('after adding a word') []
 * | | | context('delete') []
 */

describe('editing a collection', function () {
  context('without initial words', function () {
    context('initial state', function () {
      before(function () {
        createDashboard(mock_opts.one_default_collection);
        get = sinon.stub(request, 'get', function (url, cb) {
          cb(mock_responses.get['/collection/100'].one_default_collection)
        });
        document.querySelector('h4').click(); // first (and only) collection
      });
      after(function () {
        removeDashboard();
        get.restore();
      });

      it('should not be showing the collection_list_id', function () {
        expect(document.querySelector('#collection_list_id'))
          .to.be.null;
      });
      it('should be showing the edit_collection_id', function () {
        expect(document.querySelector('#edit_collection_id'))
          .to.be.an('object');
      });
      it('should have two input boxes with the right name and description', function () {
        expect(selectorsValue('input'))
          .to.eql(['col name', 'col description']);
      });
      it('should have 4 buttons with the correct textContent', function () {
        expect(selectorsTextContent('button'))
          .to.eql(['Logout', 'Done', 'Cancel', 'Delete']);
      });
      it('should have called get once', function () {
        expect(get.callCount)
          .to.be(1);
      });
      it('should have called get with "/api/collection/{id}"', function () {
        expect(get.getCall(0).args[0])
          .to.be('/api/collection/100');
      });
    });

    context('done', function () {
      context('after editing the collection name', function () {
        before(function () {
          // TODO:
          // Temp fix, need to work out why this is happening
          // createDashboard(mock_opts.one_default_collection);
          createDashboard({
            collections: {
              '100': {
                collection_name: 'col name',
                collection_description: 'col description',
                average_score: null,
                number_of_words: 0
              }
            }
          });
          get = sinon.stub(request, 'get', function (url, cb) {
            var req = {
              '/api/collection': mock_responses.get['/collection'].one_edited_name_default_collection,
              '/api/collection/100': mock_responses.get['/collection/100'].one_default_collection
            };
            cb(req[url]);
          });
          put = sinon.stub(request, 'put', function (url, payload, cb) { cb(); });
          document.querySelector('h4').click(); // first (and only) collection
          document.querySelector('input').value = 'edited col name'; // collection name
          document.querySelectorAll('button')[1].click(); // done
        });
        after(function () {
          removeDashboard();
          get.restore();
          put.restore();
        });
        
        it('should be showing the edit_collection_id', function () {
          expect(document.querySelector('#edit_collection_id'))
            .to.be.null;
        });
        it('should be showing the collection_list_id', function () {
          expect(document.querySelector('#collection_list_id'))
            .to.be.an('object');
        });
        it('should be showing the edited collection name', function () {
          expect(selectorsTextContent('h4'))
            .to.eql(['edited col name']);
        });
        it('should have called put once', function () {
          expect(put.callCount)
            .to.be(1);
        });
        it('should have called put with the correct args', function () {
          expect(put.getCall(0).args.slice(0, 2))
            .to.eql(['/api/collection/100', { collection_name: 'edited col name'}]);
        });
        it('should have called get twice', function () {
          expect(get.callCount)
            .to.be(2);
        });
        it('should have called the first get with the correct args', function () {
          expect(get.getCall(0).args[0])
            .to.be('/api/collection/100');
        });
        it('should have called the second get with the correct args', function () {
          expect(get.getCall(1).args[0])
            .to.be('/api/collection');
        });
        it('should have called get before put', function () {
          expect(get.calledBefore(put))
            .to.be(true);
        });
        it('should have called get after put', function () {
          expect(get.calledAfter(put))
            .to.be(true);
        });
      });
    });
  });
});
});

