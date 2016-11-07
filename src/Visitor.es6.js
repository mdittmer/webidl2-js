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
const serialize = require('serialize-js');
const defaultRegistry = serialize.registry;

function noop() {}
function trueF() { return true; }
function falseF() { return false; }

class Visitor {
  static get noop() { return noop; }
  static get trueF() { return trueF; }
  static get falseF() { return falseF; }

  constructor(opts) {
    this.init(opts || {});
  }

  init(opts) {
    this.shouldVisitNode = opts.shouldVisitNode || falseF;
    this.shouldVisitTree = opts.shouldVisitTree || falseF;
    this.visit = opts.visit || noop;
    this.registry = opts.registry || defaultRegistry;
  }

  visitNode(node) {
    if (!this.shouldVisitNode(node)) return;
    this.visit(node);
  }

  visitTree(root) {
    if (!this.shouldVisitTree(root)) return;
    this.visitNode(root);
    _.forOwn(root, node => this.visitTree(node));
  }
}

module.exports = Visitor;
