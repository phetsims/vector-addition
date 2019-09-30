# Vector Addition - model description

This document is a high-level description of the model used in PhET's _Vector Addition_ simulation.

## Explore 1D screen

In the _Explore 1D_ screen, vectors are constrained to horizontal and vertical orientations. 

In the horizontal orientation:
* 3 vectors can be created, labeled a&#8407;, b&#8407;, and c&#8407;
* the y component of all vectors is zero
* the sum vector is a&#8407; + b&#8407; + c&#8407; = s&#8407; 

In the vertical orientation:
* 3 vectors can be created, labeled d&#8407;, e&#8407;, and f&#8407;
* the x component of all vectors is zero
* the sum vector is d&#8407; + e&#8407; + f&#8407; = s&#8407; 

## Explore 2D screen

In the _Explore 2D_ screen, there are 2 "snap modes" that determine which vector quantities snap to integer values. Selection of the snap mode is controlled by the radio buttons at the lower-right of the screen.

In Cartesian snap mode:
* 3 vectors can be created, labeled a&#8407;, b&#8407;, and c&#8407;
* vector x and y components snap to integer values
* the sum vector is a&#8407; + b&#8407; + c&#8407; = s&#8407; 

In polar snap mode:
* 3 vectors can be created, labeled d&#8407;, e&#8407;, and f&#8407;
* vector magnitude and angle (in degress) snap to integer values
* the sum vector is d&#8407; + e&#8407; + f&#8407; = s&#8407; 

## Lab screen 

The _Lab_ screen is similar to the _Explore 2D_ screen, with these differences:
* each snap mode has 2 sets of vectors (blue and red for Cartesian, purple and green for polar)
* an infinite number of vectors can be created for each set of vectors
* the sum vector for a set of n vectors is v&#8407;<sub>1</sub> + v&#8407;<sub>2</sub> + ... + v&#8407;<sub>n</sub> = s&#8407;

## Equation screen

The _Equation_ screen introduces the concepts of base vectors, equations, and coefficients.  Like the _Explore 2D_ and _Lab_ screens, it has Cartesian and polar "snap modes" that determine which vector quantities snap to integer values.  Vectors in this screen are pre-populated on the graph; the student does not add and remove vectors.

In Cartesian snap mode:
* the graph shows vectors labeled a&#8407;, b&#8407;, and c&#8407;
* base vector x and y components can be changed for a&#8407; and b&#8407;
* coefficients can be changed for a&#8407; and b&#8407;
* vector c&#8407; is derived based on which equation is selected
* the equation selections are: a&#8407; + b&#8407; = c&#8407;, a&#8407; - b&#8407; = c&#8407;, a&#8407; + b&#8407; + c&#8407; = 0

In polar snap mode:
* the graph shows vectors labeled d&#8407;, e&#8407;, and f&#8407;
* base vector magnitude and angle can be changed for d&#8407; and e&#8407;
* coefficients can be changed for d&#8407; and e&#8407;
* vector f&#8407; is derived based on which equation is selected
* the equation selections are: d&#8407; + e&#8407; = f&#8407;, d&#8407; - e&#8407; = f&#8407;, d&#8407; + e&#8407; + f&#8407; = 0


