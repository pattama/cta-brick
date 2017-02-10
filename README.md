Base Brick for Compass Test Automation
======================================

This is the base of Compass Test Automation [Brick Concept](https://git.sami.int.thomsonreuters.com/compass/cta/cement.md#bricks)

It is not intended to be part of a CTA application Bricks.
 
Bricks should first extend this base Brick and then set their properties and methods. See [cta-brick-boilerplate](https://git.sami.int.thomsonreuters.com/compass/cta-brick-boilerplate) for usage.

The most important part of a Brick is its configuration that should look like below

````js
'use strict';

module.exports = {
  name: 'mybrick',
  module: './path/to/your/brick',
  dependencies: {
    foo: 'foo',
    bar: 'bar',
  },
  properties: {
    a: 1,
    b: 'c',
  },
  publish: [
    {
      topic: 'some-topic',
      data: [
        {
          nature: {
            type: 'some-type',
            quality: 'some-quality',
          },
        },
      ],
    },
  ],
  subscribe: [
    {
      topic: 'some-other-topic',
      data: [
        {
          nature: {
            type: 'some-other-type',
            quality: 'some-other-quality',
          },
        },
      ],
    },
  ],
};
````

