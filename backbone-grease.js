// backbone-grease 0.1.0
//
// (c) 2013 Genadi Samokovarov
// Licensed under the MIT license.

(function(Backbone) {

  // Borrow the Array#slice method.
  var slice = Array.prototype.slice;

  /**
  * Underscore Grease
  *
  * https://github.com/machineghost/Underscore-Grease
  *
  * Underscore's chaining syntax is kind of ... heavy:
  *      _(foo).chain().method1().method2().value();
  *
  * This mix-in lightens that syntax to simply be:
  *      _(foo).method1_().method2();
  * replacing .chain() and .value() with a single extra "_" (well, technically
  * one "_" per chained method).
  */
  var greaseMixin = _(_).chain().methods().reduce(function(memo, methodName) {
      if (methodName == 'chain') return memo; // No point in making a "chain_"
      memo[methodName + '_'] = function() {
          return _(_[methodName].apply(this, arguments));
      };
      return memo;
  }, {}).value();
  _.mixin(greaseMixin);

  // As of Backbone 1.0.0, `Backbone.Model` has underscore methods too.
  var modelMethods = ['keys_', 'values_', 'pairs_', 'invert_', 'pick_',
    'omit_'];

  _.each(modelMethods, function(method) {
    Backbone.Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // There are 3 kinds of Underscore methods in the Backbone collection.
  //
  // 1. Methods simply operating on collection's models array. Those are
  //    delegated to Underscore.
  // 2. Methods iteratively operating on individual model attributes. Those are
  //    also delegated to Underscore.
  // 3. Methods in the vein of 2. that are not simple or common enough to
  //    easily generalize. Those are inlined right into the collection.
  //
  // We are going to handle each of those separately.

  // Attach the regular methods pairs.
  var collectionMethods = ['forEach_', 'each_', 'map_', 'collect_', 'reduce_',
    'foldl_', 'inject_', 'reduceRight_', 'foldr_', 'find_', 'detect_',
    'filter_', 'select_', 'reject_', 'every_', 'all_', 'some_', 'any_',
    'include_', 'contains_', 'invoke_', 'max_', 'min_', 'toArray_', 'size_',
    'first_', 'head_', 'take_', 'initial_', 'rest_', 'tail_', 'drop_', 'last_',
    'without_', 'indexOf_', 'shuffle_', 'lastIndexOf_', 'isEmpty_'];

  _.each(collectionMethods, function(method) {
    Backbone.Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Attach the attribute methods pairs..
  var collectionAttributeMethods = ['groupBy_', 'countBy_', 'sortBy_'];

  _.each(collectionAttributeMethods, function(method) {
    Backbone.Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Attach the custom methods pairs.
  var collectionCustomMethods = ['where_', 'findWhere_', 'pluck_'];

  _.each(collectionCustomMethods, function(method) {
    Backbone.Collection.prototype[method] = function() {
      return _(this[method.slice(0, -1)].apply(this, arguments));
    };
  });

}).call(this, Backbone);
