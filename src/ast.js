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
      class: 'String',
      name: 'name',
    },
  ],

  methods: [
    function compareTo(other) {
      if (this.name < other.name) return -1;
      else if (this.name > other.name) return 1;
      return this.SUPER(other);
    },
  ],
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Inheritable',

  properties: [
    {
      class: 'String',
      name: 'inheritsFrom',
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
      if (this.name < other.name) return -1;
      else if (this.name > other.name) return 1;
      return 0;
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
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'ExtendedAttributeArgList',
  extends: 'foam.webidl.ExtendedAttribute',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Parameterized',
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
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'ExtendedAttributeNamedArgList',
  extends: 'foam.webidl.ExtendedAttribute',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Defaulted',
  ],

  properties: [
    {
      class: 'String',
      name: 'opName',
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
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Namespace',
  extends: 'foam.webidl.DefinitionData',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Membered',
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
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Enum',
  extends: 'foam.webidl.DefinitionData',
  implements: [
    'foam.webidl.Named',
    'foam.webidl.Membered',
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
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Implements',
  extends: 'foam.webidl.DefinitionData',

  properties: [
    {
      class: 'String',
      name: 'implementer',
    },
    {
      class: 'String',
      name: 'implemented',
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
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Iterable',
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
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'SetLike',
  extends: 'foam.webidl.MemberData',
  implements: [
    'foam.webidl.AttributeLike',
    'foam.webidl.Typed',
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

  properties: [
    {
      class: 'Enum',
      of: 'foam.webidl.SerializerPatternType',
      name: 'type',
    },
    {
      class: 'StringArray',
      name: 'parts',
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
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'DecInteger',
  extends: 'foam.webidl.Literal',
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'HexInteger',
  extends: 'foam.webidl.Literal',
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'OctInteger',
  extends: 'foam.webidl.Literal',
});

foam.CLASS({
  package: 'foam.webidl',
  name: 'Float',
  extends: 'foam.webidl.Literal',
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
    function toWebIDL() {
      return '"' + this.literal + '"';
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

foam.CLASS({
  package: 'foam.webidl',
  name: 'Infinity',
  extends: 'foam.webidl.Literal',

  properties: [
    {
      class: 'Boolean',
      name: 'isNegative',
    },
  ],
});
