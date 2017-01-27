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

// TODO(markdittmer): LIBs don't support 'refines', but redefining them
// appears to augment them.

foam.ENUM({
  package: 'foam.diff',
  name: 'DiffType',

  values: [
    {
      name: 'ADD',
      label: 'Added',
    },
    {
      name: 'REMOVE',
      label: 'Removed',
    },
  ],
});

foam.CLASS({
  package: 'foam.diff',
  name: 'DiffChunk',

  properties: [
    {
      class: 'StringArray',
      name: 'revPath',
    },
    {
      class: 'FObjectProperty',
      of: 'foam.diff.DiffType',
      name: 'type',
    },
    {
      name: 'value',
    },
  ],

  methods: [
    function describe() {
      var path = this.revPath.slice(0).reverse().join('.');
      console.log(this.type.label + ' at ' + path + ' with value ', this.value);
    },
  ],
});

foam.CLASS({
  package: 'foam.diff',
  name: 'Keys',

  properties: [
    {
      class: 'StringArray',
      name: 'keys',
    },
    {
      class: 'Int',
      name: 'idx',
    },
  ],

  methods: [
    function getKey() {
      return this.keys[this.idx];
    },
    function nextKey() {
      this.idx++;
    },
  ],
});

foam.CLASS({
  package: 'foam.diff',
  name: 'State',

  requires: [
    'foam.diff.DiffChunk',
    'foam.diff.Keys',
    'foam.diff.DiffType',
    'foam.diff.Differ',
  ],

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.diff.Differ',
      name: 'differ',
      factory: function() {
        return this.Differ.create();
      },
    },
    {
      class: 'Int',
      name: 'current',
      value: 0,
    },
    {
      class: 'FObjectProperty',
      of: 'foam.diff.State',
      name: 'best',
      value: null
    },
    {
      class: 'FObjectArray',
      of: 'foam.diff.DiffChunk',
      name: 'diffChunks',
    },
    {
      class: 'FObjectProperty',
      of: 'foam.diff.Keys',
      name: 'objectKeys',
      value: null,
    },
    {
      class: 'FObjectProperty',
      of: 'foam.diff.Keys',
      name: 'arrayKeys1',
      value: null,
    },
    {
      class: 'FObjectProperty',
      of: 'foam.diff.Keys',
      name: 'arrayKeys2',
      value: null,
    },
  ],

  methods: [
    function isValid() {
      return this.best === null || this.current <= this.best.current;
    },
    function add(o) {
      // TODO(markdittmer): Is this guard needed?
      if (!this.isValid()) return this;

      return this.appendChunk(o, this.DiffType.ADD);
    },
    function remove(o) {
      // TODO(markdittmer): Is this guard needed?
      if (!this.isValid()) return this;

      return this.appendChunk(o, this.DiffType.REMOVE);
    },

    function withObjectKeys(keys, f) {
      // TODO(markdittmer): Is this guard needed?
      if (!this.isValid()) return this;

      var state = this.clone();
      state.objectKeys = this.Keys.create({keys: keys});

      var next = f(state);
      next.objectKeys = this.objectKeys !== null ?
        this.objectKeys.clone() : null;

      return next;
    },
    function dropObjectKeys() {
      // TODO(markdittmer): Is this guard needed?
      if (!this.isValid()) return this;

      var state = this.clone();
      state.objectKeys = null;

      return state;
    },
    function restoreObjectKeys(restoreState) {
      // TODO(markdittmer): Is this guard needed?
      if (!this.isValid()) return this;

      var state = this.clone();
      state.objectKeys = restoreState.objectKeys !== null ?
        restoreState.objectKeys.clone() : null;

      return state;
    },
    function nextObjectKey() {
      // TODO(markdittmer): Is this guard needed?
      if (!this.isValid()) return this;

      foam.assert(
        this.hasObjectKeys(),
        'Attempt to get next key from unkeyed state'
      );

      var state = this.clone();
      state.objectKeys.nextKey();

      return state;
    },
    function appendObjectKeyToDiffChunks(prevState) {
      // TODO(markdittmer): Is this guard needed?
      if (!this.isValid()) return this;

      var key = prevState.getObjectKey();
      var state = this.clone();
      for (var i = prevState.diffChunks.length; i < state.diffChunks.length; i++) {
        state.diffChunks[i].revPath.push(key);
      }

      return state;
    },
    function hasObjectKeys() {
      return this.objectKeys !== null;
    },
    function getObjectKey() {
      return this.objectKeys.getKey();
    },

    function withArrayKeys(keys1, keys2, f) {
      // TODO(markdittmer): Is this guard needed?
      if (!this.isValid()) return this;

      var state = this.clone();
      state.arrayKeys1 = this.Keys.create({keys: keys1});
      state.arrayKeys2 = this.Keys.create({keys: keys2});

      var next = f(state);
      next.arrayKeys1 = this.arrayKeys1 !== null ?
        this.arrayKeys1.clone() : null;
      next.arrayKeys2 = this.arrayKeys2 !== null ?
        this.arrayKeys2.clone() : null;

      return next;
    },
    function dropArrayKeys() {
      // TODO(markdittmer): Is this guard needed?
      if (!this.isValid()) return this;

      var state = this.clone();
      state.arrayKeys1 = state.arrayKeys2 = null;

      return state;
    },
    function restoreArrayKeys(restoreState) {
      // TODO(markdittmer): Is this guard needed?
      if (!this.isValid()) return this;

      var state = this.clone();
      state.arrayKeys1 = restoreState.arrayKeys1 !== null ?
        restoreState.arrayKeys1.clone() : null;
      state.arrayKeys2 = restoreState.arrayKeys2 !== null ?
        restoreState.arrayKeys2.clone() : null;

      return state;
    },
    function nextArrayKeyBoth() {
      // TODO(markdittmer): Is this guard needed?
      if (!this.isValid()) return this;

      foam.assert(
        this.hasArrayKeys(),
        'Attempt to get next key from unkeyed state'
      );

      var state = this.clone();
      state.arrayKeys1.nextKey();
      state.arrayKeys2.nextKey();

      return state;
    },
    function nextArrayKey1() {
      // TODO(markdittmer): Is this guard needed?
      if (!this.isValid()) return this;

      foam.assert(
        this.hasArrayKeys(),
        'Attempt to get next key from unkeyed state'
      );

      var state = this.clone();
      state.arrayKeys1.nextKey();

      return state;
    },
    function nextArrayKey2() {
      // TODO(markdittmer): Is this guard needed?
      if (!this.isValid()) return this;

      foam.assert(
        this.hasArrayKeys(),
        'Attempt to get next key from unkeyed state'
      );

      var state = this.clone();
      state.arrayKeys2.nextKey();

      return state;
    },
    function appendArrayKeysToDiffChunks(prevState) {
      // TODO(markdittmer): Is this guard needed?
      if (!this.isValid()) return this;

      var addKey = prevState.getArrayKey2();
      var removeKey = prevState.getArrayKey1();
      var state = this.clone();
      for (var i = prevState.diffChunks.length; i < state.diffChunks.length; i++) {

        state.diffChunks[i].revPath.push(
          state.diffChunks[i].type === this.DiffType.ADD ? addKey : removeKey
        );
      }

      return state;
    },
    function hasArrayKeys() {
      return this.arrayKeys1 !== null;
    },
    function getArrayKey1() {
      return this.arrayKeys1.getKey();
    },
    function getArrayKey2() {
      return this.arrayKeys2.getKey();
    },

    function updateArrayBest(newBest) {
      // New best is not better if:
      // (1) Current best is better than new best
      // (2) New best stopped parsing early.
      if ((this.best !== null && newBest.current >= this.best.current) // ||
          // newBest.getArrayKey1() !== undefined ||
          // newBest.getArrayKey2() !== undefined
         )
        return this;

      var state = this.clone();
      state.best = newBest;

      return state;
    },

    function appendChunk(o, type) {
      // Clone will create a new copy of array: diffChunks.
      var state = this.clone();

      state.diffChunks.push(this.DiffChunk.create({
        type: type,
        value: o,
      }));
      state.current += this.differ.typeOf(o, this).getSize(o, this);

      return state;
    },
    function flip(prevState) {
      var state = this.clone();

      for (var i = prevState.diffChunks.length; i < this.diffChunks.length; i++) {
        state.diffChunks[i].type =
          this.diffChunks[i].type === this.DiffType.ADD ?
          this.DiffType.REMOVE : this.DiffType.ADD;
      }

      return state;
    },
  ],
});

