<dashboard>
  <form action="/logout" method="post"><button type="submit">logout</button></form>

  <div if={ view === 'collections' }>
    <div each={ id, coll in collections }>
      <div each={ key, value in coll } onclick={ () => show_edit_collection_form(id) }>
        <p>{key} - {value}</p>
      </div>
    </div>
    <div>
      <button onclick={ show_create_new_collection_form }>Add a collecton</button>
    </div>
  </div>

  <form if={ view === 'new_collection' } id="new_collection_form_id">
    <input name="name">
    <input name="description">

    <button onclick={ create_new_collection }>done</button>
    <button onclick={ cancel_collection_creation }>cancel</button>
  </form>

  <form if={ view === 'edit_collection' } id="edit_collection_form_id">
    <input name="name"></div>
    <input name="description"></div>
    <div each={word}>
      <input><button>delete</button>
    </div>
    <button>Add word</button>

    <button name="edit">Done</button>
    <button name="cancel">cancel</button>
  </form>

  <script>

    const self = this;

    self.collections = self.collections || opts.collections;
    self.focussed_collection = self.focussed_collection || {};

    console.log(self.collections, self.focussed_collection);

    this.view = this.view || 'collections';

    show_create_new_collection_form () {
      self.view = 'new_collection'
      self.update();
    }

    reset_collection_values (id) {
      id.querySelector('input[name=name]').value = '';
      id.querySelector('input[name=description]').value = '';
    }

    cancel_collection_creation () {
      self.reset_new_collection_vals('create_collection_form_id');

      self.view = 'collections';
      self.update();
    }

    create_new_collection () {
      const payload = {
        collection_name,
        collection_description
      };

      request.post('/api/collection', payload, () => {
        request.get('/api/collection', (res) => {
          const newCollections = JSON.parse(res).collections;
          Object.keys(newCollections).forEach((col) => {
            if (!self.collections[col]) {
              self.collections[col] = newCollections[col];
            }
          });

          self.reset_collection_values('create_collection_form_id');

          self.view = 'collections';
          self.update();
        });
      });
    }

    show_edit_collection_form () {
      self.view = 'edit_collection';
      self.update();
    }

    cancel_edit_collection () {
      self.view = 'collections';
      self.update();
    }

    edit_collection () {
      const newCollObj = {
        collection_name: edit_collection_form_id.querySelector('input[name=name]').value,
        collection_description: edit_collection_form_id.querySelector('input[name=description]').value
      };
      const id = self.focussed_collection.id;

      if (
        newCollObj.collection_name === self.focussed_collection.collection_name
        && newCollObj.collection_description === self.focussed_collection.collection_description
      ) {
        return self.view = 'collections';
      }

      const payload = {};

      ['collection_name', 'collection_description'].forEach((key) => {
        if (self.focussed_collection[key] !== newCollObj[key]) {
          payload[key] = newCollObj[key];
        }
      });

      request.put('/api/collection/' + id, payload, (r) => {
        request.get('/api/collection/' + id, (res) => {
          const collRes = JSON.parse(res).collection;

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
      request.del('/api/collection/' + self.focussed_collection.id, () => {
        delete self.collections[self.focussed_collection.id];

        self.view = 'collections';

        self.update();
      })
    }

    add_word () {
      const id = Object.keys(view.focussed_collection)[0];
      view.focussed_collection[id].words = view.focussed_collection[id].words.concat(new_word_obj);

      self.update();
    }

    delete_word () {
      const id = Object.keys(view.focussed_collection)[0];
      view.focussed_collection[id].words = view.focussed_collection[id].words.filter((w) => w.word_id !== id);

      self.update();
    }

  </script>
</dashboard>
