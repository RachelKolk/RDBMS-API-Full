
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').del()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {id: 1, name: 'David Sigu', cohortId: 1},
        {id: 2, name: 'Rachel Kolk', cohortId: 2},
        {id: 3, name: 'Peter Murphy', cohortId: 3}
      ]);
    });
};