foam.CLASS({
  package: 'foam.diff',
  name: 'Type',

  requires: [
    'foam.diff.Differ',
  ],

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.diff.Differ',
      name: 'differ',
      factory: function() {
        return this.Differ.create();
      },
    },
  ],

  methods: [
    function isInstance(o, state) {
      return false;
    },
    function getSize(o, state) {
      return 0;
    },
    function getPropertyNames(o, state) {
      return [];
    },
    function statefulStructuredDiff(a, b, state) {
      return state;
    },
  ],
});

foam.CLASS({
  package: 'foam.diff',
  name: 'Undefined',
  extends: 'foam.diff.Type',

  axioms: [
    foam.pattern.Singleton.create(),
  ],

  requires: [
    'foam.diff.DiffChunk',
    'foam.diff.DiffType',
  ],

  methods: [
    function isInstance(o, state) {
      return o === undefined;
    },
    function statefulStructuredDiff(a, b, state) {
      return state.add(b);
    },
  ],
});

foam.CLASS({
  package: 'foam.diff',
  name: 'Primitive',
  extends: 'foam.diff.Type',

  axioms: [
    foam.pattern.Singleton.create(),
  ],

  requires: [
    'foam.diff.DiffChunk',
    'foam.diff.DiffType',
  ],

  properties: [
    {
      name: 'types',
      factory: function() {
        return [
          foam.Null,
          foam.Boolean,
          foam.Number,
          foam.String,
          foam.Function,
        ];
      },
    },
  ],

  methods: [
    function isInstance(o, state) {
      var t = foam.typeOf(o);
      for (var i = 0; i < this.types.length; i++) {
        if (t === this.types[i]) return true;
      }
      return false;
    },
    function getSize(o, state) {
      return 1;
    },
    function statefulStructuredDiff(a, b, state) {
      return state.remove(a).add(b);
    },
  ],
});

