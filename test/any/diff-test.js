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

describe('diff', function() {
  var DT = foam.diff.DiffType;
  var DC = foam.diff.DiffChunk.create.bind(foam.diff.DiffChunk);
  var equals = foam.util.equals.bind(foam.util);
  var differ = foam.diff.Differ.create();
  var diff = differ.structuredDiff.bind(differ);
  it('should have no diff for (undefined, undefined)', function() {
    expect(diff(undefined, undefined)).toEqual([]);
  });
  it('should have no diff for (null, null)', function() {
    expect(diff(null, null)).toEqual([]);
  });
  it('should add null for (undefined, null)', function() {
    expect(equals(diff(undefined, null), [DC({type: DT.ADD, value: null})]))
      .toBe(true);
  });
  it('should remove null for (null, undefined)', function() {
    expect(equals(diff(null, undefined), [DC({type: DT.REMOVE, value: null})]))
      .toBe(true);
  });
  it('should add 0 for (undefined, 0)', function() {
    expect(equals(diff(undefined, 0), [DC({type: DT.ADD, value: 0})]))
      .toBe(true);
  });
  it('should remove 0 for (0, undefined)', function() {
    expect(equals(diff(0, undefined), [DC({type: DT.REMOVE, value: 0})]))
      .toBe(true);
  });
  it('should add 1 for (undefined, 1)', function() {
    expect(equals(diff(undefined, 1), [DC({type: DT.ADD, value: 1})]))
      .toBe(true);
  });
  it('should remove 1 for (1, undefined)', function() {
    expect(equals(diff(1, undefined), [DC({type: DT.REMOVE, value: 1})]))
      .toBe(true);
  });
  it('should add 1 for (null, 1)', function() {
    expect(equals(diff(null, 1), [
      DC({type: DT.REMOVE, value: null}),
      DC({type: DT.ADD, value: 1}),
    ])).toBe(true);
  });
  it('should remove 1 for (1, null)', function() {
    expect(equals(diff(1, null), [
      DC({type: DT.REMOVE, value: 1}),
      DC({type: DT.ADD, value: null}),
    ])).toBe(true);
  });
  it('should add false for (null, false)', function() {
    expect(equals(diff(null, false), [
      DC({type: DT.REMOVE, value: null}),
      DC({type: DT.ADD, value: false}),
    ])).toBe(true);
  });
  it('should remove false for (false, null)', function() {
    expect(equals(diff(false, null), [
      DC({type: DT.REMOVE, value: false}),
      DC({type: DT.ADD, value: null}),
    ])).toBe(true);
  });
  it('should add \'\' for (null, \'\')', function() {
    expect(equals(diff(null, ''), [
      DC({type: DT.REMOVE, value: null}),
      DC({type: DT.ADD, value: ''}),
    ])).toBe(true);
  });
  it('should remove \'\' for (\'\', null)', function() {
    expect(equals(diff('', null), [
      DC({type: DT.REMOVE, value: ''}),
      DC({type: DT.ADD, value: null}),
    ])).toBe(true);
  });
  it('should add \'foo\' for (null, \'foo\')', function() {
    expect(equals(diff(null, 'foo'), [
      DC({type: DT.REMOVE, value: null}),
      DC({type: DT.ADD, value: 'foo'}),
    ])).toBe(true);
  });
  it('should remove \'foo\' for (\'foo\', null)', function() {
    expect(equals(diff('foo', null), [
      DC({type: DT.REMOVE, value: 'foo'}),
      DC({type: DT.ADD, value: null}),
    ])).toBe(true);
  });
  it('should be no diff for ({}, {})', function() {
    expect(equals(diff({}, {}), [])).toBe(true);
  });
  it('should add foo: null for ({}, {foo: null})', function() {
    expect(equals(diff({}, {foo: null}), [
      DC({type: DT.ADD, revPath: ['foo'], value: null})
    ]))
     .toBe(true);
  });
  it('should remove foo: null for ({foo: null}, {})', function() {
    expect(equals(diff({foo: null}, {}), [
      DC({type: DT.REMOVE, revPath: ['foo'], value: null}),
    ]))
     .toBe(true);
  });
  it(
    'should remove foo: null and add foo: false for ({foo: null}, {foo: false})',
    function() {
      expect(equals(diff({foo: null}, {foo: false}), [
        DC({type: DT.REMOVE, revPath: ['foo'], value: null}),
        DC({type: DT.ADD, revPath: ['foo'], value: false}),
      ])).toBe(true);
    }
  );
  it(
    'should maintain equality over large objects',
    function() {
      var o1 = {
        foo: {
          bar: {
            baz: true,
          },
          quz: '',
        },
        quuz: {
          quuuz: {
            quuuuz: 0,
          },
          quuuuuz: 1,
        }
      };
      var o2 = JSON.parse(JSON.stringify(o1));
      expect(equals(diff(o1, o2), [])).toBe(true);
    }
  );
  it(
    'should capture diffs of differen types over large objects',
    function() {
      var o1 = {
        alpha: {
          beta: {
            charlie: true,
          },
          delta: '',
        },
        epsilon: {
          foxtrot: {
            golf: 0,
          },
          hotel: 1,
        }
      };
      var newCharlie = 'str';
      var india = {a: {b: 'c'}};
      var o2 = {
        alpha: {
          beta: {},
          charlie: newCharlie,
          delta: '',
        },
        epsilon: {
          foxtrot: {
            golf: null,
          },
        },
        india: india,
      };
      expect(equals(diff(o1, o2), [
        DC({type: DT.REMOVE, revPath: ['charlie', 'beta', 'alpha'], value: true}),
        DC({type: DT.ADD, revPath: ['charlie', 'alpha'], value: newCharlie}),
        DC({type: DT.REMOVE, revPath: ['golf', 'foxtrot', 'epsilon'], value: 0}),
        DC({type: DT.ADD, revPath: ['golf', 'foxtrot', 'epsilon'], value: null}),
        DC({type: DT.REMOVE, revPath: ['hotel', 'epsilon'], value: 1}),
        DC({type: DT.ADD, revPath: ['india'], value: india}),
      ])).toBe(true);
    }
  );
  it('should be no diff for ([], [])', function() {
    expect(equals(diff([], []), [])).toBe(true);
  });
  it('should add 0: \'foo\' to diff for ([], [\'foo\'])', function() {
    expect(equals(diff([], ['foo']), [
      DC({type: DT.ADD, revPath: ['0'], value: 'foo'}),
    ])).toBe(true);
  });
  it('should remove 0: \'foo\' to diff for ([\'foo\'], [])', function() {
    expect(equals(diff(['foo'], []), [
      DC({type: DT.REMOVE, revPath: ['0'], value: 'foo'}),
    ])).toBe(true);
  });
  it('should remove 0: \'foo\' to diff for ([\'foo\'], [])', function() {
    expect(equals(diff(['foo'], []), [
      DC({type: DT.REMOVE, revPath: ['0'], value: 'foo'}),
    ])).toBe(true);
  });
  it('should align diff for ([0, 1], [1, 2])', function() {
    expect(equals(diff([0, 1], [1, 2]), [
      DC({type: DT.REMOVE, revPath: ['0'], value: 0}),
      DC({type: DT.ADD, revPath: ['1'], value: 2}),
    ])).toBe(true);
  });
});
