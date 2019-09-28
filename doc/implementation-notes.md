TODO implementation overview

"Active" vector means "selected" vector.  There is (at most) one active vector.

Vector class hierarchy:

``` 
// model
RootVector
  Vector
    BaseVector
      CartesianBaseVector
      PolarBaseVector
    EquationVector
    SumVector
      EquationSumVector
  ComponentVector
   
// view
RootVectorNode
  VectorNode  
    EquationVectorNode
    SumVectorNode
  ComponentVectorNode
    SumComponentVectorNode 
```