foam.CLASS({
  package: 'foam.diff',
  name: 'ObjectLike',
  extends: 'foam.diff.Type',

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.diff.Type',
      name: 'keyType',
    },
  ],

  methods: [
    function getPropertyNames(o, state) {
      // TODO(markdittmer): Is this sufficient for arrays? Chrome puts keys
      // in numerical order, but that may not be true of other browsers.
      return Object.keys(o);
    },
    function getSize(o, state) {
      var keyType = this.keyType;
      var size = 0;

      state.withObjectKeys(
        this.getPropertyNames(o),
        function(keyedState) {
          while (keyedState.getObjectKey() !== undefined) {
            size += keyType.getSize(o, keyedState);
            keyedState = keyedState.nextObjectKey();
          }
          return keyedState;
        }
      );

      return size;
    },
  ],
});

foam.CLASS({
  package: 'foam.diff',
  name: 'Object',
  extends: 'foam.diff.ObjectLike',

  axioms: [
    foam.pattern.Singleton.create(),
  ],

  requires: [
    'foam.diff.ObjectKey',
    'foam.diff.DiffChunk',
    'foam.diff.DiffType',
  ],

  properties: [
    {
      name: 'keyType',
      factory: function() {
        return this.ObjectKey.create();
      },
    },
  ],

  methods: [
    function isInstance(o, state) {
      return foam.typeOf(o) === foam.Object && !state.hasObjectKeys();
    },
    function statefulStructuredDiff(a, b, state) {
      return state.withObjectKeys(
        this.dedupKeys(
          this.getPropertyNames(a, state), this.getPropertyNames(b, state)
        ),
        this.differ.statefulStructuredDiff.bind(this.differ, a, b)
      );
    },
    function dedupKeys(a, b) {
      a = a.sort();
      b = b.sort();
      var keys = [];
      var i = 0;
      var j = 0;
      while (i < a.length || j < b.length) {
        if (a[i] === b[j]) {
          keys.push(a[i]);
          i++;
          j++;
        } else if (b[j] === undefined || a[i] < b[j]) {
          keys.push(a[i]);
          i++;
        } else {
          keys.push(b[j]);
          j++;
        }
      }
      return keys;
    },
  ],
});

foam.CLASS({
  package: 'foam.diff',
  name: 'KeyLike',
  extends: 'foam.diff.Type',

  methods: [
    function getSize(o, state) {
      var key = state.getObjectKey();
      state = state.dropObjectKeys();
      return 1 + this.differ.typeOf(o[key], state).getSize(o[key], state);
    },
  ],
});

foam.CLASS({
  package: 'foam.diff',
  name: 'ObjectKey',
  extends: 'foam.diff.KeyLike',

  axioms: [
    foam.pattern.Singleton.create(),
  ],

  requires: [
    'foam.diff.DiffChunk',
    'foam.diff.DiffType',
  ],

  methods: [
    function isInstance(o, state) {
      return foam.typeOf(o) === foam.Object && state.hasObjectKeys();
    },
    function statefulStructuredDiff(a, b, state) {
      var key = state.getObjectKey();
      if (key === undefined) return state;
      return this.differ.statefulStructuredDiff(
        a,
        b,
        this.differ.statefulStructuredDiff(
          a[key], b[key], state.dropObjectKeys()
        ).appendObjectKeyToDiffChunks(state).restoreObjectKeys(state)
          .nextObjectKey()
      );
    },
  ],
});

foam.CLASS({
  package: 'foam.diff',
  name: 'Array',
  extends: 'foam.diff.ObjectLike',

  axioms: [
    foam.pattern.Singleton.create(),
  ],

  requires: [
    'foam.diff.ArrayKey',
    'foam.diff.DiffChunk',
    'foam.diff.DiffType',
  ],

  properties: [
    {
      name: 'keyType',
      factory: function() {
        return this.ArrayKey.create();
      },
    },
  ],

  methods: [
    function isInstance(o, state) {
      return foam.typeOf(o) === foam.Array && !state.hasArrayKeys();
    },
    function statefulStructuredDiff(a, b, state) {
      return state.withArrayKeys(
        this.getPropertyNames(a, state),
        this.getPropertyNames(b, state),
        this.differ.statefulStructuredDiff.bind(this.differ, a, b)
      ).best;
    },
  ],
});

