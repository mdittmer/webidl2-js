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

// Tokenized parsing. This allows a parser to store a notion of its "token
// separator" and use shorthands for token-separated parser combinators.
//
// E.g., "foo bar", "foo//comment\nbar" and "foo/*comment*/bar" should all be
// parsed as two separate identifiers. This can be expressed using
// tseq('foo', 'bar') -- that is, "tokenized sequence: foo, bar".

foam.CLASS({
  package: 'foam.parse',
  name: 'TokenizedParser',

  properties: [
    {
      name: 'separator',
      final: true,
      class: 'foam.parse.ParserProperty',
    },
  ],
});

foam.CLASS({
  package: 'foam.parse',
  name: 'TokenSequence',
  extends: 'foam.parse.Sequence',
  implements: ['foam.parse.TokenizedParser'],

  methods: [
    // TODO: Write compile() for compiled parser support.

    function parse(ps, obj) {
      var ret = [];
      var args = this.args;
      var sep = this.separator;
      for (var i = 0, p; p = args[i]; i++) {
        if (!(ps = p.parse(ps, obj))) return undefined;
        ret.push(ps.value);

        if (i === args.length - 1) continue;

        if (!(ps = sep.parse(ps, obj))) return undefined;
      }
      return ps.setValue(ret);
    },
  ],
});

foam.CLASS({
  package: 'foam.parse',
  name: 'TokenSequence1',
  extends: 'foam.parse.Sequence1',
  implements: ['foam.parse.TokenizedParser'],

  methods: [
    // TODO: Write compile() for compiled parser support.

    function parse(ps, obj) {
      var ret;
      var args = this.args;
      var sep = this.separator;
      var n = this.n;
      for (var i = 0, p; p = args[i]; i++) {
        if (!(ps = p.parse(ps, obj))) return undefined;
        if (i === n) ret = ps.value;

        if (i === args.length - 1) continue;

        if (!(ps = sep.parse(ps, obj))) return undefined;
      }
      return ps.setValue(ret || '');
    },
  ],
});

foam.CLASS({
  package: 'foam.parse',
  name: 'TokenRepeat',
  extends: 'foam.parse.Repeat',
  implements: ['foam.parse.TokenizedParser'],

  methods: [
    // TODO: Write compile() for compiled parser support.

    function parse_(parser, obj, pss) {
      if (!pss.ps) return;
      pss.ps = parser.parse(pss.ps, obj);
      if (pss.ps) pss.last = pss.ps;
    },
    function parse(ps, obj) {
      var pss = {ps: ps, last: ps};
      var ret = [];
      var p = this.p;
      var delim = this.delimiter;
      var sep = this.separator;
      while (pss.ps) {
        this.parse_(p, obj, pss);
        if (pss.ps) ret.push(pss.ps.value);
        else break;

        // Token separators appear before and after delimiter.
        this.parse_(sep, obj, pss);
        if (delim) {
          this.parse_(delim, obj, pss);
          this.parse_(sep, obj, pss);
        }
      }

      if (this.minimum > 0 && ret.length < this.minimum) return undefined;
      return pss.last.setValue(ret);
    },
  ],
});

foam.CLASS({
  package: 'foam.parse',
  name: 'TokenPlus',
  extends: 'foam.parse.TokenRepeat',

  properties: [
    ['minimum', 1],
  ],
});

foam.CLASS({
  package: 'foam.parse',
  name: 'TokenParsers',
  extends: 'foam.parse.Parsers',

  axioms: [
    // Reuse TokenParsers if created with same separator.
    foam.pattern.Multiton.create({property: 'separator'}),
  ],

  properties: [
    {
      name: 'separator',
      class: 'foam.parse.ParserProperty',
      final: true,
    },
  ],

  methods: [
    function tseq() {
      return foam.lookup('foam.parse.TokenSequence').create({
        args: Array.from(arguments),
        separator: this.separator,
      });
    },
    function tseq1(n) {
      return foam.lookup('foam.parse.TokenSequence1').create({
        args: Array.from(arguments).slice(1),
        n: n,
        separator: this.separator,
      });
    },
    function trepeat(p, delim, min) {
      return foam.lookup('foam.parse.TokenRepeat').create({
        p: p,
        minimum: min || 0,
        delimiter: delim,
        separator: this.separator,
      });
    },
    function tplus(p, delim) {
      return foam.lookup('foam.parse.TokenPlus').create({
        p: p,
        delimiter: delim,
        separator: this.separator,
      });
    },
  ],
});
