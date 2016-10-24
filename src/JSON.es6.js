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

const _ = require('lodash');
const registryModule = require('./registry.es6.js');
const defaultRegistry = registryModule.registry;

function fromJSON(json, registry, Ctor) {
  const type = typeof json;
  if (json === null || type === 'boolean' || type === 'string' ||
      type === 'function' || type === 'number')
  return json;

  if (Array.isArray(json)) {
    return json.map(datum => fromJSON(datum, registry, Ctor));
  } else if (json.type_) {
    const TypedCtor = (registry || defaultRegistry).lookup(json.type_) || Ctor;
    const values = fromJSON(_.omit(json, ['type_']), registry, Ctor);
    return TypedCtor.fromJSON(values, registry);
  } else {
    return _.mapValues(json, value => fromJSON(value, registry, Ctor));
  }
}

function toJSON(o, registry) {
  const type = typeof o;
  if (o === null || type === 'boolean' || type === 'string' ||
      type === 'function' || type === 'number')
    return o;

  if (o.constructor === Object || o.constructor === Array) return _.clone(o);

  const Ctor = o.constructor;
  const actualRegistry = registry || defaultRegistry;
  if (!actualRegistry.lookup(Ctor.name)) actualRegistry.register(Ctor);
  else console.assert(actualRegistry.lookup(Ctor.name) === Ctor);

  if (o.toJSON) return o.toJSON(registry);

  let json = Ctor && Ctor.jsonKeys ? _.pick(o, Ctor.jsonKeys) : o;
  json = _.mapValues(json, value => toJSON(value, registry));

  return Object.assign({type_: Ctor.name}, json);
}