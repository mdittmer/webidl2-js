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

describe('Comparing parses', function() {
  function cmpTest(input, name) {
    var firstParseValue =
      foam.webidl.Parser.create().parseString(input).value;
    var outputer = foam.webidl.Outputer.create();

    for (var i = 0; i < firstParseValue.length; i++) {
      var firstFragment = firstParseValue[i];
      var stringified = outputer.stringify(firstFragment);
      var secondParseValue =
        foam.webidl.Parser.create().parseString(stringified).value;
      var secondFragment = secondParseValue[0];
      expect(
        foam.util.compare(firstFragment, secondFragment),
        'parse(' + name + ')[' + i + '] == parse(stringify(parse(' + name +
          ')[' + i + ']))'
      );
    }
  }

  it(
    'parse(spec) == parse(stringify(parse(spec)))',
    cmpTest.bind(this, global.some_spec_idl, 'spec')
  );

  it(
    'parse(blink) == parse(stringify(parse(blink)))',
    cmpTest.bind(this, global.all_blink_idl, 'blink')
  );
});
