$(document).ready(function() {

  var col;

  module('Backbone.Grease', _.extend(new Environment, {
    setup: function() {
      Environment.prototype.setup.apply(this, arguments);

      col = new Backbone.Collection([
         new Backbone.Model({id: 3, label: 'a'}),
         new Backbone.Model({id: 2, label: 'b'}),
         new Backbone.Model({id: 1, label: 'c'}),
         new Backbone.Model({id: 0, label: 'd'})
      ]);
    }
  }));

  test("regular underscore grease methods", 1, function() {
    deepEqual(col
      .filter_(function(o) { return o.id % 2 === 0; })
      .map(function(o) { return o.id * 2; }),
    [4, 0]);
  });

  test("custom underscore grease methods", 1, function() {
    deepEqual(col
      .where_(function(o) { return o.id % 2 === 0; })
      .map(function(o) { return o.id * 2; }),
  [4, 0]);
  });

});
