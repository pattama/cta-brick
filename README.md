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

# name
A unique name that describe your Brick
 
# module
The path to the Brick source code.

It can be a node module (eg. 'cta-io') or a relative path to `Application Base Directory`
(eg. './path/to/your/brick' or '../path/to/your/brick')

Application Base Directory is set as a second argument when you instantiate
[Cement](https://git.sami.int.thomsonreuters.com/compass/cta-flowcontrol).
````js
const cement = new Cement(config, applicationBaseDirectory);
````

# dependencies
Tools dependencies that would be injected to the Brick by Cement. It should be an object
where keys are the references that are used inside the Brick source code and values are
references to Tools names defined in the application configuration.

Example with a full configuration
````js
module.exports = {
  tools: [{
    name: 'some-tool',
    ...
  }],
  bricks: [{
    name: 'mybrick',
    module: './path/to/your/brick',
    dependencies: {
      mytool: 'some-tool',      
    },
    ...
  }]
};
````

Here you can access the Tool some-tool by its reference `this.dependencies.mytool`