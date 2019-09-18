TODO implementation overview

"Active" vector means "selected" vector.

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