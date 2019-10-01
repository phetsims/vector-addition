# Vector Addition - implementation notes

This document contains notes related to the implementation of Vector Addition. 
This is not an exhaustive description of the implementation.  The intention is 
to provide a high-level overview, and to supplement the internal documentation 
(source code comments) and external documentation (design documents).  

Before reading this document, please read:
* [model.md](https://github.com/phetsims/vector-addition/blob/master/doc/model.md), a high-level description of the simulation model

In addition to this document, you are encouraged to read: 
* [PhET Development Overview](http://bit.ly/phet-html5-development-overview)  
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md)
* [Vector Addition HTML5](https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit), the design document

## Terminology

* _active_ vector means "selected" vector.  There is (at most) one active vector.
* _component_ is a scalar, while _component vector_ is a vector
* _graph orientation_ is horizontal or vertical, see [GraphOrientations](https://github.com/phetsims/vector-addition/blob/master/js/common/model/GraphOrientations.js)
* _coordinate snap mode_ refers to which vector quantities will snap to integer values, see [CoordinateSnapModes](https://github.com/phetsims/vector-addition/blob/master/js/common/model/CoordinateSnapModes.js)
* _component vector styles_ refers to the representation used to display component vectors, see [ComponentVectorStyles](https://github.com/phetsims/vector-addition/blob/master/js/common/model/ComponentVectorStyles.js)
* for vectors, "position" or "point" refers to model coordinates, while "location" refers to view coordinates

## General Considerations

This section describes how this simulation addresses implementation considerations that are typically encountered in PhET simulations.

**Coordinate Transforms**: TODO

**Memory Management**: TODO

**Query Parameters**: Query parameters are used to enable sim-specific features, mainly for debugging and
testing. Sim-specific query parameters are documented in
[VectorAdditionQueryParameters](https://github.com/phetsims/vector-addition/blob/master/js/common/VectorAdditionQueryParameters.js).

**Assertions**: The implementation makes heavy use of `assert` to verify pre/post assumptions and perform type checking. 
This sim performs type-checking for almost all function arguments via `assert`. If you are making modifications to this sim, do so with assertions enabled via the `ea` query parameter.

**Creator Pattern**:

A `VectorSet` is a set of related vectors. The vectors in the set contribute to a sum vector, and share the same styling (fill, stroke,...)

`VectorCreatorPanel` is the vector "toolbox". It contains one `VectorCreatorPanelSlot` for each `VectorSet`, with each slot being represented by an icon in the toolbox.  Each `VectorSet` also has an associated `VectorSetNode`, which manages creation and layering of Nodes related to vectors in the set. 

Adding a vector: `VectorCreatorPanel` contains one `VectorCreatorPanelSlot` for each `VectorSet`. When a vector icon in the panel is clicked, `VectorCreatorPanelSlot` creates a new `Vector` and adds it to the associated `VectorSet`.  It then delegates creation of the vector's view to `VectorSetNode` (see `registerVector`).

Removing a vector: When a vector is added, `VectorCreatorPanelSlot` creates closures that handle disposing of the vector when it's returned to the slot (see `animateVectorBackListener`) or when the `VectorSet` associated with the slot is cleared by pressing the eraser button or Reset All button (see `removeVectorListener`).  `VectorSetNode` similarly creates a closure that observers the `VectorSet` and remove Nodes associated with a `Vector` that is removed.  

## Model

`VectorSet` TODO

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

`VectorSetNode` TODO

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
