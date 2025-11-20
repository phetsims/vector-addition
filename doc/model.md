# Vector Addition - model description

This document is a high-level description of the model used in PhET's _Vector Addition_ simulation.

## Explore 1D screen

The _Explore 1D_ screen facilitates exploration of vectors in 1 dimension. 

There are 2 "scenes", which constrain vectors to 1 dimension. Selection of the scene is controlled by the radio buttons at the lower-right of the screen.

In the horizontal scene:

* 3 vectors can be created, labeled `a`, `b`, and `c`.
* The y component of all vectors is zero.
* The sum is `a` + `b` + `c` = `s`

In the vertical scene:

* 3 vectors can be created, labeled `d`, `e`, and `f`
* The x component of all vectors is zero.
* The sum is `d` + `e` + `f` = `s`

To manipulate vectors:

* Add/remove vectors by dragging them between the toolbox and the graph.
* Move a vector by dragging its tail.
* Scale a vector by dragging its head.

## Explore 2D screen

The _Explore 2D_ screen facilitates exploration of vectors in 2 dimensions, and introduces component vectors (and their
various representations).

There are 2 "scenes", each with a "snap mode" that determines which vector quantities snap to integer values. Selection
of the scene is controlled by the radio buttons at the lower-right of the screen.

In the Cartesian scene:

* 3 vectors can be created, labeled `a`, `b`, and `c`
* Vector x and y components snap to integer values
* The sum is `a` + `b` + `c` = `s`

In the polar scene:

* 3 vectors can be created, labeled `d`, `e`, and `f`
* Vector magnitude snaps to integer values
* Vector angle snaps to 5-degree intervals
* the sum is `d` + `e` + `f` = `s`

To manipulate vectors:

* Add/remove vectors by dragging them between the toolbox and the graph.
* Move a vector by dragging its tail.
* Scale or rotate a vector by dragging its head.
* Component vectors cannot be directly manipulated.

## Lab screen

The _Lab_ screen is similar to the _Explore 2D_ screen, with these differences:

* The Cartesian scene has 2 vector sets, `u` and `v`.
* The polar scene has 2 vector sets, `p` and `q`.
* 10 vectors can be created for each vector set.
* The sum for a set of n vectors is (for example) `v`<sub>1</sub> + `v`<sub>2</sub> + ... + `v`<sub>n</sub> = `s`<sub>v</sub>

## Equations screen

The _Equations_ screen introduces the concepts of base vectors, equations, and coefficients. Like the _Explore 2D_ and
_Lab_ screens, it has Cartesian and Polar scenes.

In the Cartesian scene:

* The scene shows vectors labeled `a`, `b`, and `c`.
* Base vectors are provided for `a` and `b`
* x and y components can be changed for base vectors; range is [-10,10], integers
* Coefficients can be changed for `a` and `b`; range is [-5,5], integers
* Vector `c` is derived based on the selection of one of these equations:
  * `a` + `b` = `c`
  * `a` - `b` = `c`
  * `a` + `b` + `c` = 0

In the Polar scene:

* The scene shows vectors labeled `d`, `e`, and `f`.
* Base vectors are provided for `d` and `e`.
* Magnitude and angle can be changed for base vectors.
* Base vector magnitude range is [-10,10], integers.
* Base vector angle range is [-180,180] degrees, in 5-degree intervals.
* Coefficients can be changed for `d` and `e`; range is [-5,5], integers.
* Vector `f` is derived based on the selection of one of these equations:
  * `d` + `e` = `f`
  * `d` - `e` = `f`
  * `d` + `e` + `f` = 0

The _Equations_ screen has a couple of differences in how the student manipulates vectors:

* Vectors are pre-populated on the graph; the student does not add and remove vectors.
* Vectors can be moved directly, but xy-components, magnitude, and direction must be changed indirectly using spinners.