foam.CLASS({
  package: 'foam.diff',
  name: 'ArrayKey',
  extends: 'foam.diff.KeyLike',

  axioms: [
    foam.pattern.Singleton.create(),
  ],

  requires: [
    'foam.diff.DiffChunk',
    'foam.diff.DiffType',
  ],

  methods: [
    function isInstance(o, state) {
      return foam.typeOf(o) === foam.Array && state.hasArrayKeys();
    },
    function statefulStructuredDiff(a, b, state) {
      var aKey = state.getArrayKey1();
      var bKey = state.getArrayKey2();
      var next;

      // Reached end of both arrays.
      if (aKey === undefined && bKey === undefined)
        return state.updateArrayBest(state);


      if (aKey !== undefined && bKey !== undefined) {
        // First (inner call):
        // Consume both a[aKey] and b[bKey] by diffing them, then advance
        // both keys be 1.
        // Next:
        // Recurse a/b diff with incremented keys.
        next = this.differ.statefulStructuredDiff(
          a,
          b,
          this.differ.statefulStructuredDiff(
            a[aKey], b[bKey], state.dropArrayKeys()
          ).appendArrayKeysToDiffChunks(state)
            .restoreArrayKeys(state)
            .nextArrayKey1().nextArrayKey2()
        );

        // If next has a better position than state's best,
        // then it's the new best parse.
        state = state.updateArrayBest(next);
      }

      if (aKey !== undefined) {
        // First (inner call):
        // Consume just a[aKey] by diffing against undefined, then advance
        // aKey be 1.
        // Next:
        // Recurse a/b diff with incremented key.
        next = this.differ.statefulStructuredDiff(
          a,
          b,
          this.differ.statefulStructuredDiff(
            a[aKey], undefined, state.dropArrayKeys()
          ).appendArrayKeysToDiffChunks(state)
            .restoreArrayKeys(state)
            .nextArrayKey1()
        );

        // If next has a better position than state's best,
        // then it's the new best parse.
        state = state.updateArrayBest(next);
      }

      if (bKey !== undefined) {
        // First (inner call):
        // Consume just b[bKey] by diffing against undefined, then advance
        // bKey be 1.
        // Next:
        // Recurse a/b diff with incremented key.
        next = this.differ.statefulStructuredDiff(
          a,
          b,
          this.differ.statefulStructuredDiff(
            undefined, b[bKey], state.dropArrayKeys()
          ).appendArrayKeysToDiffChunks(state)
            .restoreArrayKeys(state)
            .nextArrayKey2()
        );

        // If next has a better position than state's best,
        // then it's the new best parse.
        state = state.updateArrayBest(next);
      }

      // TODO(markdittmer): Do we need this guard?
      return state.best !== null ? state.best : state;
    },
  ],
});

foam.CLASS({
  package: 'foam.diff',
  name: 'Differ',

  axioms: [
    foam.pattern.Singleton.create(),
  ],

  requires: [
    'foam.diff.Undefined',
    'foam.diff.Primitive',
    'foam.diff.Object',
    'foam.diff.ObjectKey',
    'foam.diff.Array',
    'foam.diff.ArrayKey',
    'foam.diff.State',
  ],

  properties: [
    {
      class: 'FObjectArray',
      of: 'foam.diff.Type',
      name: 'types',
      factory: function() {
        return [
          this.Undefined.create(),
          this.Primitive.create(),
          this.Object.create(),
          this.ObjectKey.create(),
          this.Array.create(),
          this.ArrayKey.create(),
        ];
      },
    },
  ],

  methods: [
    function typeOf(o, state) {
      for (var i = 0; i < this.types.length; i++) {
        if (this.types[i].isInstance(o, state)) return this.types[i];
      }
      foam.assert(false, 'Expected to find type for', o, state);
      return this.types[0];
    },
    function structuredDiff(a, b) {
      return this.statefulStructuredDiff(a, b, this.State.create()).diffChunks;
    },
    function statefulStructuredDiff(a, b, state) {
      if (a === b || !state.isValid()) return state;

      var at = this.typeOf(a, state);
      var bt = this.typeOf(b, state);

      for (var i = 0; i < this.types.length; i++) {
        if (at === this.types[i]) {
          return this.types[i].statefulStructuredDiff(a, b, state);
        } else if (bt === this.types[i])  {
          return this.types[i].statefulStructuredDiff(b, a, state)
            .flip(state);
        }
      }
    },
  ],
});
