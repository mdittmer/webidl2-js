/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const serialize = require('simple-serialization');
const defaultRegistry = serialize.registry;

class Base {
  constructor(opts) {
    this.init(opts || {});
  }

  init(opts) {
    Object.assign(this, opts);
  }
}

class Callback extends Base {
  static get name() { return 'Callback'; }
}
defaultRegistry.register(Callback);

class Exception extends Base {
  static get name() { return 'Exception'; }
}
defaultRegistry.register(Exception);

class Interface extends Base {
  static get name() { return 'Interface'; }
}
defaultRegistry.register(Interface);

class Namespace extends Base {
  static get name() { return 'Namespace'; }
}
defaultRegistry.register(Namespace);

class PartialInterface extends Base {
  static get name() { return 'PartialInterface'; }
}
defaultRegistry.register(PartialInterface);

class Dictionary extends Base {
  static get name() { return 'Dictionary'; }
}
defaultRegistry.register(Dictionary);

class Enum extends Base {
  static get name() { return 'Enum'; }
}
defaultRegistry.register(Enum);

class Typedef extends Base {
  static get name() { return 'Typedef'; }
}
defaultRegistry.register(Typedef);

class Implements extends Base {
  static get name() { return 'Implements'; }
}
defaultRegistry.register(Implements);

class Serializer extends Base {
  static get name() { return 'Serializer'; }
}
defaultRegistry.register(Serializer);

class Stringifier extends Base {
  static get name() { return 'Stringifier'; }
}
defaultRegistry.register(Stringifier);

class Iterable extends Base {
  static get name() { return 'Iterable'; }
}
defaultRegistry.register(Iterable);

class Attribute extends Base {
  static get name() { return 'Attribute'; }
}
defaultRegistry.register(Attribute);

class MapLike extends Base {
  static get name() { return 'MapLike'; }
}
defaultRegistry.register(MapLike);

class SetLike extends Base {
  static get name() { return 'SetLike'; }
}
defaultRegistry.register(SetLike);

class UnionType extends Base {
  static get name() { return 'UnionType'; }
}
defaultRegistry.register(UnionType);

class ExtendedAttribute extends Base {
  static get name() { return 'ExtendedAttribute'; }
}
defaultRegistry.register(ExtendedAttribute);

module.exports = {
  Callback,
  Exception,
  Interface,
  Namespace,
  PartialInterface,
  Dictionary,
  Enum,
  Typedef,
  Implements,
  Serializer,
  Stringifier,
  Iterable,
  Attribute,
  MapLike,
  SetLike,
  UnionType,
  ExtendedAttribute,
  registry: defaultRegistry,
};
