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

// TODO(markdittmer): All properties in AST nodes should probably be final.

foam.CLASS({
  package: 'foam.webidl',
  name: 'Named',

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Literal',
      name: 'name',
    },
  ],

  methods: [
    function compareTo(other) {
      if ((!this.cls_.isInstance(other)) || (!this.name) || (!other.name))
        return this.SUPER(other);

      var left = this.name.literal;
      var right = other.name.literal;
      if (left < right) return -1;
      else if (left > right) return 1;

      return this.SUPER(other);
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Inheritable',

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Literal',
      name: 'inheritsFrom',
      value: null,
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Returner',

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Type',
      name: 'returnType',
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Attributed',

  properties: [
    {
      class: 'FObjectArray',
      of: 'foam.webidl.ExtendedAttribute',
      name: 'attrs',
      adapt: function(_, attrs) {
        return attrs.sort(foam.util.compare);
      },
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Parameterized',

  properties: [
    {
      class: 'FObjectArray',
      of: 'foam.webidl.Argument',
      name: 'args',
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Member',
  implements: [
    'foam.webidl.Attributed',
  ],

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.MemberData',
      name: 'member',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      if (this.attrs.length > 0)
        o.forEach(this.attrs, '[', ']', ',').nl().indent();
      o.output(this.member);
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'MemberData',
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Membered',

  properties: [
    {
      class: 'FObjectArray',
      of: 'foam.webidl.Member',
      name: 'members',
      adapt: function(_, members) {
        return members.sort(foam.util.compare);
      },
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Defaulted',

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Literal',
      name: 'value',
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Typed',

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Type',
      name: 'type',
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'ExtendedAttribute',

  methods: [
    function compareTo(other) {
      if (!this.cls_.isInstance(other)) return this.SUPER(other);

      var left = this.name ? this.name.literal : '';
      var right = other.name ? other.name.literal : '';
      if (left < right) return -1;
      else if (left > right) return 1;

      return this.SUPER(other);
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'ExtendedAttributeNoArgs',
  extends: 'foam.webidl.ExtendedAttribute',
  implements: [
    'foam.webidl.Named',
  ],

  methods: [
    function outputWebIDL(o) {
      o.output(this.name);
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'ExtendedAttributeArgList',
  extends: 'foam.webidl.ExtendedAttribute',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Parameterized',
  ],

  methods: [
    function outputWebIDL(o) {
      o.output(this.name).forEach(this.args, '(', ')', ',');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'ExtendedAttributeIdentifierOrString',
  extends: 'foam.webidl.ExtendedAttribute',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Defaulted',
  ],

  methods: [
    function outputWebIDL(o) {
      o.output(this.name).out('=').output(this.value);
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'ExtendedAttributeNamedArgList',
  extends: 'foam.webidl.ExtendedAttribute',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Parameterized',
  ],

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Literal',
      name: 'opName',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      o.output(this.name).out('=').output(this.opName)
        .forEach(this.args, '(', ')', ',');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'ExtendedAttributeIdentList',
  extends: 'foam.webidl.ExtendedAttribute',
  implements: [
    'foam.webidl.Named',
  ],

  properties: [
    {
      class: 'FObjectArray',
      of: 'foam.webidl.Literal',
      name: 'args',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      o.output(this.name).out('=').forEach(this.args, '(', ')', ',');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'DictionaryMemberData',
  extends: 'foam.webidl.MemberData',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Typed',
    'foam.webidl.Defaulted',
  ],

  properties: [
    {
      class: 'Boolean',
      name: 'isRequired',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      if (this.isRequired) o.out('required ');
      o.output(this.type).out(' ').output(this.name);
      if (this.value) o.out(' = ').output(this.value);
      o.out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'AttributeLike',

  properties: [
    {
      class: 'Boolean',
      name: 'isInherited',
      value: false,
    },
    {
      class: 'Boolean',
      name: 'isReadOnly',
      value: false,
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Definition',
  implements: ['foam.webidl.Attributed'],

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.DefinitionData',
      name: 'definition',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      if (this.attrs.length > 0)
        o.forEach(this.attrs, '[', ']', ',').nl().indent();
      o.output(this.definition);
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'DefinitionData',

  properties: [
    {
      class: 'Boolean',
      name: 'isPartial',
      value: false,
    },
  ],

  methods: [
    function outputWebIDL(o) {
      if (this.isPartial) o.out('partial ');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Callback',
  extends: 'foam.webidl.DefinitionData',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Returner',
    'foam.webidl.Parameterized',
  ],

  methods: [
    function outputWebIDL(o) {
      this.SUPER(o);
      o.out('callback ').output(this.name).out(' = ').output(this.returnType)
        .forEach(this.args, '(', ')', ',').out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'CallbackInterface',
  extends: 'foam.webidl.DefinitionData',

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Interface',
      name: 'interface',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      this.SUPER(o);
      o.out('callback ').output(this.interface);
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Interface',
  extends: 'foam.webidl.DefinitionData',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Inheritable',
    'foam.webidl.Membered',
  ],

  methods: [
    function outputWebIDL(o) {
      this.SUPER(o);
      o.out('interface ').output(this.name).out(' ');
      if (this.inheritsFrom) o.out(': ').output(this.inheritsFrom).out(' ');
      o.forEach(this.members, '{', '}');
      o.out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Exception',
  extends: 'foam.webidl.DefinitionData',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Inheritable',
    'foam.webidl.Membered',
  ],

  methods: [
    function outputWebIDL(o) {
      this.SUPER(o);
      o.out('exception ').output(this.name).out(' ');
      if (this.inheritsFrom) o.out(': ').output(this.inheritsFrom).out(' ');
      o.forEach(this.members, '{', '}').out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Namespace',
  extends: 'foam.webidl.DefinitionData',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Membered',
  ],

  methods: [
    function outputWebIDL(o) {
      this.SUPER(o);
      o.out('namespace ').output(this.name).out(' ').forEach(this.members, '{', '}')
        .out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Dictionary',
  extends: 'foam.webidl.DefinitionData',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Inheritable',
    'foam.webidl.Membered',
  ],

  methods: [
    function outputWebIDL(o) {
      this.SUPER(o);
      o.out('dictionary ').output(this.name).out(' ');
      if (this.inheritsFrom) o.out(': ').output(this.inheritsFrom).out(' ');
      o.forEach(this.members, '{', '}').out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Enum',
  extends: 'foam.webidl.DefinitionData',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Membered',
  ],

  methods: [
    function outputWebIDL(o) {
      this.SUPER(o);
      o.out('enum ').output(this.name).out(' ')
        .forEach(this.members, '{', '}', ',').out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Typedef',
  extends: 'foam.webidl.DefinitionData',
  implements: [
    'foam.webidl.Named',
  ],

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Type',
      name: 'type',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      this.SUPER(o);
      o.out('typedef ').output(this.type).out(' ').output(this.name).out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Implements',
  extends: 'foam.webidl.DefinitionData',

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Literal',
      name: 'implementer',
    },
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Literal',
      name: 'implemented',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      this.SUPER(o);
      o.output(this.implementer).out(' implements ').output(this.implemented)
        .out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'StaticMember',
  extends: 'foam.webidl.MemberData',

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Attribute',
      name: 'attribute',
    },
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Operation',
      name: 'operation',
    },
  ],

  methods: [
    function compareTo(other) {
      if (!this.cls_.isInstance(other)) return this.SUPER(other);

      return foam.util.compare(
        this.attribute || this.operation,
        other.attribute || other.operation
      );
    },
    function outputWebIDL(o) {
      o.out('static ');
      if (this.attribute)
        o.output(this.attribute);
      else
        o.output(this.operation);
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Const',
  extends: 'foam.webidl.MemberData',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Defaulted',
    'foam.webidl.Typed',
  ],

  methods: [
    function outputWebIDL(o) {
      o.out('const ').output(this.type).out(' ').output(this.name).out(' = ')
        .output(this.value).out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Attribute',
  extends: 'foam.webidl.MemberData',
  implements: [
    'foam.webidl.AttributeLike',
    'foam.webidl.Named',
    'foam.webidl.Typed',
  ],

  methods: [
    function outputWebIDL(o) {
      if (this.isInherited) o.out('inherited ');
      if (this.isReadOnly) o.out('readonly ');
      o.out('attribute ').output(this.type).out(' ').output(this.name).out(';');
    },
  ],
});

foam.ENUM({
  package: 'foam.webidl',
  name: 'OperationQualifier',
  values: [
    {
      name: 'GETTER',
      label: 'getter',
    },
    {
      name: 'SETTER',
      label: 'setter',
    },
    {
      name: 'DELETER',
      label: 'deleter',
    },
    {
      name: 'LEGACY_CALLER',
      label: 'legacycaller',
    },
    {
      name: 'CREATOR',
      label: 'creator',
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Operation',
  extends: 'foam.webidl.MemberData',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Returner',
    'foam.webidl.Parameterized',
  ],

  properties: [
    {
      class: 'FObjectArray',
      of: 'foam.webidl.OperationQualifier',
      name: 'qualifiers',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      for (var i = 0; i < this.qualifiers.length; i++) {
        o.out(this.qualifiers[i].label, ' ');
      }
      o.output(this.returnType).out(' ');
      if (this.name) o.output(this.name);
      o.forEach(
        this.args, '(', ')', ','
      ).out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Iterable',
  extends: 'foam.webidl.MemberData',
  implements: [
    'foam.webidl.Typed',
  ],

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Type',
      name: 'valueType',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      var types = [this.type];
      if (this.valueType) types.push(this.valueType);
      o.out('iterable').forEach(types, '<', '>', ',').out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'MapLike',
  extends: 'foam.webidl.MemberData',
  implements: [
    'foam.webidl.AttributeLike',
    'foam.webidl.Typed',
  ],

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Type',
      name: 'valueType',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      if (this.isInherited) o.out('inherited ');
      if (this.isReadOnly) o.out('readonly ');
      o.out('maplike').forEach([this.type, this.valueType], '<', '>', ',')
        .out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'SetLike',
  extends: 'foam.webidl.MemberData',
  implements: [
    'foam.webidl.AttributeLike',
    'foam.webidl.Typed',
  ],

  methods: [
    function outputWebIDL(o) {
      if (this.isInherited) o.out('inherited ');
      if (this.isReadOnly) o.out('readonly ');
      o.out('setlike<').output(this.type).out('>;');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Serializer',
  extends: 'foam.webidl.MemberData',

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Operation',
      name: 'operation',
    },
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.SerializerPattern',
      name: 'pattern',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      o.out('serializer');
      if (this.operation) o.out(' ').output(this.operation);
      else if (this.pattern) o.out(' = ').output(this.pattern);
      o.out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Stringifier',
  extends: 'foam.webidl.MemberData',

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Attribute',
      name: 'attribute',
    },
    {
      class: 'FObjectProperty',
      of: 'foam.webidl.Operation',
      name: 'operation',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      o.out('stringifier');
      if (this.attribute) o.out(' ').output(this.attribute);
      else if (this.operation) o.out(' ').output(this.operation);
      else o.out(';');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Argument',
  implements: [
    'foam.webidl.Attributed',
    'foam.webidl.Typed',
    'foam.webidl.Named',
    'foam.webidl.Defaulted',
  ],

  properties: [
    {
      class: 'Boolean',
      name: 'isOptional',
      value: false,
    },
    {
      class: 'Boolean',
      name: 'isVariadic',
      value: false,
    },
  ],

  methods: [
    function outputWebIDL(o) {
      if (this.attrs.length > 0)
        o.forEach(this.attrs, '[', ']', ',').nl().indent();
      if (this.isOptional) o.out('optional ');
      o.output(this.type);
      if (this.isVariadic) o.out('... ');
      else o.out(' ');
      o.output(this.name);
      if (this.value) o.out(' = ').output(this.value);
    },
  ],
});

foam.ENUM({
  package: 'foam.webidl',
  name: 'TypeSuffix',
  values: [
    {
      name: 'NULLABLE',
      label: '?',
    },
    {
      name: 'ARRAY',
      label: '[]',
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Type',

  properties: [
    {
      class: 'FObjectArray',
      of: 'foam.webidl.TypeSuffix',
      name: 'suffixes',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      for (var i = 0; i < this.suffixes.length; i++) {
        o.out(this.suffixes[i].label);
      }
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'UnionType',
  extends: 'foam.webidl.Type',

  properties: [
    {
      class: 'FObjectArray',
      of: 'foam.webidl.Type',
      name: 'types',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      o.forEach(this.types, '(', ')', ' or');
      this.SUPER(o);
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'NonUnionType',
  extends: 'foam.webidl.Type',
  implements: [
    'foam.webidl.Named',
  ],

  properties: [
    {
      class: 'FObjectArray',
      of: 'foam.webidl.Type',
      name: 'params',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      o.output(this.name);
      if (this.params.length > 0) o.forEach(this.params, '<', '>', ',');
      this.SUPER(o);
    },
  ],
});

foam.ENUM({
  package: 'foam.webidl',
  name: 'SerializerPatternType',

  values: [
    {
      name: 'ARRAY',
      label: 'Array',
    },
    {
      name: 'MAP',
      label: 'Map',
    },
    {
      name: 'IDENTIFIER',
      label: 'Identifier',
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'SerializerPattern',
  requires: [
    'foam.webidl.SerializerPatternType',
  ],

  properties: [
    {
      class: 'Enum',
      of: 'foam.webidl.SerializerPatternType',
      name: 'type',
    },
    {
      class: 'FObjectArray',
      of: 'foam.webidl.Literal',
      name: 'parts',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      if (this.type === this.SerializerPatternType.IDENTIFIER) {
        o.out(this.parts[0]);
      } else if (this.type === this.SerializerPatternType.MAP) {
        o.forEach(this.parts, '{', '}', ',');
      } else if (this.type === this.SerializerPatternType.ARRAY) {
        o.forEach(this.parts, '[', ']', ',');
      }
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Literal',

  properties: [
    {
      class: 'String',
      name: 'literal',
    },
  ],

  methods: [
    function outputWebIDL(o) {
      o.out(this.literal);
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Number',
  extends: 'foam.webidl.Literal',

  properties: [
    {
      class: 'Boolean',
      name: 'isNegative',
      value: false,
    },
  ],

  methods: [
    function outputWebIDL(o) {
      if (this.isNegative) o.out('-');
      this.SUPER(o);
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'DecInteger',
  extends: 'foam.webidl.Number',
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'HexInteger',
  extends: 'foam.webidl.Number',
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'OctInteger',
  extends: 'foam.webidl.Number',
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Infinity',
  extends: 'foam.webidl.Number',

  properties: [
    {
      name: 'literal',
      value: 'Infinity',
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Float',
  extends: 'foam.webidl.Number',
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Identifier',
  extends: 'foam.webidl.Literal',
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'String',
  extends: 'foam.webidl.Literal',

  methods: [
    function outputWebIDL(o) {
      o.out('"', this.literal, '"');
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'EmptyArray',
  extends: 'foam.webidl.Literal',

  properties: [
    {
      name: 'literal',
      value: '[]',
    },
  ],
});
