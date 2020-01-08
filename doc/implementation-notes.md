# Vector Addition - implementation notes

This document contains notes related to the implementation of Vector Addition. 
This is not an exhaustive description of the implementation.  The intention is 
to provide a high-level overview, and to supplement the internal documentation 
(source code comments) and external documentation (design documents).  

Before reading this document, please read:
* [model.md](https://github.com/phetsims/vector-addition/blob/master/doc/model.md), a high-level description of the simulation model

In addition to this document, you are encouraged to read: 
* [PhET Development Overview](https://github.com/phetsims/phet-info/blob/master/doc/phet-development-overview.md)  
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md)
* [Vector Addition HTML5](https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit), the design document

## Terminology

... that you'll see used throughout the code.

* _active_ vector and _selected_ vector are synonyms.  There is (at most) one active vector.
* _component_ is a scalar, while _component vector_ is a vector
* _coordinate snap mode_ refers to which vector quantities will snap to integer values, see [CoordinateSnapModes](https://github.com/phetsims/vector-addition/blob/master/js/common/model/CoordinateSnapModes.js)
* _component vector styles_ refers to the representation used to display component vectors, see [ComponentVectorStyles](https://github.com/phetsims/vector-addition/blob/master/js/common/model/ComponentVectorStyles.js)
* _creator panel_ and _toolbox_ are synonyms for the UI component that creates vectors 
* _graph orientation_ is horizontal, vertical, or two-dimensional, see [GraphOrientations](https://github.com/phetsims/vector-addition/blob/master/js/common/model/GraphOrientations.js)

## General Considerations

This section describes how this simulation addresses implementation considerations that are typically encountered in PhET simulations.

### Coordinate Transforms
The transform between model and view coordinate frames can be found in [Graph](https://github.com/phetsims/vector-addition/blob/master/js/common/model/Graph.js), where `modelViewTransformProperty` is derived from the graph's bounds, and changes when the graph's origin is moved.  This transform inverts the mapping of y-axis values; +y is down in view (scenery) coordinates, up in model coordinates.

### Memory Management
The dynamic objects in the sim are the vectors, and their model and view classes implement `dispose`. On the model side, that includes [RootVector](https://github.com/phetsims/vector-addition/blob/master/js/common/model/RootVector.js) and its subclasses; on the view side, [RootVectorNode](https://github.com/phetsims/vector-addition/blob/master/js/common/view/RootVectorNode.js) and its subclasses.  

All other objects are instantiated at startup, and exist for the lifetime of the sim. Classes that are not intended (and in fact, not designed) to be disposed have a `dispose` method that fails an assertion if called. For example:

```js
dispose() {
  assert && assert( false, 'SceneNode is not intended to be disposed' );
}
```

Calls to methods that add observers (`link`, `addListener`,...) have a comment indicating whether the observer needs to be deregistered, or whether the relationship exists for the lifetime of the sim. Examples:

```js
// When the vector becomes active, move it and its components to the front.
// unlink is required when the vector is removed.
const activeVectorListener = activeVector => { ... };
this.graph.activeVectorProperty.link( activeVectorListener );

// Observe when the graph's active vector changes and update the vectorComponents link.
// unlink is unnecessary, exists for the lifetime of the sim.
graph.activeVectorProperty.link( ... );
```

### Query Parameters
Query parameters are used to enable sim-specific features, mainly for debugging and
testing. Sim-specific query parameters are documented in
[VectorAdditionQueryParameters](https://github.com/phetsims/vector-addition/blob/master/js/common/VectorAdditionQueryParameters.js).

### Assertions
The implementation makes heavy use of `assert` to verify pre/post assumptions and perform type checking. 
This sim performs type-checking for almost all function arguments via `assert`. If you are making modifications to this sim, do so with assertions enabled via the `ea` query parameter.

### Creator Pattern
This sim uses the Creator pattern to dynamically create and dispose of vectors. For an overview of this pattern, see [Creator](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md#creator-with-drag-forwarding) in the [_PhET Software Design Patterns_](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md). Here's how that pattern is implemented in this sim:

A [VectorSet](https://github.com/phetsims/vector-addition/blob/master/js/common/model/VectorSet.js) is a set of related vectors. The vectors in the set contribute to a sum vector, and share the same [VectorColorPalette](https://github.com/phetsims/vector-addition/blob/master/js/common/model/VectorColorPalette.js).

[VectorCreatorPanel](https://github.com/phetsims/vector-addition/blob/master/js/common/view/VectorCreatorPanel.js) is the vector "toolbox". It contains one [VectorCreatorPanelSlot](https://github.com/phetsims/vector-addition/blob/master/js/common/view/VectorCreatorPanelSlot.js) for each `VectorSet`, with each slot being represented by an icon in the toolbox.  Each `VectorSet` also has an associated [VectorSetNode](https://github.com/phetsims/vector-addition/blob/master/js/common/view/VectorSetNode.js), which manages creation and layering of Nodes related to vectors in the set. 

_Adding a vector_: When a vector icon in the toolbox is clicked,
`VectorCreatorPanelSlot` creates a new vector and adds it to the
associated `VectorSet`. It then delegates the  of the vector's view to
`VectorSetNode` (see `registerVector`).

_Removing a vector_: When a vector is added, `VectorCreatorPanelSlot`
creates closures that handle disposing of the vector when it's returned
to the slot (see `animateVectorBackListener`) or when the `VectorSet`
associated with the slot is cleared by pressing the eraser button or
Reset All button (see `removeVectorListener`). `VectorSetNode` similarly
creates a closure that observers the `VectorSet` and removes Nodes
associated with a vector that is removed.

### Scenes
A scene consists of a graph and its vector set(s). In this sim, there is
no "scene" model element, and scenes are managed solely by the view.
[SceneNode](https://github.com/phetsims/vector-addition/blob/master/js/common/view/SceneNode.js)
is the base class. In the _Explore 1D_ screen, there are 2 scenes,
corresponding to the horizontal and vertical graph orientations. In the
other screens, there are 2 scenes, corresponding to the Cartesian and
Polar snap modes. Switch between scenes using the radio buttons that are
located at the bottom-right of the ScreenView.

## Vectors: Model and View

The implementation of most of this sim is relatively straightforward,
and should be easy to understand for anyone who is familiar with PhET
sim development.

The part that is most interesting is the implementation of vectors.
Source code documentation describes things well, so we won't repeat that
information here. We'll summarize the structure of the class
hierarchies, mention a couple of "gotchas", and then it's up to you to
explore the source code.

The model class hierarchy for vectors is shown below. Note the distinction between interactive and non-interactive vectors.

``` 
RootVector (abstract root class)
  Vector (interactive)
    BaseVector
      CartesianBaseVector
      PolarBaseVector
    EquationsVector (adds functionality for Equations screen)
    SumVector
      EquationsSumVector (adds functionality for Equations screen)
  ComponentVector (not interactive)
```

The view class hierarchy for vectors is shown below. Again, note the
distinction between interactive and non-interactive vectors.

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

* Model classes handle some responsibilities that arguably belong in
  view classes, and this contributes to the coupling mentioned above.
  For example, the `getLabelContent` method found throughout the model
  class is responsible for assembling a vector's label. The model
  rightly contains the information that appears in a label. But the
  information that appears in the label depends on the state of the
  view, so assembling that information should be a responsibility of the
  view.

## Screen differences

If you're in the position of having to maintain or enhance this sim, it helps to have a birds-eye view of the similarities
and differences between the screens.

The _Explore 2D_ screen can be thought of as the "prototypical" screen. It has these features:
* There are 2 scenes, one for each snap mode (Cartesian and Polar).
* Each scene has 1 vector set, and therefore 1 sum vector.
* Vectors in the Cartesian scene are labeled a&#8407;, b&#8407;, c&#8407;.
* Vectors in the Polar scene are labeled d&#8407;, e&#8407;, f&#8407;.
* One instance of each vector can be created via direct manipulation. Drag out of the toolbox to create, drag back to the toolbox to delete.
* Vectors can be transformed via direct manipulation. Drag a vector's tail to translate; drag a vector's head to scale and rotate.
* Sum vectors can only be translated via direct manipulation. By
  definition, their magnitude and angle depend on the other vectors in
  the vector set.
* Selecting a vector moves it to the front, highlights it, and displays its associated values in the "Vector Values" accordion box.
* Three visual representations of component vectors are supported, see [ComponentVectorStyles](https://github.com/phetsims/vector-addition/blob/master/js/common/model/ComponentVectorStyles.js).
* Vector sum and angles can be displayed.
* The graph's grid can be hidden.

The other screens can be described in terms of their differences from the _Explore 2D_ screen.

_Explore 1D_ screen:
* Scenes are based on graph orientation (horizontal and vertical), rather than snap mode (Cartesian and Polar).
* Vectors can be translated and scaled via direct manipulation, but not rotated.
* Component vectors are not displayed.
* Vector angles are not displayed.

_Lab_ screen:
* Each scene has 2 vector sets, and therefore 2 sum vectors.
* For each vector set, 10 vectors can be created via direct manipulation.
* Vectors are not labeled uniquely. They are generically labeled as v&#8407; and s&#8407;, with only one such label visible at a time.
* In the view, all vectors in a set are in the same layer. Selecting any vector in a set moves the entire set to the front.

_Equations_ screen:
* Base vectors are provided, and you can change their values using spinners.
* Each vector set has one vector (c&#8407; or f&#8407;) whose
  computation depends on which equation is selected, see
  [EquationTypes](https://github.com/phetsims/vector-addition/blob/master/js/equations/model/EquationTypes.js).
* Equation coefficients can be changed using spinners. 
* Vectors cannot be added to or removed from the graph.
* Vectors cannot be rotated or scaled via direct manipulation. They must
  be indirectly rotated/scaled using the spinners for base vectors and
  equations.

