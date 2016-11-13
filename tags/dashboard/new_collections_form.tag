<new_collection_form>
  <form if={ view === 'new_collection' } id="new_collection_form_id">
    <input name="name">
    <input name="description">

    <button onclick={ create_new_collection }>done</button>
    <button onclick={ cancel_collection_creation }>cancel</button>
  </form>
</new_collection_form>
