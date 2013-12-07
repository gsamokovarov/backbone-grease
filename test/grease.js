$(document).ready(function() {

  var col;

  module('Backbone.Grease', {
    setup: function() {
      col = new Backbone.Collection([
        new Backbone.Model({id: 3, label: 'a'}),
        new Backbone.Model({id: 2, label: 'b', even: true}),
        new Backbone.Model({id: 1, label: 'c'}),
        new Backbone.Model({id: 0, label: 'd', even: true})
      ]);
    }
  });

  test('regular model underscore grease methods', function() {
    col.at(3)
      .keys_()
      .tap(function(keys) {
        ok(_.include(keys, 'id'));
        ok(_.include(keys, 'label'));
        ok(_.include(keys, 'even'));
      });
  });

  test('regular collection underscore grease methods', 1, function() {
    deepEqual(col
      .filter_(function(o) { return o.id % 2 === 0; })
      .map(function(o) { return o.id * 2; }),
    [4, 0]);
  });

  test('attribute collection underscore grease methods', 4, function() {
    new Backbone.Collection([{x: 1}, {x: 2}])
      .groupBy_('x')
      .tap(function(grouped) {
        strictEqual(_.keys(grouped).length, 2);
        strictEqual(grouped[1][0].get('x'), 1);
        strictEqual(grouped[2][0].get('x'), 2);
      });

    deepEqual(new Backbone.Collection([{x: 3}, {x: 1}, {x: 2}])
      .sortBy_('x')
      .map(function(model) { return model.get('x'); }),
    [1, 2, 3]);
  });

  test('custom collection underscore grease methods', 3, function() {
    deepEqual(col
      .where_({even: true})
      .map(function(o) { return o.id * 2; }),
    [4, 0]);

    col
      .findWhere_({even: true})
      .tap(function(o) { equal(o.id, 2); });

    deepEqual(col
      .pluck_('id')
      .map(function(id) { return id * 2; }),
    [6, 4, 2, 0]);
  });

});
