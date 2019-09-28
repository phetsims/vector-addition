TODO implementation overview

"Active" vector means "selected" vector.  There is (at most) one active vector.

Vector class hierarchy:

``` 
// model
RootVector
  Vector (interactive)
    BaseVector
      CartesianBaseVector
      PolarBaseVector
    EquationVector
    SumVector
      EquationSumVector
  ComponentVector (not interactive)
   
// view
RootVectorNode
  VectorNode (interactive) 
    SumVectorNode
  ComponentVectorNode (not interactive)
    SumComponentVectorNode 
```
