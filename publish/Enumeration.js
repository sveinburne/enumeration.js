// Generated by CoffeeScript 1.10.0
(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define("enumeration.js", ['underscore'], factory);
    } else if (typeof module === 'object' && module.exports) {
      return module.exports = factory(require('underscore'));
    } else {
      if (root._ == null) {
        throw new ReferenceError("underscore global object '_' must be defined. Get the bundled version of enumeration.js here : https://github.com/sveinburne/enumeration.js/#bundled or install underscore : http://underscorejs.org/ ");
      }
      return root.Enumeration = factory(root._);
    }
  })(this, function(_) {
    var Enumeration, enumTypes;
    enumTypes = [];
    Enumeration = (function() {

      /**
      * @return {array} an array containing all the registered enumTypes
       */
      Enumeration.list = function() {
        return _.clone(enumTypes);
      };


      /**
      * Static function that creates an enum object value. Uniqueness guarantied by object reference.
      * This objects's unique own field is the Enumeration name. It's read only.
      * @param {string or number} key the enum name, recommanded uppercase
      * @param {string or object} descriptor a string that identifies this value, or an object with fields that will be copied on the returned value. In this case
      * a field '_id' must be provided
      * @param {object} valueProto a prototype the returned object will inherit from
      * @param {string} enumType a string identifying the Enumeration instance this enum value is bound to
      * @param {object} enumerationProto : the prototype shared with Enumeration instance.prototype
       */

      Enumeration.value = function(enumName, descriptor, valueProto, ids, enumerationProto) {
        var defineReadOnlyProperty, identifier, key1, methods, properties, prototype, testReserved, val1, valueIsObject;
        identifier = descriptor._id || descriptor;
        valueIsObject = descriptor._id != null;
        if (indexOf.call(ids, identifier) >= 0) {
          throw "Duplicate identifier : " + identifier;
        } else {
          ids.push(identifier);
        }
        methods = {
          id: function() {
            return identifier;
          },
          key: function() {
            return enumName;
          },
          describe: function() {
            var prop;
            return enumName + ":" + identifier + (valueIsObject ? "  {" + ((function() {
              var ref, results;
              ref = extend(descriptor, valueProto);
              results = [];
              for (enumName in ref) {
                prop = ref[enumName];
                if (!(_.isFunction(prop))) {
                  results.push(enumName + ":" + prop);
                }
              }
              return results;
            })()) + "}" : "");
          }
        };
        testReserved = function(object) {
          var field, results;
          results = [];
          for (field in object) {
            if (indexOf.call(_.keys(_.extend({}, methods, enumerationProto)), field) >= 0) {
              throw "Reserved field " + field + " cannot be passed as enum property";
            }
          }
          return results;
        };
        testReserved(valueProto);
        prototype = _.extend(methods, valueProto);
        properties = {};
        prototype.__proto__ = enumerationProto;
        defineReadOnlyProperty = function(key0, value0) {
          return properties[key0] = {
            value: value0,
            enumerable: true
          };
        };
        if (_.isObject(descriptor)) {
          testReserved(descriptor);
          if (descriptor._id == null) {
            throw "field '_id' must be defined when passing object as enum value";
          }
          if (_.isObject(descriptor._id)) {
            throw "_id descriptor field must be of type string or number";
          }
          for (key1 in descriptor) {
            val1 = descriptor[key1];
            if (key1 !== '_id') {
              defineReadOnlyProperty(key1, val1);
            }
          }
        }
        return Object.freeze(Object.create(prototype, properties));
      };


      /**
      * @param  {string}  enumType A string identifying the type of this Enumeration instance
      * @param  {object}  enumValues an object which keys are the enum names, and values are each enum descriptor.
      * A descriptor can be a single unique identifier (string or number),  or an object whose fields will be copied on the enum value instance. In this case
      * a field '_id' must be provided identifying this enum value.
      * @param  {object} proto [optional] a prototype each enum value will inherit from
       */

      function Enumeration(enumType, enumValues, proto) {
        var idToKeyMap, ids, key, self, val, writeProperty;
        if (proto == null) {
          proto = {};
        }
        idToKeyMap = _.object(_.map(enumValues, function(key, value) {
          return [key._id || key, value];
        }));
        self = function() {
          return self.pretty();
        };
        ids = [];
        if (!_.isString(enumType)) {
          throw "missing or bad enumType value : must be a string";
        }
        if (!_.isObject(enumValues) || _.isArray(enumValues)) {
          throw "missing or bad enumValues : must be an object";
        }
        if (indexOf.call(enumTypes, enumType) >= 0) {
          throw enumType + " already exists!";
        } else {
          if (((function() {
            var i, len, ref, results;
            ref = _.keys(enumValues);
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              key = ref[i];
              if (key === "pretty" || key === "from" || key === "value") {
                results.push(key);
              }
            }
            return results;
          })()).length > 0) {
            throw "Cannot have enum value as one amongst reserved enumeration property [pretty,from]";
          }
        }
        Object.defineProperty(self, "prototype", {
          value: {
            type: function() {
              return enumType;
            }
          }
        });
        writeProperty = (function(_this) {
          return function(descriptor, key) {
            return self[key] = Enumeration.value(key, descriptor, proto, ids, self.prototype);
          };
        })(this);
        for (key in enumValues) {
          val = enumValues[key];
          writeProperty(val, key);
        }
        Object.defineProperty(self, 'pretty', {
          value: function() {
            var enumVal;
            return enumType + ":" + ((function() {
              var results;
              results = [];
              for (key in self) {
                enumVal = self[key];
                results.push("\n\t" + enumVal.describe());
              }
              return results;
            })());
          }
        });
        Object.defineProperty(self, 'from', {
          value: function(identifier, throwOnFailure) {
            if (throwOnFailure == null) {
              throwOnFailure = false;
            }
            return self[idToKeyMap[identifier]] || ((function() {
              if (throwOnFailure) {
                throw "identifier " + identifier + " does not match any";
              }
            })());
          }
        });
        Object.freeze(self);
        enumTypes.push(enumType);
        return self;
      }

      return Enumeration;

    })();
    return Enumeration;
  });

}).call(this);
