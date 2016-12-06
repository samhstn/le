function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

function createDashboard (opts) {
  var dashboard = document.createElement('dashboard');
  document.body.appendChild(dashboard);
  typeof opts === 'object' ? riot.mount('dashboard', clone(opts)) : riot.mount('dashboard');
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
var selectorsName = selectors('name');
var get, post, put;

describe('dashboard', function () {
describe('initial states', function () {
  context('no opts', function () {
    before(function () {
      createDashboard();
    });
    after(function () {
      removeDashboard();
    });

    it('should have a logout button', function () {
      expect(document.querySelector('form#logout_form_id button').textContent)
        .to.be('Logout');
    });
    it('should display the collection view div', function () {
      expect(document.querySelector('div#collection_list_id'))
        .to.be.an('object');
    });
    it('should not have any initial divs', function () {
      expect(document.querySelectorAll('div#collection_list_id div').length)
        .to.be(0);
    });
    it('should contain a button with `Add a collection` content', function () {
      expect(document.querySelector('div#collection_list_id button').textContent)
        .to.be('Add a collection');
    });
  });

  context('with a single collection', function () {
    context('default collection state', function () {
      before(function () {
        createDashboard(mock_opts.one_default_collection);
      });
      after(removeDashboard);
      
      it('should have a logout button', function () {
        expect(document.querySelector('form#logout_form_id button').textContent)
          .to.be('Logout');
      });
      it('should display the collection view div', function () {
        expect(document.querySelectorAll('div#collection_list_id'))
          .to.be.an('object');
      });
      it('should display the collection name in a h4', function () {
        expect(document.querySelector('div#collection_list_id h4').textContent)
          .to.be('col name');
      });
      it('should display the collection description in a h6', function () {
        expect(document.querySelector('div#collection_list_id h6').textContent)
          .to.be('col description');
      })
      it('should display Number of Words: 0', function () {
        expect(document.querySelector('div#collection_list_id p').textContent)
          .to.be('Number of Words: 0');
      });
    });

    context('collection with words state', function () {
      before(function () {
        createDashboard(mock_opts.one_collection_w_words);
      });
      after(removeDashboard);

      it('should have one collection div', function () {
        expect(document.querySelectorAll('div#collection_list_id div').length)
          .to.be(1);
      });
      it('should display the collection name in a h4', function () {
        expect(document.querySelector('div#collection_list_id h4').textContent)
          .to.be('col name');
      });
      it('should display the collection description in a h6', function () {
        expect(document.querySelector('div#collection_list_id h6').textContent)
          .to.be('col description');
      })
      it('should display the right words number and score', function () {
        expect(document.querySelector('div#collection_list_id p').textContent)
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
      expect(document.querySelectorAll('div#collection_list_id div').length)
        .to.be(2);
    });
    it('should display the collection names in a h4', function () {
      expect(selectorsTextContent('div#collection_list_id h4'))
        .to.eql([ 'col name', 'col2 name' ]);
    });

    it('should display the collection description in a h6', function () {
      expect(selectorsTextContent('div#collection_list_id h6'))
        .to.eql([ 'col description', 'col2 description' ]);
    })

    it('should display the right words number and score', function () {
      expect(selectorsTextContent('div#collection_list_id p'))
        .to.eql([ 'Average Score: 6.6, Number of Words: 3', 'Number of Words: 0' ]);
    });
  });
});

describe('create a new collection', function () {
  context('no initial collections', function () {
    context('should change view', function () {
      before(function () {
        createDashboard();
        document.querySelectorAll('div#collection_list_id button[name=add_collection]')[0].click();
      });
      after(removeDashboard);

      it('should no longer show the collection_list_id', function () {
        expect(document.querySelector('div#collection_list_id'))
          .to.be.null;
      });
      it('should show the new_collection_id', function () {
        expect(document.querySelector('div#new_collection_id'))
          .to.be.an('object');
      });
      it('should have two empty input boxes', function () {
        expect(selectorsValue('div#new_collection_id input'))
          .to.eql(['', '']);
      });
    });

    context('cancel button', function () {
      before(function () {
        createDashboard();
        document.querySelector('div#collection_list_id button[name=add_collection]').click();
        document.querySelector('div#new_collection_id input[name=name]').value = 'col name';
        document.querySelector('div#new_collection_id input[name=description]').value = 'col description';
        document.querySelector('div#new_collection_id button[name=cancel]').click();
      });

      after(removeDashboard);

      context('should change view', function () {
        it('should not show the create new collection view', function () {
          expect(document.querySelector('div#new_colleciton_id'))
            .to.be.null;
        });
        it('should show the collection view', function () {
          expect(document.querySelector('div#collection_list_id'))
            .to.be.an('object');
        });
      });

      context('should not have a changed state for creating a new collection', function () {
        before(function () {
          document.querySelector('div#collection_list_id button[name=add_collection]').click();
        });

        it('should no longer show the collection_list_id', function () {
          expect(document.querySelector('div#collection_list_id'))
            .to.be.null;
        });
        it('should show the new_collection_id', function () {
          expect(document.querySelector('div#new_collection_id'))
            .to.be.an('object');
        });
        it('should have two empty input boxes', function () {
          expect(selectorsValue('div#new_collection_id input'))
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
        document.querySelector('div#collection_list_id button[name=add_collection]').click();
        document.querySelector('div#new_collection_id input[name=name]').value = 'col name';
        document.querySelector('div#new_collection_id input[name=description]').value = 'col description';
        document.querySelector('div#new_collection_id button[name=done]').click();
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
          expect(document.querySelector('div#new_colleciton_id'))
            .to.be.null;
        });
        it('should show the collection view', function () {
          expect(document.querySelector('div#collection_list_id'))
            .to.be.an('object');
        });
        it('should show the created collection name', function () {
          expect(selectorsTextContent('div#collection_list_id h4'))
            .to.eql(['col name']);
        });
        it('should show the created collection description', function () {
          expect(selectorsTextContent('div#collection_list_id h6'))
            .to.eql(['col description']);
        });
        it('should show the created collection name', function () {
          expect(selectorsTextContent('div#collection_list_id p'))
            .to.eql(['Number of Words: 0']);
        });
      });

      context('should not have a changed state for creating a new collection', function () {
        before(function () {
          document.querySelector('div#collection_list_id button[name=add_collection]').click();
        });

        it('should no longer show the collection_list_id', function () {
          expect(document.querySelector('div#collection_list_id'))
            .to.be.null;
        });
        it('should show the new_collection_id', function () {
          expect(document.querySelector('div#new_collection_id'))
            .to.be.an('object');
        });
        it('should have two empty input boxes', function () {
          expect(selectorsValue('div#new_collection_id input'))
            .to.eql(['', '']);
        });
      });
    });
  });

  context('with single initial collection', function () {
    context('should change view', function () {
      before(function () {
        createDashboard(mock_opts.one_default_collection);
        document.querySelector('div#collection_list_id button[name=add_collection]').click();
      });
      after(removeDashboard);

      it('should no longer show the collection_list_id', function () {
        expect(document.querySelector('div#collection_list_id'))
          .to.be.null;
      });
      it('should show the new_collection_id', function () {
        expect(document.querySelector('div#new_collection_id'))
          .to.be.an('object');
      });
      it('should have two empty input boxes', function () {
        expect(selectorsValue('div#new_collection_id input'))
          .to.eql(['', '']);
      });
    });

    context('cancel button', function () {
      before(function () {
        createDashboard(mock_opts.one_default_collection);
        document.querySelector('div#collection_list_id button[name=add_collection]').click();
        document.querySelector('div#new_collection_id input[name=name]').value = 'col name';
        document.querySelector('div#new_collection_id input[name=description]').value = 'col description';
        document.querySelector('div#new_collection_id button[name=cancel]').click();
      });
      after(removeDashboard);

      context('should change view', function () {
        it('should not show the create new collection view', function () {
          expect(document.querySelector('div#new_colleciton_id'))
            .to.be.null;
        });
        it('should show the collection view', function () {
          expect(document.querySelector('div#collection_list_id'))
            .to.be.an('object');
        });
        it('should show a single collection name in a h4', function () {
          expect(selectorsTextContent('div#collection_list_id h4'))
            .to.eql(['col name']);
        });
        it('should show a single collection description in a h6', function () {
          expect(selectorsTextContent('div#collection_list_id h6'))
            .to.eql(['col description']);
        });
        it('should show the created collection name', function () {
          expect(selectorsTextContent('div#collection_list_id p'))
            .to.eql(['Number of Words: 0']);
        });
      });

      context('should not have a changed state for creating a new collection', function () {
        before(function () {
          document.querySelector('div#collection_list_id button[name=add_collection]').click();
        });

        it('should no longer show the collection_list_id', function () {
          expect(document.querySelector('div#collection_list_id'))
            .to.be.null;
        });
        it('should show the new_collection_id', function () {
          expect(document.querySelector('div#new_collection_id'))
            .to.be.an('object');
        });
        it('should have two empty input boxes', function () {
          expect(selectorsValue('div#new_collection_id input'))
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
          document.querySelector('div#collection_list_id button[name=add_collection]').click();
          document.querySelector('div#new_collection_id input[name=name]').value = 'col2 name';
          document.querySelector('div#new_collection_id input[name=description]').value = 'col2 description';
          document.querySelector('div#new_collection_id button[name=done]').click();
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
          document.querySelector('div#collection_list_id button[name=add_collection]').click();
          document.querySelector('div#new_collection_id input[name=name]').value = 'col2 name';
          document.querySelector('div#new_collection_id input[name=description]').value = 'col2 description';
          document.querySelector('div#new_collection_id button[name=done]').click();
        });
        after(function () {
          removeDashboard();
          get.restore();
          post.restore();
        });

        it('should not show the create new collection view', function () {
          expect(document.querySelector('div#new_colleciton_id'))
            .to.be.null;
        });
        it('should show the collection view', function () {
          expect(document.querySelector('div#collection_list_id'))
            .to.be.an('object');
        });
        it('should show the correct collection names', function () {
          expect(selectorsTextContent('div#collection_list_id h4'))
            .to.eql(['col name', 'col2 name']);
        });
        it('should show the created collection description', function () {
          expect(selectorsTextContent('div#collection_list_id h6'))
            .to.eql(['col description', 'col2 description']);
        });
        it('should show the created collection name', function () {
          expect(selectorsTextContent('div#collection_list_id p'))
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
          document.querySelector('div#collection_list_id button[name=add_collection]').click();
          document.querySelector('div#new_collection_id input[name=name]').value = 'col2 name';
          document.querySelector('div#new_collection_id input[name=description]').value = 'col2 description';
          document.querySelector('div#new_collection_id button[name=done]').click();
          document.querySelector('div#collection_list_id button[name=add_collection]').click();
        });
        after(function () {
          removeDashboard();
          get.restore();
          post.restore();
        });

        it('should no longer show the collection_list_id', function () {
          expect(document.querySelector('div#collection_list_id'))
            .to.be.null;
        });
        it('should show the new_collection_id', function () {
          expect(document.querySelector('div#new_collection_id'))
            .to.be.an('object');
        });
        it('should have two empty input boxes', function () {
          expect(selectorsValue('div#new_collection_id input'))
            .to.eql(['', '']);
        });
      });
    });
  });
});

/* | describe('editing a collection') [x]
 * | | context('without initial words') [x]
 * | | | context('initial state') [x]
 * | | | context('done') [x]
 * | | | | context('after editing the collection name') [x]
 * | | | | context('after adding and removing a word') []
 * | | | | context('after adding a word') []
 * | | | context('cancel') []
 * | | | | context('after editing the collection name') []
 * | | | | context('after adding and removing a word') []
 * | | | | context('after adding a word') []
 * | | | context('delete') []
 * | | context('with a two initial words') [-]
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
        document.querySelector('div#collection_list_id h4').click(); // first (and only) collection
      });
      after(function () {
        removeDashboard();
        get.restore();
      });

      it('should not be showing the collection_list_id', function () {
        expect(document.querySelector('div#collection_list_id'))
          .to.be.null;
      });
      it('should be showing the edit_collection_id', function () {
        expect(document.querySelector('div#edit_collection_id'))
          .to.be.an('object');
      });
      it('should have two input boxes with the right name and description', function () {
        expect(selectorsValue('div#edit_collection_id input'))
          .to.eql(['col name', 'col description', '', '', '']);
      });
      it('should hve 5 input boxes with the correct names', function () {
        expect(selectorsName('div#edit_collection_id input'))
          .to.eql(['name', 'description', 'direction', 'source_word', 'target_words']);
      });
      it('should have 4 buttons with the correct textContent', function () {
        expect(selectorsTextContent('div#edit_collection_id button'))
          .to.eql(['Create New Word', 'Done', 'Cancel', 'Delete']);
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
          createDashboard(mock_opts.one_default_collection);
          get = sinon.stub(request, 'get', function (url, cb) {
            var req = {
              '/api/collection': mock_responses.get['/collection'].one_edited_name_default_collection,
              '/api/collection/100': mock_responses.get['/collection/100'].one_default_collection
            };
            cb(req[url]);
          });
          put = sinon.stub(request, 'put', function (url, payload, cb) { cb(); });
          document.querySelector('div#collection_list_id h4').click(); // first (and only) collection
          document.querySelector('div#edit_collection_id input[name=name]').value = 'edited col name';
          document.querySelector('div#edit_collection_id button[name=done]').click();
        });
        after(function () {
          removeDashboard();
          get.restore();
          put.restore();
        });
        
        it('should be showing the edit_collection_id', function () {
          expect(document.querySelector('div#edit_collection_id'))
            .to.be.null;
        });
        it('should be showing the collection_list_id', function () {
          expect(document.querySelector('div#collection_list_id'))
            .to.be.an('object');
        });
        it('should be showing the edited collection name', function () {
          expect(selectorsTextContent('div#collection_list_id h4'))
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
  context('with two initial words', function () {
    context('initial state', function () {
      before(function () {
        createDashboard(mock_opts.one_default_collection);
        get = sinon.stub(request, 'get', function (url, cb) {
          cb(mock_responses.get['/collection/100'].one_default_collection)
        });
        document.querySelector('div#collection_list_id h4').click(); // first (and only) collection
      });
      after(function () {
        removeDashboard();
        get.restore();
      });

      it('should not be showing the collection_list_id', function () {
        expect(document.querySelector('div#collection_list_id'))
          .to.be.null;
      });
      it('should be showing the edit_collection_id', function () {
        expect(document.querySelector('div#edit_collection_id'))
          .to.be.an('object');
      });
      it('should have two input boxes with the right name and description', function () {
        expect(selectorsValue('div#edit_collection_id input'))
          .to.eql(['col name', 'col description', '', '', '']);
      });
      it('should hve 5 input boxes with the correct names', function () {
        expect(selectorsName('div#edit_collection_id input'))
          .to.eql(['name', 'description', 'direction', 'source_word', 'target_words']);
      });
      it('should have 4 buttons with the correct textContent', function () {
        expect(selectorsTextContent('div#edit_collection_id button'))
          .to.eql(['Create New Word', 'Done', 'Cancel', 'Delete']);
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
  });
});
});

