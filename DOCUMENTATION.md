## Classes

<dl>
<dt><a href="#Brick">Brick</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#BrickConfig">BrickConfig</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Job">Job</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="Brick"></a>

## Brick
**Kind**: global class  

* [Brick](#Brick)
    * [new Brick(cementHelper, config)](#new_Brick_new)
    * [._initialized()](#Brick+_initialized)
    * [.init()](#Brick+init)
    * [.start()](#Brick+start)
    * [.validate(context)](#Brick+validate) ⇒ <code>Promise</code>
    * [.process(context)](#Brick+process)

<a name="new_Brick_new"></a>

### new Brick(cementHelper, config)
Create a new Brick instance


| Param | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| config | <code>[BrickConfig](#BrickConfig)</code> | cement configuration of the brick |

<a name="Brick+_initialized"></a>

### brick._initialized()
This method should not be override by child bricksIt emits "initialized" event to the Cement to tell him i'm ready to be plugged into the flowImportant: we add a delay of 100ms for the Cement to first instanciate the Brick before listening to its eventeg. if you emit the event in the brick constructor, the cement won't see it

**Kind**: instance method of <code>[Brick](#Brick)</code>  
<a name="Brick+init"></a>

### brick.init()
This method is called by Cement before starting pub/sub between BricksIt should be override only by child Bricks that need initialization before being plugged into the flowie. connect to MQ, Db, starting server...etcImportant: you should call this._initialized() when your brick is really readyfor test case, you can simulate in your brick a random delay eg.const delay = 1000 * Math.ceil(1 + 3 * Math.random());const that = this;setTimeout(function() {  that._initialized();}, delay);

**Kind**: instance method of <code>[Brick](#Brick)</code>  
<a name="Brick+start"></a>

### brick.start()
This method is called by Cement when all other Bricks are initialized and readyIt should be override only by child Bricks that directly publish data to the flowwithout having to wait for other bricks to get data from (eg. Receiver)It guarantees that Bricks interconnection are done by the Cement

**Kind**: instance method of <code>[Brick](#Brick)</code>  
<a name="Brick+validate"></a>

### brick.validate(context) ⇒ <code>Promise</code>
Validates Context properties

**Kind**: instance method of <code>[Brick](#Brick)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Brick+process"></a>

### brick.process(context)
Process the context

**Kind**: instance method of <code>[Brick](#Brick)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BrickConfig"></a>

## BrickConfig : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of the brick instance (should be unique) |
| module | <code>String</code> | path or name of the brick module |
| properties | <code>Object</code> | properties to instantiate the brick (see the module definition) |
| links | <code>Array.&lt;LinkConfig&gt;</code> | Array of LinkConfig |

<a name="Job"></a>

## Job : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | id of the job |
| nature | <code>Object</code> | nature description of the job |
| nature.quality | <code>String</code> | quality of the job |
| nature.type | <code>String</code> | type of the job |
| payload | <code>Object</code> | payload of the job |

