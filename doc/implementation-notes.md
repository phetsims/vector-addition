# Vector Addition - implementation notes

This document contains notes related to the implementation of Vector Addition. This is not an exhaustive description of
the implementation. The intention is to provide a high-level overview, and to supplement the internal documentation
(source code comments) and external documentation (design documents).

Before reading this document, please read:

* [model.md](https://github.com/phetsims/vector-addition/blob/main/doc/model.md), a high-level description of the
  simulation model

In addition to this document, you are encouraged to read:

* [PhET Development Overview](https://github.com/phetsims/phet-info/blob/main/doc/phet-development-overview.md)
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/main/doc/phet-software-design-patterns.md)
* [Vector Addition HTML5](https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit), the
  design document

## Terminology

... that you'll see used throughout the code.

* _component_ is a scalar, while _component vector_ is a vector
* _coordinate snap mode_ refers to which vector quantities will snap to integer values, see `CoordinateSnapMode`
* _component vector style_ refers to the representation used to display component vectors, see `ComponentVectorStyle`
* _toolbox_ is the panel-like container that vectors are dragged to and from, see `VectorToolbox` and its subclasses
* _graph orientation_ is horizontal, vertical, or two-dimensional, see `GraphOrientation`

## General Considerations

This section describes how this simulation addresses implementation considerations that are typically encountered in
PhET simulations.

### Coordinate Transforms

The transform between model and view coordinate frames can be found in `VectorAdditionScene`,
where `modelViewTransformProperty` is derived from the graph's bounds (x-axis range and y-axis range), and changes when the graph's origin is moved.
This transform inverts the mapping of y-axis values; +y is _up_ in model coordinates, while +y is _down_ in view (scenery) coordinates.

### Memory Management

To meet the needs of PhET-iO, all vectors in the model are created at startup and exist for the lifetime of the sim.
(This was a major change in the 1.1 release, as the implementation previously created and disposed vectors dynamically, 
when they were dragged from/to the toolbox.)

For the view, `RootVectorNode` and its subclasses are created and disposed dynamically, as vectors are dragged to/from the toolbox.

All other objects are instantiated at startup, and exist for the lifetime of the sim. They can be identified by looking for
option `isDisposable: false`, or for a `dispose` method that looks like this:

```ts
public dispose(): void {
  Disposable.assertNotDisposable();
}
```

### Query Parameters

Query parameters are used to enable sim-specific features, mainly for debugging and testing. Sim-specific query
parameters can be found in `VectorAdditionQueryParameters`.

### Assertions

The implementation makes heavy use of `affirm` to verify pre/post assumptions in methods and functions. 
If you are making modifications to this sim, do so with `affirm` enabled via the `ea` query parameter.

### Vector Management

`VectorSet` is a set of related vectors, all of which are instantiated at startup. Vectors that are on the graph or in the
process of dragging are in the VectorSet's `activeVectors` ObservableArray. Each vector set also has a resultant vector,
and vectors that are on the graph contribute to the derivation of the resultant vector.

`VectorToolbox` is a panel-like container, with one or more "slots" that vectors are dragged to and from.
The _Explore 1D_ and _Explore 2D_ screens each have 1 vector set, with a slot in the toolbox for each vector in that set.
The _Lab_ screen has 2 vector sets, with 1 slot in the toolbox for each vector set, allowing the user to 
drag multiple vectors to/from each slot.

_Adding a vector_: When slot in the toolbox is pressed, the next available vector for that slot is added to `activeVectors`,
and registered with the view. The view delegates creation of the vector's view to `VectorSetNode` (see `registerVector`).

_Removing a vector_: When a vector is returned to the toolbox (by dragging, erase button, or Reset All button), it is removed
from `activeVectors`.  The view is notified and Nodes associated with that vector are disposed.

### Scenes

A scene consists of a graph and one or more vector sets. In the model, see `VectorAdditionScene` and its subclasses, 
and `sceneProperty`. In the view, see `VectorAdditionSceneNode` and its subclasses.

The _Explore 1D_ screen has horizontal and vertical scenes, where the vectors are constrained to either the 
horizontal or vertical dimension. The other screens have Cartesian and polar scenesm, where vectors snap to 
either Cartesian or polar coordinates.

In all screens, switch between scenes using the radio buttons that are located at the bottom-right of the UI.

## Vectors: Model and View

The implementation of most of this sim is relatively straightforward, and should be easy to understand for anyone who is
familiar with PhET sim development.

The part that is most interesting is the implementation of vectors. Source code documentation describes things well, so
we won't repeat that information here. We'll summarize the structure of the class hierarchies, mention a couple of "gotchas",
and then it's up to you to explore the source code.

The model class hierarchy for vectors is shown below. Note the distinction between interactive and non-interactive
vectors.

``` 
RootVector (abstract base class)
  Vector (interactive)
    BaseVector (bass class)
      CartesianBaseVector (has mutable x and y components)
      PolarBaseVector (has mutable magnitude and angle)
    EquationsVector (adds functionality for Equations screen)
    ResultantVector (base class)
      SumVector
      EquationsResultantVector
  ComponentVector (not interactive)
```

The view class hierarchy for vectors is shown below. Again, note the distinction between interactive and non-interactive
vectors.

```
RootVectorNode (base class)
  VectorNode (interactive)
    BaseVectorNode
    ResultantVectorNode
  ComponentVectorNode (not interactive)
    ResultantComponentVectorNode 
```

These class hierarchies make sense, and feel natural when you work with them. But there are a couple of things to be
aware of (the "gotchas" mentioned above):

* Classes in both hierarchies have a bit too much knowledge of their associated `VectorSet`. This increases
  coupling, and (depending on what you need to change) can make it difficult to change `VectorSet` without affecting
  vector classes. For further discussion, see https://github.com/phetsims/vector-addition/issues/234. (Note that
  this was a pain point and major cost for the 1.1 release, where coupling was greatly reduced but not eliminated.
  See https://github.com/phetsims/vector-addition/issues/332.)

* Model classes handle some responsibilities that arguably belong in view classes, and this contributes to the coupling
  mentioned above. For example, the `getLabelDisplayData` method found throughout the model class is responsible for
  assembling a vector's label. The model rightly contains the information that appears in a label. But the information
  that appears in the label depends on the state of the view, so assembling that information should be a responsibility
  of the view.

## Screen Differences

If you're in the position of having to maintain or enhance this sim, it helps to have a birds-eye view of the
similarities and differences between the screens.

The _Explore 2D_ screen can be thought of as the "prototypical" screen. It has these features:

* There are 2 scenes, one for each snap mode (Cartesian and polar).
* Each scene has 1 vector set, and therefore 1 sum vector.
* Vectors in the Cartesian scene are labeled a&#8407;, b&#8407;, c&#8407;.
* Vectors in the polar scene are labeled d&#8407;, e&#8407;, f&#8407;.
* One instance of each vector can be dragged to/from the toolbox via direct manipulation.
* Vectors can be transformed via direct manipulation. Drag a vector's tail to translate. Drag a vector's head to scale and rotate.
* Sum vectors can only be translated via direct manipulation. By definition, their magnitude and angle depend on the
  other vectors in the vector set.
* Selecting a vector moves it to the front, highlights it, and displays its associated values in the "Vector Values"
  accordion box.
* Three visual representations of component vectors are supported,
  see [ComponentVectorStyle](https://github.com/phetsims/vector-addition/blob/main/js/common/model/ComponentVectorStyles.ts).
* Vector sum and angles can be displayed.
* The graph's grid can be hidden.

The other screens can be described in terms of their differences from the _Explore 2D_ screen.

_Explore 1D_ screen:

* Scenes are based on graph orientation (horizontal and vertical), rather than snap mode (Cartesian and polar).
* Vectors can be translated and scaled via direct manipulation, but not rotated.
* Component vectors are not displayed.
* Vector angles are not displayed.

_Lab_ screen:

* Each scene has 2 vector sets, and therefore 2 sum vectors.
* For each vector set, 10 vectors can be dragged to/from the toolbox.
* Vectors are labeled uniquely using their vector set symbol and an index, for example v&#8407<sub>2</sub>.
* In the view, all vectors in a set are in the same layer. Selecting any vector in a set moves the entire set to the
  front.

_Equations_ screen:

* Base vectors are provided, and you can change their values using spinners.
* Each vector set has one resultant vector (c&#8407; or f&#8407;) whose computation depends on which equation is selected, see
  [EquationType](https://github.com/phetsims/vector-addition/blob/main/js/equations/model/EquationTypes.ts).
* Equation coefficients can be changed using spinners.
* Vectors cannot be added to or removed from the graph.
* Vectors cannot be rotated or scaled via direct manipulation. They must be indirectly rotated/scaled using the spinners
  for base vectors and equations.

## Alternative Input (Keyboard)

Alternative Input features were added in the 1.1 release. We'll describe only the sim-specific support for alternative input here. 
Other support is provided by common code.

Keyboard input for the toolbox involves these classes:

* `AddVectorKeyboardListener` moves a vector from the toolbox to the graph.

Keyboard input for vectors via the keyboard involves these classes:

* `RemoveVectorKeyboardListener` moves a vector from the graph to the toolbox.
* `MoveVectorKeyboardListener` translates a vector on the graph.
* `ScaleRotateVectorKeyboardListener` scales and rotates a vector on the graph.
* `ReadVectorValuesKeyboardShortcut` reads quantities associated with the selected vector.

Moving the graph origin is done via an input listener in `OriginManipulator` that handles all forms of input.

The keyboard-help dialog is similar for all screens, and is implemented in `VectorAdditionKeyboardHelpContent`. 

## Core Description

Core Description features were added in the 1.1 release. 

Screen summary descriptions are implemented in a class per screen: `Explore1DScreenSummaryContent`, `Explore2DScreenSummaryContent`, 
`LabScreenSummaryContent`, and `EquationsScreenSummaryContent`.

`VectorNode` and `VectorTipNode` have a `doAccessibleObjectResponse` method that is interesting, and is called by 
various input listeners in response to user interactions.

`VectorValuesAccessibleParagraphProperty` implements the accessible paragraph that describes the contents of the
"Vector Values" accordion box.

To identify other code related to core description, search for options that are related to description - `accessibleName`, `accessibleHelpText`,
`accessibleObjectResponse`, `accessibleContextResponse`, etc.

## PhET-iO

All vectors in the model are allocated at startup. They are instrumented and grouped under `allVectors` in the PhET-iO tree. Most vector 
Properties are `phetioReadOnly: true` because making them editable via PhET-iO was considered too costly. So use the simulation
to configure vectors.

All vectors in the view (`VectorNode` and `ComponentVectorNode`) are allocated dynamically, so they are not instrumented.

`VectorAdditionScene.VectorAdditionSceneIO` is a custom IOType that implements reference-type serialization for the selected scene.
See VectorAdditionModel `sceneProperty`.

`Vector.VectorIO` is a custom IOType that implements reference-type serialization for vectors.  
See VectorAdditionScene `selectedVectorProperty: Property<Vector | null>` and VectorSet `activeVectors: ObservableArray<Vector>`.

There are no dynamic PhET-iO elements in this sim, and therefore no uses of `PhetioGroup` or `PhetioCapsule`.

