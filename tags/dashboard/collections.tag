<collections>
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
</collections>
