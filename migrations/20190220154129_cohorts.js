//sets up changes that will be applied to the database
exports.up = function(knex, Promise) {
    return knex.schema.createTable('cohorts', function(tbl) {
        //sets the primary key (id) as an auto-incrementing integer
        tbl.increments();

        //set the name column as varchar with required text
        tbl.string('name', 255)
        .notNullable();
    });
  
};

//sets up how we can undo the applied changes
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('cohorts');
};
