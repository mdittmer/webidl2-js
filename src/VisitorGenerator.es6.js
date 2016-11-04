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
const Visitor = require('./Visitor.es6.js');
const registryModule = require('./registry.es6.js');

class VisitorGenerator {
  constructor(registry) {
    this.registry = registry || registryModule.registry;
  }

  generate(Ctor) {
    const visit = Ctor.prototype.visit;
    let types = [];

    _.eachOwn(Ctor.prototype, member => {
      if (typeof member !== 'function' ||
          !member.name.match(/^visit[A-Z][A-Za-z_]*$/))
        return;
      types.push(member.name.substr('visit'.length));
    });

    const shouldVisitNode = function(node) {
      types.forEach(typeName => {
        const Ctor = this.registry.lookup(typeName);
        if (!Ctor) return;
        if (node instanceof Ctor) this.visit(node);
      });
    };

    return new Visitor({
      shouldVisitTree: Visitor.trueF,
      registry: this.registry,
      shouldVisitNode,
      visit,
    });
  }
}

module.exports = VisitorGenerator;
