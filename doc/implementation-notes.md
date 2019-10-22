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

... that you'll see used throughout the code.

* _active_ vector means "selected" vector.  There is (at most) one active vector.
* _component_ is a scalar, while _component vector_ is a vector
* _coordinate snap mode_ refers to which vector quantities will snap to integer values, see [CoordinateSnapModes](https://github.com/phetsims/vector-addition/blob/master/js/common/model/CoordinateSnapModes.js)
* _component vector styles_ refers to the representation used to display component vectors, see [ComponentVectorStyles](https://github.com/phetsims/vector-addition/blob/master/js/common/model/ComponentVectorStyles.js)
* _graph orientation_ is horizontal, vertical, or two-dimensional, see [GraphOrientations](https://github.com/phetsims/vector-addition/blob/master/js/common/model/GraphOrientations.js)
* for vectors, "position" or "point" refers to model coordinates, while "location" refers to view coordinates

## General Considerations

This section describes how this simulation addresses implementation considerations that are typically encountered in PhET simulations.

### Coordinate Transforms
The transform between model and view coordinate frames can be found in [Graph](https://github.com/phetsims/vector-addition/blob/master/js/common/model/Graph.js), where `modelViewTransformProperty` is derived from the graph's bounds, and changes when the graph's origin is moved.  This transform inverts the mapping of y-axis values; +y is down in view (scenery) coordinates, up in model coordinates.

### Memory Management
The dynamic objects in the sim are the vectors, and their model and view classes implement `dispose`. On the model side, that includes [RootVector](https://github.com/phetsims/vector-addition/blob/master/js/common/model/RootVector.js) and its subclasses; on the view side, [RootVectorNode](https://github.com/phetsims/vector-addition/blob/master/js/common/view/RootVectorNode.js) and its subclasses.  All other objects are instantiated at startup, and exist for the lifetime of the sim.  

Classes that are not intended (and in fact, not designed) to be disposed have a `dispose` method that fails an assertion if called.  

Calls to methods that add observers (`link`, `addListener`,...) have a comment indicating whether the observer needs to be deregistered, or whether the relationship exists for the lifetime of the sim.

### Query Parameters
Query parameters are used to enable sim-specific features, mainly for debugging and
testing. Sim-specific query parameters are documented in
[VectorAdditionQueryParameters](https://github.com/phetsims/vector-addition/blob/master/js/common/VectorAdditionQueryParameters.js).

### Assertions
The implementation makes heavy use of `assert` to verify pre/post assumptions and perform type checking. 
This sim performs type-checking for almost all function arguments via `assert`. If you are making modifications to this sim, do so with assertions enabled via the `ea` query parameter.

### Creator Pattern
This sim uses the creator pattern to dynamically create and dispose of vectors. For an overview of this pattern, see [Creator](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md#creator-with-drag-forwarding) in the [_PhET Software Design Patterns_](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md). Here's how that pattern is implemented in this sim:

A [VectorSet](https://github.com/phetsims/vector-addition/blob/master/js/common/model/VectorSet.js) is a set of related vectors. The vectors in the set contribute to a sum vector, and share the same [VectorColorPalette](https://github.com/phetsims/vector-addition/blob/master/js/common/model/VectorColorPalette.js).

[VectorCreatorPanel](https://github.com/phetsims/vector-addition/blob/master/js/common/view/VectorCreatorPanel.js) is the vector "toolbox". It contains one [VectorCreatorPanelSlot](https://github.com/phetsims/vector-addition/blob/master/js/common/view/VectorCreatorPanelSlot.js) for each `VectorSet`, with each slot being represented by an icon in the toolbox.  Each `VectorSet` also has an associated [VectorSetNode](https://github.com/phetsims/vector-addition/blob/master/js/common/view/VectorSetNode.js), which manages creation and layering of Nodes related to vectors in the set. 

_Adding a vector_: When a vector icon in the toolbox is clicked, `VectorCreatorPanelSlot` creates a new vector and adds it to the associated `VectorSet`.  It then delegates creation of the vector's view to `VectorSetNode` (see `registerVector`).

_Removing a vector_: When a vector is added, `VectorCreatorPanelSlot` creates closures that handle disposing of the vector when it's returned to the slot (see `animateVectorBackListener`) or when the `VectorSet` associated with the slot is cleared by pressing the eraser button or Reset All button (see `removeVectorListener`).  `VectorSetNode` similarly creates a closure that observers the `VectorSet` and removes Nodes associated with a vector that is removed.  

### Scenes
A scene consists of a graph and its vector set(s). In this sim, there is no "scene" model element, and scenes are managed sole by the view. [SceneNode](https://github.com/phetsims/vector-addition/blob/master/js/common/view/SceneNode.js) is the base class. In the _Explore 1D_ screen, there 2 scenes, corresponding to the horizontal and vertical graph orientations. In the other screens, there are 2 scenes, corresponding to the Cartesian and Polar snap modes. Switch beteween scenes using the radio buttons that are located at the bottom-right of the ScreenView.

## Vectors: Model and View

The implementation of most this sim is relatively straightforward, and should be easy to understand for anyone who is
familiar with PhET sim development.  

The part that is most interesting is the implementation of vectors. Source code documentation describes things well, so we won't repeat that information here. We'll show you the structure of the class hierachies, mention a couple of "gotchas", and then it's up to you to explore the source code. 

The model class hierarchy for vectors is shown below. Note the distinction between interactive and non-interactive vectors.

``` 
RootVector (abstract root class)
  Vector (interactive)
    BaseVector
      CartesianBaseVector
      PolarBaseVector
    EquationVector (adds functionality for Equation screen)
    SumVector
      EquationSumVector (adds functionality for Equation screen)
  ComponentVector (not interactive)
```

The view class hierachy for vectors is shown below. Again, note the distinction between interactive and non-interactive vectors.

```
RootVectorNode (abstract base class)
  VectorNode (interactive) 
    SumVectorNode
  ComponentVectorNode (not interactive)
    SumComponentVectorNode 
```

These class hierarchies make sense, and feel natural when you work with them. But there are a couple of things to be aware of (the "gotchas" mentioned above):

* Classes in both hierarchies have a bit too much knowledge of their associated `VectorSet` and `Graph`. 
This increases coupling, and (depending on what you need to change) can make it difficult to change `VectorSet` 
or `Graph` without affecting vector classes. For further discussion, see https://github.com/phetsims/vector-addition/issues/234.  

* Model classes handle some responsibilities that arguably belong in view classes, and this contibutes to the coupling
mentioned above. For example, the `getLabelContent` method found throughout the model classes is responsible for assembling a vector's label. The model rightly contains the information that appears in a label, but which information appears in a label should be a concern of the view.

## Screen differences

If you're in he position of having to maintain or enhance this sim, it helps to have a birds-eye view of the similarities
and differences between the screens.

The _Explore 2D_ screen can be thought of as the "prototypical" screen. It has these features:
* there is a scene for each snap mode (Cartesian and Polar)
* each scene has 1 vector set, and therefore 1 sum vector
* vectors in the Cartesian vector set are labeled a&#8407;, b&#8407;, and c&#8407;
* vectors in the Polar vector set are labeled d&#8407;, e&#8407;, and f&#8407;
* one instance of each vector can be created via direct manipulation; drag out of the toolbox to create, drag back to the toolbox to delete
* vectors can be transformed via direct manipulation; drag a vector's tail to translate; drag a vector's head to scale and rotate
* sum vectors can only be translated via direct manipulation; by definition, their magnitude and angle depends on the other vectors in the vector set
* 3 visual representations of component vectors are supported, see [ComponentVectorStyles](https://github.com/phetsims/vector-addition/blob/master/js/common/model/ComponentVectorStyles.js)
* ability to display vector sum and angles
* ability to hide the graph's grid

The other screens can be described in terms of their differences from the _Explore 2D_ screen.

_Explore 1D_ screen:
* scenes are based on graph orientation (horizontal and vertical), rather than snap mode (Cartesian and Polar)
* vectors can be translated and scaled via direct manipulation, but not rotated
* vector components are not displayed
* vector angle is not displayed

_Lab_ screen:
* each scene has 2 vector sets, and therefore 2 sum vectors
* multiple instances of each vector type can be created via direct manipulation
* vectors are not labeled uniquely; they are labeled as v&#8407; and s&#8407;, with only one such label visible at a time

_Equation_ screen:
* base vectors are provided, and you can change their values using pickers
* each vector set has one vector ('c' or 'f') whose computation depends on which equation is selected, see [EquationTypes](https://github.com/phetsims/vector-addition/blob/master/js/equation/model/EquationTypes.js)
* equation coefficients can be changed using pickers 
* vectors cannot be added/removed from the graph
* vectors cannot be directly rotated/scaled on the graph; they must be indirectly rotated/scaled using the pickers for base vectors and equations

