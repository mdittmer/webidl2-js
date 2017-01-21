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

foam.CLASS({
  package: 'foam.webidl',
  name: 'Outputer',

  properties: [
    {
      class: 'String',
      name: 'buf_',
      value: '',
    },
    {
      class: 'Int',
      name: 'indentLevel_',
      value: 0,
    },
    {
      class: 'String',
      name: 'indentStr',
      value: '  ',
    },
    {
      class: 'String',
      name: 'nlStr',
      value: '\n',
    },
    {
      class: 'Boolean',
      name: 'pretty',
      value: true,
      postSet: function(_, p) {
        if (p) {
          this.clearProperty('indentStr');
          this.clearProperty('nlStr');
        } else {
          this.indentStr = this.nlStr = null;
        }
      },
    },
  ],

  methods: [
    function reset() {
      this.indentLevel_ = 0;
      this.buf_ = '';
      return this;
    },
    function out() {
      for (var i = 0; i < arguments.length; i++) this.buf_ += arguments[i];
      return this;
    },
    function start(c) {
      if (c) this.out(c).nl();
      if (this.indentStr) {
        this.indentLevel_++;
        this.indent();
      }
      return this;
    },
    function end(c) {
      this.indentLevel_--;
      if (c) this.indent().out(c);
      return this;
    },
    function nl() {
      if (this.nlStr && this.nlStr.length !== 0)
        this.out(this.nlStr);
      return this;
    },
    function indent() {
      for (var i = 0; i < this.indentLevel_; i++) this.out(this.indentStr);
      return this;
    },
    function forEach(arr, opt_start, opt_end, opt_sep) {
      if (arr.length < 2) {
        if (opt_start) this.out(opt_start);
        if (arr.length === 1) this.output(arr[0]);
        if (opt_end) this.out(opt_end);
        return this;
      }

      if (opt_start) this.start(opt_start);

      for (var i = 0; i < arr.length; i++) {
        var last = i === arr.length - 1;
        this.output(arr[i]);
        if (last) {
          this.nl();
        } else {
          if (opt_sep) this.out(opt_sep);
          this.nl().indent();
        }
      }

      if (opt_end) this.end(opt_end);
      return this;
    },
    function output(o) {
      foam.assert(
        o.outputWebIDL, 'Object', o, 'does not implement outputWebIDL()'
      );
      o.outputWebIDL(this);
      return this;
    },
    function stringify(o) {
      this.output(o);
      var ret = this.buf_;
      this.reset();
      return ret;
    },
  ],
});
