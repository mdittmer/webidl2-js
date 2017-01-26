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

// Extensions to built-in FOAM parsing.

foam.CLASS({
  package: 'foam.parse',
  name: 'Plus0',
  extends: 'foam.parse.ParserDecorator',

  methods: [
    // TODO: Write compile() for compiled parser support.
    function parse(ps, obj) {
      var res;
      var found;
      var p = this.p;
      while (res = p.parse(ps, obj)) {
        found = true;
        ps = res;
      }
      if (found === undefined) return undefined;
      return ps.setValue('');
    },
  ],
});

foam.CLASS({
  refines: 'foam.parse.Parsers',

  methods: [
    function plus0(p) {
      return foam.lookup('foam.parse.Plus0').create({p: p});
    },
  ],
});

foam.CLASS({
  refines: 'foam.parse.ParserWithAction',

  methods: [
    function parse(ps, obj) {
      var start = ps.pos;
      ps = this.p.parse(ps, obj);
      return ps ?
        ps.setValue(this.action(ps.value, start, ps.pos)) :
        undefined;
    },
  ],
});
