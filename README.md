# cta-brick [ ![build status](https://git.sami.int.thomsonreuters.com/compass/cta-brick/badges/master/build.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-brick/commits/master) [![coverage report](https://git.sami.int.thomsonreuters.com/compass/cta-brick/badges/master/coverage.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-brick/commits/master)

Brick Modules for Compass Test Automation, One of Libraries in CTA-OSS Framework

## General Overview

### Overview

This module provides the **Brick** class to extend. To implement a brick, you need **Brick** class in **cta-brick** to **'extends'** and implement _your own brick_, see [Usage](#1-brick-class-usage). In the design, you probably have _many_ **bricks** to _process_ some works. Those bricks, you design, must **'extends'** from **Brick** class in **cta-brick**. The **Brick** provides some useful methods to implement, see [Structure](#2-brick-class-structure).

## Guidelines

We aim to give you brief guidelines here.

1. [Brick Class Usage](#1-brick-class-usage)
1. [Brick Class Structure](#2-brick-class-structure)
1. [Brick Class Constructor](#3-brick-class-constructor)
1. [Process in Brick](#4-process-in-brick)

### 1. Brick Class Usage

To create **a brick** for **CTA-OSS Framework**, we need to extend the class.

```javascript
const Brick = require("cta-brick");

class SampleBrick extends Brick {
  process(context) {
    // process work here
  }
}

module.exports = SampleBrick;
```

This example shows how to use **Brick**. We only implement the important method which is **process()**. 

[back to top](#guidelines)

### 2. Brick Class Structure

Here is a structure of **Brick** Class.

```javascript
class Brick {
  constructor(cementHelper, configuration);

  init(): Promise;

  start(): void;

  validate(context): Promise;
  
  process(context): Promise;

  health(data): void;
}
```

The **Brick** Class has _five_ methods.

* **init()** - to initialize the brick

* **start()** - to start the brick

* **validate()** - to perform validation

* **process()** - to perform process

* **health()** - to operate dependencies health check

To learn about **_Promise_**, click [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

[back to top](#guidelines)

### 3. Brick Class Constructor

In a constructor, the **Brick** uses _dependencies injection_ to make the dependencies available within Brick. Those dependencies which are **cementHelper** and **configuration** are provided by _cta-oss_ framework.

```javascript
class SampleBrick extends Brick {
  constructor(cementHelper, configuration) {
    super();  // to bind the dependencies
  }
}

module.exports = SampleBrick;
```

By calling **super()**, the _cementHelper_ and _configuration_ are bound and available within class context. They can be accesed in any method via **_this.cementHelper_** and **_this.configuration_**.

[back to top](#guidelines)

### 4. Process in Brick

Here we're going to describe process in **Brick**.

In CTA-OSS, we can informally define two phases for Bricks.

* In **Initial** Phase, Brick's **_init()_** and **_start()_** will be called **to initialize**_, and then_ **to start**

* In **Process** Phase, after Brick was started, it is ready for process. When there is incoming context, the Brick's **_validate()_** and **_process()_** will be called **to validate**_, and then_ **to process** some works

[back to top](#guidelines)

------

## To Do