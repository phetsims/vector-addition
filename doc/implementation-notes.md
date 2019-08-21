TODO implementation overview


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