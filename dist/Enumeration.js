// Generated by CoffeeScript 1.10.0
(function() {
  var isUnderscoreDefined,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  isUnderscoreDefined = function(root) {
    var isFunction, us;
    isFunction = function(obj) {
      return typeof obj === 'function';
    };
    return isFunction(us = root != null ? root._ : void 0) && isFunction(us.isObject) && isFunction(us.isFunction) && isFunction(us.keys) && isFunction(us.map) && isFunction(us.clone) && isFunction(us.extend);
  };

  (function(root, factory) {
    var deps, ref, ref1;
    if (typeof define === 'function' && define.amd) {
      deps = [];
      if (!isUnderscoreDefined(root)) {
        deps.push("underscore");
      }
      return define("enumerationjs", deps, factory);
    } else if (typeof module === 'object' && module.exports) {
      return module.exports = factory(require('underscore'));
    } else if (((ref = root.Package) != null ? (ref1 = ref.underscore) != null ? ref1._ : void 0 : void 0) != null) {
      return root.Enumeration = factory(root.Package.underscore._);
    } else if (root._) {
      return root.Enumeration = factory(root._);
    } else {
      throw new ReferenceError("underscore global object '_' must be defined. Get the bundled version of enumerationjs here : https://github.com/sveinburne/enumerationjs/#bundled or install underscore : http://underscorejs.org/ ");
    }
  })(this, function(_) {
    var Enumeration, baseCreate, createObject, defineNonEnumerableProperty, enumTypes, freezeObject;
    enumTypes = [];
    defineNonEnumerableProperty = (function() {
      if (((typeof window !== "undefined" && window !== null ? window.attachEvent : void 0) && !(typeof window !== "undefined" && window !== null ? window.addEventListener : void 0)) || (Object.defineProperty == null)) {
        return function(obj, name, prop) {
          return obj[name] = prop;
        };
      } else {
        return function(obj, name, prop) {
          return Object.defineProperty(obj, name, {
            value: prop,
            configurable: false
          });
        };
      }
    })();
    freezeObject = Object.freeze || _.identity;
    baseCreate = (function() {
      var create;
      create = Object.create || function(prototype) {
        var ctor;
        ctor = function() {};
        ctor.prototype = prototype;
        return new ctor();
      };
      return function(prototype) {
        if (!_.isObject(prototype)) {
          return {};
        }
        return create(prototype);
      };
    })();
    createObject = function(prototype, props) {
      var result;
      result = baseCreate(prototype);
      if (props) {
        _.extend(result, props);
      }
      return result;
    };
    Enumeration = (function() {

      /**
      * @return {array} an array containing all the registered enumTypes
       */
      Enumeration.list = function() {
        return _.clone(enumTypes);
      };


      /*
      *
       */

      Enumeration.types = Enumeration.list;


      /**
      * Static function that creates an enum object value. Uniqueness guarantied by object reference.
      * This objects's unique own field is the Enumeration name. It's read only.
      * @param {string or number} key the enum name, recommanded uppercase
      * @param {string or object} descriptor a string that identifies this value, or an object with fields that will be copied on the returned value. In this case
      * a field '_id' must be provided
      * @param {object} valueProto a prototype the returned object will inherit from
      * @param {string} enumType a string identifying the Enumeration instance this enum constant is bound to
      * @param {object} enumerationProto : the prototype shared with Enumeration instance.prototype
       */

      Enumeration.constant = function(enumName, descriptor, valueProto, ids, enumerationProto) {
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
              ref = _.extend(descriptor, valueProto);
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
        prototype = baseCreate(enumerationProto);
        _.extend(prototype, methods, valueProto);
        properties = {};
        defineReadOnlyProperty = function(key0, value0) {
          return properties[key0] = value0;
        };
        if (_.isObject(descriptor)) {
          testReserved(descriptor);
          if (descriptor._id == null) {
            throw "field '_id' must be defined when passing object as enum constant";
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
        return freezeObject(createObject(prototype, properties));
      };


      /**
      * @param  {string}  enumType A string identifying the type of this Enumeration instance
      * @param  {object}  enumValues an object which keys are the enum names, and values are each enum descriptor.
      * A descriptor can be a single unique identifier (string or number),  or an object whose fields will be copied on the enum constant instance. In this case
      * a field '_id' must be provided identifying this enum constant.
      * @param  {object} proto [optional] a prototype each enum constant will inherit from
       */

      function Enumeration(enumType, enumValues, proto) {
        var idToKeyMap, ids, key, self, val, writeConstant;
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
            throw "Cannot have enum constant as one amongst reserved enumeration property [pretty,from]";
          }
        }
        self.prototype = {
          type: function() {
            return enumType;
          }
        };
        writeConstant = (function(_this) {
          return function(descriptor, key) {
            return self[key] = Enumeration.constant(key, descriptor, proto, ids, self.prototype);
          };
        })(this);
        for (key in enumValues) {
          val = enumValues[key];
          writeConstant(val, key);
        }
        defineNonEnumerableProperty(self, 'pretty', function() {
          return enumType + ":" + ((function() {
            var results;
            results = [];
            for (key in enumValues) {
              results.push("\n\t" + self[key].describe());
            }
            return results;
          })());
        });
        defineNonEnumerableProperty(self, 'from', function(identifier, throwOnFailure) {
          if (throwOnFailure == null) {
            throwOnFailure = false;
          }
          return self[idToKeyMap[identifier]] || ((function() {
            if (throwOnFailure) {
              throw "identifier " + identifier + " does not match any";
            }
          })());
        });
        freezeObject(self);
        enumTypes.push(enumType);
        return self;
      }

      return Enumeration;

    })();
    return Enumeration;
  });

}).call(this);
