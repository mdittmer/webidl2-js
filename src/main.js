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

require('./diff.js');
require('./parser.js');
require('./outputer.js');

var differ = foam.diff.Differ.create();
var diff = differ.structuredDiff.bind(differ);

module.exports = {
  Differ: foam.diff.Differ,
  Outputer: foam.webidl.Outputer,
  Parser: foam.webidl.Parser,
  diff: diff,
  differ: differ,
  outputer: foam.webidl.Outputer.create(),
  parser: foam.webidl.Parser.create(),
};
