var mock_opts = {
  one_default_collection: {
    collections: {
      '100': {
        collection_name: 'col name',
        collection_description: 'col description',
        average_score: null,
        number_of_words: 0
      }
    }
  },
  one_collection_w_words: {
    collections: {
      '100': {
        collection_name: 'col name',
        collection_description: 'col description',
        average_score: 6.6,
        number_of_words: 3
      }
    }
  },
  one_edited_name_default_collection: {
    collections: {
      '100': {
        collection_name: 'edited col name',
        collection_description: 'col description',
        average_score: null,
        number_of_words: 0
      }
    }
  },
  two_default_collections: {
    collections: {
      '100': {
        collection_name: 'col name',
        collection_description: 'col description',
        average_score: null,
        number_of_words: 0
      },
      '101': {
        collection_name: 'col2 name',
        collection_description: 'col2 description',
        average_score: null,
        number_of_words: 0
      }
    }
  },
  two_collections_w_words : {
    collections: {
      '100': {
        collection_name: 'col name',
        collection_description: 'col description',
        average_score: 6.6,
        number_of_words: 3
      },
      '101': {
        collection_name: 'col2 name',
        collection_description: 'col2 description',
        average_score: null,
        number_of_words: 0
      }
    }
  }
}

var mock_responses = {
  get: {
    '/collection': {
      one_default_collection: mock_opts.one_default_collection,
      one_edited_name_default_collection: mock_opts.one_edited_name_default_collection,
      one_collection_w_words: mock_opts.one_collection_w_words,
      two_default_collections: mock_opts.two_default_collections,
      two_collections_w_words: mock_opts.two_collections_w_words
    },
    '/collection/100': {
      one_default_collection: {
        collection: assign(
          { collection_id: '100', words: [] },
          mock_opts.one_default_collection.collections['100']
        )
      },
      one_edited_name_default_collection: {
        collection: assign(
          { collection_id: '100', words: [] },
          mock_opts.one_edited_name_default_collection.collections['100']
        )
      }
    }
  }
}
