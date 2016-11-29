<dashboard>

<form action="/logout" method="post"><button>logout</button></form>

<div if={ view === 'collections' } id="collection_list_id">
  <div each={ coll, id in collections } onclick={ show_edit_collection.bind(this, id) }>
    <h4>{ coll.collection_name }</h4>
    <h6>{ coll.collection_description }</h6>
    <p>{
      coll.average_score
      ? 'Average Score: ' + coll.average_score
      + ', Number of Words: ' + coll.number_of_words
      : 'Number of Words: ' + coll.number_of_words
    }</p>
  </div>
  <button onclick={ show_create_new_collection }>Add a collection</button>
</div>

<div if={ view === 'new_collection' } id="new_collection_id">
  <input name="name">
  <input name="description">

  <button onclick={ create_new_collection }>done</button>
  <button onclick={ cancel_collection_creation }>cancel</button>
</div>

<div if={ view === 'edit_collection' } id="edit_collection_id">
  <input name="name" value="{ focussed_collection.collection_name || '' }">
  <input name="description" value="{ focussed_collection.collection_description || '' }">

  <button onclick={ edit_collection }>Done</button>
  <button onclick={ cancel_edit_collection }>cancel</button>
  <button onclick={ delete_collection }>Delete</button>
</div>

<script>

const self = this;

self.collections = self.collections || opts.collections || {};
self.focussed_collection = self.focussed_collection || {};

this.view = this.view || 'collections';

show_create_new_collection () {
  self.view = 'new_collection'
  self.update();
}

cancel_collection_creation () {
  self.view = 'collections';
}

create_new_collection () {
  const collection_name = new_collection_id.querySelector('input[name=name]').value;
  const collection_description = new_collection_id.querySelector('input[name=description]').value;

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

show_edit_collection (id) {
  request.get('/api/collection/' + id, function (res) {
    self.focussed_collection = res.collection;

    self.view = 'edit_collection';
    self.update();
  });
}

cancel_edit_collection () {
  self.view = 'collections';
}

edit_collection () {
  const collection_name = edit_collection_id.querySelector('input[name=name]').value;
  const collection_description = edit_collection_id.querySelector('input[name=description]').value;

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

  request.put('/api/collection/' + id, payload, function () {
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
