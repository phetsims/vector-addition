# Vector Addition - model description

This document is a high-level description of the model used in PhET's _Vector Addition_ simulation.

## Explore 1D screen

The _Explore 1D_ screen facilitates exploration of vectors in 1 dimension. 

There are 2 "scenes", which constrain vectors to 1 dimension. Selection of the scene is controlled by the radio buttons at the lower-right of the screen.

In the horizontal scene:

* 3 vectors can be created, labeled a&#8407;, b&#8407;, and c&#8407;
* the y component of all vectors is zero
* the sum is a&#8407; + b&#8407; + c&#8407; = s&#8407;

In the vertical scene:

* 3 vectors can be created, labeled d&#8407;, e&#8407;, and f&#8407;
* the x component of all vectors is zero
* the sum is d&#8407; + e&#8407; + f&#8407; = s&#8407;

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

* 3 vectors can be created, labeled a&#8407;, b&#8407;, and c&#8407;
* vector x and y components snap to integer values
* the sum is a&#8407; + b&#8407; + c&#8407; = s&#8407;

In the Polar scene:

* 3 vectors can be created, labeled d&#8407;, e&#8407;, and f&#8407;
* vector magnitude snaps to integer values
* vector angle snaps to 5-degree intervals
* the sum is d&#8407; + e&#8407; + f&#8407; = s&#8407;

To manipulate vectors:

* Add/remove vectors by dragging them between the toolbox and the graph.
* Move a vector by dragging its tail.
* Scale or rotate a vector by dragging its head.
* Component vectors cannot be directly manipulated.

## Lab screen

The _Lab_ screen is similar to the _Explore 2D_ screen, with these differences:

* Each scene has 2 sets of vectors (blue and red for Cartesian, purple and green for Polar.)
* 10 vectors can be created for each set of vectors.
* The sum for a set of n vectors is v&#8407;<sub>1</sub> + v&#8407;<sub>2</sub> + ... + v&#8407;<sub>n</sub> = s&#8407;

## Equations screen

The _Equations_ screen introduces the concepts of base vectors, equations, and coefficients. Like the _Explore 2D_ and
_Lab_ screens, it has Cartesian and Polar scenes.

In the Cartesian scene:

* the scene shows vectors labeled a&#8407;, b&#8407;, and c&#8407;
* base vectors are provided for a&#8407; and b&#8407;
* x and y components can be changed for base vectors; range is [-10,10], integers
* coefficients can be changed for a&#8407; and b&#8407;; range is [-5,5], integers
* vector c&#8407; is derived based on the selection of one of these equations:
  * a&#8407; + b&#8407; = c&#8407;
  * a&#8407; - b&#8407; = c&#8407;
  * a&#8407; + b&#8407; + c&#8407; = 0

In the Polar scene:

* the scene shows vectors labeled d&#8407;, e&#8407;, and f&#8407;
* base vectors are provided for d&#8407; and e&#8407;
* magnitude and angle can be changed for base vectors
* base vector magnitude range is [-10,10], integers
* base vector angle range is [-180,180] degrees, in 5-degree intervals
* coefficients can be changed for d&#8407; and e&#8407;; range is [-5,5], integers
* vector f&#8407; is derived based on the selection of one of these equations:
  * d&#8407; + e&#8407; = f&#8407;
  * d&#8407; - e&#8407; = f&#8407;
  * d&#8407; + e&#8407; + f&#8407; = 0

The _Equations_ screen has a couple of differences in how the student manipulates vectors:

* Vectors are pre-populated on the scene; the student does not add and remove vectors.
* Vectors can be moved directly on the scene, but their other properties (scale, rotation) must be changed using spinners.

