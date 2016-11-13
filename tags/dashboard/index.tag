<dashboard>
  <logout_button></logout_button>

  <collections></collections>

  <new_collection_form></new_collection_form>

  <edit_collection_form></edit_collection_form>

  <script>

    const self = this;

    self.collections = self.collections || opts.collections;
    self.focussed_collection = self.focussed_collection || {};

    this.view = this.view || 'collections';

    show_create_new_collection_form () {
      self.view = 'new_collection'
      self.update();
    }

    cancel_collection_creation () {
      self.view = 'collections';
      self.update();
    }

    create_new_collection () {
      const collection_name = new_collection_form_id.querySelector('input[name=name]').value;
      const collection_description = new_collection_form_id.querySelector('input[name=description]').value;

      const payload = {
        collection_name,
        collection_description
      };

      request.post('/api/collection', payload, () => {
        request.get('/api/collection', (res) => {
          const newCollections = res.collections;
          Object.keys(newCollections).forEach((col) => {
            if (!self.collections[col]) {
              self.collections[col] = newCollections[col];
            }
          });

          self.view = 'collections';
          self.update();
        });
      });
    }

    show_edit_collection_form (id) {
      request.get('/api/collection/' + id, (res) => {
        self.focussed_collection = res.collection;

        self.view = 'edit_collection';
        self.update();
      });
    }

    cancel_edit_collection () {
      self.view = 'collections';
      self.update();
    }

    edit_collection () {
      const collection_name = edit_collection_form_id.querySelector('input[name=name]').value;
      const collection_description = edit_collection_form_id.querySelector('input[name=description]').value;

      const newCollObj = {
        collection_name,
        collection_description
      };

      const id = self.focussed_collection.id;

      const payload = {};

      ['collection_name', 'collection_description'].forEach((key) => {
        if (self.focussed_collection[key] !== newCollObj[key]) {
          payload[key] = newCollObj[key];
        }
      });

      request.put('/api/collection/' + id, payload, (r) => {
        request.get('/api/collection/' + id, (res) => {
          const collRes = res.collection;

          ['collection_name', 'collection_description'].forEach((key) => {
            if (self.collections[id][key] !== collRes[key]) {
              self.collections[id][key] = collRes[key];
            }
          });

          self.view = 'collections';
          self.update();
        });
      });
    }

    delete_collection () {
      request.del('/api/collection/' + self.focussed_collection.collection_id, () => {
        delete self.collections[self.focussed_collection.collection_id];

        self.view = 'collections';

        self.update();
      })
    }

  </script>
</dashboard>
