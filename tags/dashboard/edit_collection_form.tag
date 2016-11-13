<edit_collection_form>
  <form if={ view === 'edit_collection' } id="edit_collection_form_id">
    <input name="name" value="{ focussed_collection.collection_name || '' }">
    <input name="description" value="{ focussed_collection.collection_description || '' }">

    <button onclick={ edit_collection }>Done</button>
    <button onclick={ cancel_edit_collection }>cancel</button>
    <button onclick={ delete_collection }>Delete</button>
  </form>
</edit_collection_form>
