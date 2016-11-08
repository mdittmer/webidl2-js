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

class Indexer {
  constructor(opts) {
    this.init(opts || {});
  }

  init(opts) {
    this.by = {};
    if (!opts.keys) return;
    for (const key of opts.keys) {
      this.addIndex(key);
    }
  }

  hasIndex(name) {
    return !!this.by[name];
  }

  addIndex(name) {
    this.by[name] = {};
    return this.by[name];
  }

  put(name, data) {
    if (data === undefined || data[name] === undefined) return;
    console.assert(this.by[name]);
    if (!this.by[name][data[name]]) this.by[name][data[name]] = [];
    this.by[name][data[name]].push(data);
  }

  remove(name, data) {
    if (data === undefined || data[name] === undefined) return;
    console.assert(this.by[name]);
    this.by[name][data[name]] = this.by[name][data[name]].filter(
      item => item !== data
    );
  }

  find(key, value) {
    console.assert(this.by[key]);
    return this.by[key][value] ? this.by[key][value].slice() : [];
  }

  putToAll(data) {
    const idxs = Object.getOwnPropertyNames(this.by);
    for (const idx of idxs) {
      this.put(idx, data);
    }
  }

  removeFromAll(data) {
    const idxs = Object.getOwnPropertyNames(this.by);
    for (const idx of idxs) {
      this.remove(idx, data);
    }
  }
}

class DB {
  static fromJSON(json, opts) {
    let db = new DB(opts);
    for (const item of json) {
      db.put(item);
    }
    return db;
  }

  constructor(opts) {
    this.init(opts || {});
  }

  init(opts) {
    opts = opts || {};
    this.name = opts.name || '';
    this.data = [];
    this.subs = {};
    this.idx = new Indexer({keys: opts.idxKeys});
  }

  put(data) {
    this.data.push(data);
    this.idx.putToAll(data);
    if (data.putTo) data.putTo(this);
  }

  remove(data, filter) {
    filter = filter || (item => item === data);
    this.data = this.data.filter(filter);
    this.idx.removeFromAll(data);
    if (data.removeFrom) data.removeFrom(this);
  }

  find(key, value) {
    return this.idx.find(key, value);
  }

  select(callback) {
    for (const datum of this.data) {
      callback(datum);
    }
  }
}

module.exports = DB;
