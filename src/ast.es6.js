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
const jsonModule = require('./JSON.es6.js');

class Base {
  constructor(opts) {
    this.init(opts || {});
  }

  init(opts) {
    Object.assign(this, opts);
  }

  concretize(db) {
    if (this.isConcrete_) return this;

    let ret = this.concretize_();

    Object.defineProperty(ret, 'isConcrete_', {
      enumerable: false,
      value: true,
    });

    return ret;
  }

  concretize_(db) {}

  canonicalize(db) {
    if (this.isCanonical_) return this;
    console.assert(this.isConcrete_, `Expect canonicalized to be concrete`);

    let ret = this.canonicalize_(db);

    if (ret.name) {
      const result = db.find('name', ret.name);
      console.assert(
        result.length === 1,
        `Expect to find single entity after canonicalization`
      );
      console.assert(
        result[0] === ret,
        `Expect to find this entity after canonicalization`
      );
    }

    Object.defineProperty(ret, 'isCanonical_', {
      enumerable: false,
      value: true,
    });

    return ret;
  }

  canonicalize_(db) {}
}

function concretizeInheritance(db) {
  if (!this.inheritsFrom) return this;

  const result = db.find('name', this.inheritsFrom);
  console.assert(
    result.length === 1, `Expect to find single entity to inherit from`
  );
  const inheritsFrom = result[0];
  inheritsFrom.concretize();

  for (const member of inheritsFrom.members) {
    let newMember = jsonModule.deepClone(member);
    if (!newMember.from) newMember.from = this.inheritsFrom;
    this.members.push(newMember);
  }

  return this;
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
Interface.prototype.concretize_ = concretizeInheritance;
defaultRegistry.register(Interface);

class Namespace extends Base {
  static get name() { return 'Namespace'; }
}
defaultRegistry.register(Namespace);

class PartialInterface extends Base {
  static get name() { return 'PartialInterface'; }

  concretize_(db) {
    const result = db.find('name', this.name).filter(item => item !== this);

    for (let member of this.members) {
      member.from = this;
    }

    for (const partial of result) {
      partial.concretize();
      for (const member of partial.members) {
        let newMember = jsonModule.deepClone(member);
        if (!newMember.from) newMember.from = partial;
        this.members.push(newMember);
      }
    }

    return this;
  }

  canonicalize_(db) {
    const result = db.find('name', this.name).filter(item => item !== this);

    for (const partial of result) {
      db.remove(partial);
    }

    return this;
  }
}
defaultRegistry.register(PartialInterface);

class Dictionary extends Base {
  static get name() { return 'Dictionary'; }
}
Dictionary.prototype.concretize_ = concretizeInheritance;
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
