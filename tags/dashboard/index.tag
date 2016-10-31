<dashboard>
  <h1>Hello Dashboard</h1>

  <form action="/logout" method="post">
    <button type="submit">logout</button>
  </form>

  <div if={ show_collections } id="collections_container_id">
    <div style="padding: 20px; margin: 20px;" each={ id, coll in collections }>
      <div class="coll_id_{ id }" each={key, value in coll} style="padding: 0; margin: 0;">
        <p style="padding: 0; margin: 0;">{
          key === 'collection_name' ?
          'Name' : key === 'collection_description' ?
          'Description' : key === 'average_score' ?
          'Average Score' : key === 'number_of_words' ?
          'Words' : key}: { value }</p>
      </div>
      <button onclick={ () => edit_collection(id) }>Edit</button>
    </div>
    <div style="background-color: lightgreen; width: 100px; height: 100px;">
      <p onclick={ show_new_collection_form }>add a collection</p>
    </div>
  </div>

  <form id="new_collection_form_id" if={ new_collection_form } onsubmit={ create_new_collection }>
    <label>Collection name: </label>
    <input class="new_collection_name" required />
    <label>Collection description: </label>
    <input class="new_collection_description" required />

    <button type="submit">create collection</button>
    <button type="button" onclick={ cancel_collection_creation }>cancel collection</button>
  </form>

  <form id="edit_collection_form_id" if={ edit_collection_form } onsubmit={ save_collection_edit }>
    <label>Collection name: </label>
    <input class="edit_collection_name" value={focussed_collection.collection_name} />
    <label>Collection name: </label>
    <input class="edit_collection_description" value={focussed_collection.collection_description} />
    
    <button type="submit">save edit</button>
    <button type="button" onclick={ cancel_edit_collection }>cancel edit</button>
    <button type="button" onclick={ delete_collection }>delete collection</button>
  </form>

  <script>

    const self = this;
    
    self.collections = self.collections || opts.collections;
    self.focussed_collection = self.focussed_collection || {};

    show_collections = typeof self.show_collections === 'undefined'
      ? true : self.show_collections;

    show_new_collection_form () {
      self.show_collections = false;
      self.new_collection_form = true;
      self.edit_collection_form = false;
    }

    cancel_collection_creation () {
      self.show_collections = true;
      self.new_collection_form = false;
      self.edit_collection_form = false;
    }

    create_new_collection (e) {
      e.preventDefault();
      const collection_name = e.target.querySelector('.new_collection_name').value;
      const collection_description = e.target.querySelector('.new_collection_description').value
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

          self.show_collections = true;
          self.new_collection_form = false;
          self.edit_collection_form = false;

          self.update();

        });
      });
    }

    edit_collection (id) {
      self.show_collections = false;
      self.new_collection_form = false;
      self.edit_collection_form = true;

      self.focussed_collection = Object.assign({}, self.collections[id], { id });

      self.update();
    }

    cancel_edit_collection () {
      self.show_collections = true;
      self.new_collection_form = false;
      self.edit_collection_form = false;
    }

    save_collection_edit (e) {
      e.preventDefault();

      const newCollObj = {
        collection_name: e.target.querySelector('.edit_collection_name').value,
        collection_description: e.target.querySelector('.edit_collection_description').value
      };
      const id = self.focussed_collection.id;

      if (
        newCollObj.collection_name === self.focussed_collection.collection_name
        && newCollObj.collection_description === self.focussed_collection.collection_description
      ) {
        self.show_collections = true;
        self.new_collection_form = false;
        self.edit_collection_form = false;
        return;
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

          self.show_collections = true;
          self.new_collection_form = false;
          self.edit_collection_form = false;

          self.update();
        });
      });
    }

    delete_collection () {
      request.del('/api/collection/' + self.focussed_collection.id, () => {
        delete self.collections[self.focussed_collection.id];

        self.show_collections = true;
        self.new_collection_form = false;
        self.edit_collection_form = false;

        self.update();
      })
    }

  </script>
</dashboard>
