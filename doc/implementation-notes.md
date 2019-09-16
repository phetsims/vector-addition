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
    VectorSum 
      EquationVectorSum
  ComponentVector
   
// view
RootVectorNode
  VectorNode  
    EquationVectorNode
    VectorSumNode
  ComponentVectorNode
    SumComponentVectorNode 
```