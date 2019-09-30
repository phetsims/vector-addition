# Vector Addition - implementation notes

This document contains notes related to the implementation of Vector Addition. 
This is not an exhaustive description of the implementation.  The intention is 
to provide a high-level overview, and to supplement the internal documentation 
(source code comments) and external documentation (design documents).  

Before reading this document, please read:
* [model.md](https://github.com/phetsims/vector-addition/blob/master/doc/model.md), a high-level description of the simulation model

In addition to this document, you are encouraged to be read: 
* [PhET Development Overview](http://bit.ly/phet-html5-development-overview)  
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md)
* [Vector Addition HTML5](https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit), the design document

## Terminology

* "Active" vector means "selected" vector.  There is (at most) one active vector.
* component (scalar) versus componentVector (vector)
* graph orientation, see `GraphOrientations`
* coordinate snap mode, see `CoordinateSnapMode`
* component vector styles, see `ComponentStyles`

## General Considerations

This section describes how this simulation addresses implementation considerations that are typically encountered in PhET simulations.

**Coordinate Transforms**: TODO

**Memory Management**: TODO

**Query Parameters**: Query parameters are used to enable sim-specific features, mainly for debugging and
testing. Sim-specific query parameters are documented in
[VectorAdditionQueryParameters](https://github.com/phetsims/gas-properties/blob/master/js/common/VectorAdditionQueryParameters.js).

**Assertions**: The implementation makes heavy use of `assert` to verify pre/post assumptions and perform type checking. 
This sim performs type-checking for almost all function arguments via `assert`. If you are making modifications to this sim, do so with assertions enabled via the `ea` query parameter.

## Model

### Vector class hierarchy:

``` 
RootVector
  Vector (interactive)
    BaseVector
      CartesianBaseVector
      PolarBaseVector
    EquationVector
    SumVector
      EquationSumVector
  ComponentVector (not interactive)
```

## View

### Vector class hierarchy:

```
RootVectorNode
  VectorNode (interactive) 
    SumVectorNode
  ComponentVectorNode (not interactive)
    SumComponentVectorNode 
```

## Equation screen

TODO describe differences
