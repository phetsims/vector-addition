// Copyright 2019, University of Colorado Boulder

/**
 * Model for the scene on the lab scene. This scene only has 2 vectorSets.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const Scene = require( 'VECTOR_ADDITION/common/model/Scene' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );
  // const BooleanProperty = require( 'AXON/BooleanProperty' );

  class LabScene extends Scene {
    /**
     * @constructor
     * @param {Dimension2} graphDimension - the dimensions (width and height) of the graph
     * @param {Vector2} graphUpperLeftPosition - the model coordinates of the top left corner of the graph
     * @param {number} numberOfVectorSets - scenes can have multiple vectorSets
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty
     */
    constructor( 
      graphDimension,
      graphUpperLeftPosition,
      numberOfVectorSets,
      componentStyleProperty,
      sum1VisibleProperty,
      sum2VisibleProperty ) {

      //----------------------------------------------------------------------------------------
      // assert && assert( sumVisibleProperty instanceof BooleanProperty,
      //   `invalid sumVisibleProperty: ${sumVisibleProperty}` );

      super( graphDimension, graphUpperLeftPosition, numberOfVectorSets, componentStyleProperty );


      // @private {Boolean Property} this scene shares one property for the sum visibility
      this.sumGroup1VisibleProperty = sum1VisibleProperty;
      // @private {Boolean Property} this scene shares one property for the sum visibility
      this.sumGroup2VisibleProperty = sum2VisibleProperty;


      this.createVectorSets( componentStyleProperty );
    }
    /**
     * @public
     * Create the vector sets
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     */
    createVectorSets( componentStyleProperty ) {
      // Create the vector set
      this.vectorSets.push(
        new VectorSet( 
          this.graph.modelViewTransformProperty, 
          this.graph.graphModelBounds, 
          componentStyleProperty, 
          this.sumGroup1VisibleProperty, 
          VectorTypes.ONE ) );
         // Create the vector set
      this.vectorSets.push(
        new VectorSet( 
          this.graph.modelViewTransformProperty, 
          this.graph.graphModelBounds, 
          componentStyleProperty, 
          this.sumGroup2VisibleProperty, 
          VectorTypes.TWO ) );

    }
  }

  return vectorAddition.register( 'LabScene', LabScene );
} );
