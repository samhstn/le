<dashboard>
  <h1>Hello Dashboard</h1>

  <form action="/logout" method="post">
    <button type="submit">logout</button>
  </form>

  <div if={ show_collections } id="collections_container_id">
    <div style="padding: 20px; margin: 20px;" each={ id, coll in collections }>
      <div each={key, value in coll} style="padding: 0; margin: 0;">
        <p style="padding: 0; margin: 0;">{ key === 'collection_name' ? 'Name' : key === 'collection_description' ? 'Description' : key === 'average_score' ? 'Average Score' : key === 'number_of_words' ? 'Words' : 'Other'}: { value }</p>
      </div>
    </div>
    <div style="background-color: lightgreen; width: 100px; height: 100px;">
      <p onclick={ show_new_collection_form }>add a collection</p>
    </div>
  </div>

  <form id="new_collection_form_id" if={ new_collection_form } onsubmit={ create_new_collection }>
    <label>Collection name: </label>
    <input class="collection_name" required />
    <label>Collection description: </label>
    <input class="collection_description" required />

    <button type="submit">create collection</button>
    <button type="button" onclick={ cancel_collection_creation }>cancel collection</button>
  </form>

  <script>

    const self = this;
    
    self.collections = self.collections || opts.collections;

    show_collections = typeof self.show_collections === 'undefined'
      ? true : self.show_collections;

    show_new_collection_form = function () {
      self.show_collections = false;
      self.new_collection_form = true;
    }

    cancel_collection_creation = function () {
      self.show_collections = true;
      self.new_collection_form = false;
    }

    create_new_collection = function (e) {
      e.preventDefault();
      const payload = {
        collection_name: e.target.querySelector('.collection_name').value,
        collection_description: e.target.querySelector('.collection_description').value
      };
      request.post('/api/collection', payload, (res) => {
        request.get('/api/collection', (res2) => {
          const newCollections = JSON.parse(res2).collections;
          Object.keys(newCollections).forEach((col) => {
            if (!self.collections[col]) {
              self.collections[col] = newCollections[col];
            }
          });

          self.show_collections = true;
          self.new_collection_form = false;

          self.update();

        });
      });
    }

  </script>
</dashboard>
