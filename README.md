Base Brick for Compass Test Automation
======================================

This is the base of Compass Test Automation [Brick Concept](https://git.sami.int.thomsonreuters.com/compass/cta/cement.md#bricks)

It is not intended to be part of a CTA application Bricks. Bricks should first extend this base Brick and then set their properties and methods.
See [cta-brick-boilerplate](https://git.sami.int.thomsonreuters.com/compass/cta-brick-boilerplate) for usage.

# Brick configuration

A full brick configuration looks like below: 

````js
module.exports = {
  name: 'mybrick',
  module: './path/to/module',
  dependencies: {
    foo: 'foo',
    bar: 'bar',
  },
  properties: {
    port: 3000,
    timeout: 15000,
    filepath: '/path/to/file',
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

## Name
A unique name that describe your Brick
 
## Module
The path to the Brick source code.

It can be a node module (eg. 'cta-io') or a relative path to `Application Base Directory`
(eg. './bricks/foo' or '../lib/bar')

Application Base Directory is set as a second argument when you instantiate
[Cement](https://git.sami.int.thomsonreuters.com/compass/cta-flowcontrol).
````js
const cement = new Cement(config, applicationBaseDirectory);
````

## Dependencies
Brick dependencies are some optional [Tools](https://git.sami.int.thomsonreuters.com/compass/cta-tool) needed by the Brick in order to work properly.
Those Tools are usually shared between many bricks. They are injected by Cement when the application starts.
 
It should be an object where:

- keys are references that would be used inside the Brick source code
- values are references to Tools names defined in the application full configuration.

Example with a full application configuration with one brick and one tool:

````js
module.exports = {
  tools: [{
    name: 'some-tool',
    ...
  }],
  bricks: [{
    name: 'some-brick',
    module: './path/to/somebrick',
    dependencies: {
      mytool: 'some-tool',
    },
    ...
  }]
};
````

In this example, inside source code of the brick you can access the Tool some-tool by its reference `this.dependencies.mytool`

## Properties

Brick properties are some optional parameters used by the Brick that control how it behaves (eg. PORT number, timeout value, interval value...etc).

You can access those parameters by their references (eg. `this.properties.port` and `this.properties.filepath`)

## Publish and Subscribe

This is where you define your publishing and subscribing [contracts](https://git.sami.int.thomsonreuters.com/compass/cta/cement.md#contracts)

A contract is composed of a topic, where you publish to or subscribe to, and one or many data natures (type & quality) that describe the data flow.

When a Brick publish with a contract, there should be another brick that subscribe with the same contract.

TODO: sequence diagram

### Publish

In order to publish some data into the flow, you have to use CementHelper for that `this.cementHelper.createContext(data).publish();`
 
The data nature should match the contract you define in the publish configuration.
 
Example with the brick above:

````js
this.cementHelper.createContext({
  nature: {
    type: 'some-type',
    quality: 'some-quality',
  },
  payload: {
    a: 1,
    b: 2,
  },
}).publish();
````

### Subscribe

When you define a subscribe field in a Brick configuration, your Brick is already subscribed to consume data that may be published in the flow with the same contract.
 
This is done thanks to Cement. All you have to do in your Brick is to define how would you treat the consumed data. This should be done in [process](#process) method

## Brick methods

### Process

This method is called by Cement whenever a Brick consumes data that have been published by another Brick with the same contract.

