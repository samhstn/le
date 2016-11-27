<dashboard>

<form action="/logout" method="post"><button type="submit">logout</button></form>

<div if={ view === 'collections' }>
  <div each={ id, coll in collections }>
    <div each={ key, value in coll } onclick={ show_edit_collection_form.bind(this, id) }>
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
  <input name="name" value="{ focussed_collection.collection_name || '' }">
  <input name="description" value="{ focussed_collection.collection_description || '' }">

  <button onclick={ edit_collection }>Done</button>
  <button onclick={ cancel_edit_collection }>cancel</button>
  <button onclick={ delete_collection }>Delete</button>
</form>

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
    collection_name: collection_name,
    collection_description: collection_description
  };

  request.post('/api/collection', payload, function() {
    request.get('/api/collection', function (res) {
      const newCollections = res.collections;
      Object.keys(newCollections).forEach(function (col) {
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
  request.get('/api/collection/' + id, function (res) {
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
    collection_name: collection_name,
    collection_description: collection_description
  };

  const id = self.focussed_collection.id;

  const payload = {};

  ['collection_name', 'collection_description'].forEach(function (key) {
    if (self.focussed_collection[key] !== newCollObj[key]) {
      payload[key] = newCollObj[key];
    }
  });

  request.put('/api/collection/' + id, payload, function (r) {
    request.get('/api/collection/' + id, function (res) {
      const collRes = res.collection;

      ['collection_name', 'collection_description'].forEach(function (key) {
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
  request.del('/api/collection/' + self.focussed_collection.collection_id, function () {
    delete self.collections[self.focussed_collection.collection_id];

    self.view = 'collections';

    self.update();
  });
}

</script>
</dashboard>
