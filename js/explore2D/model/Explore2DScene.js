// Copyright 2019, University of Colorado Boulder

/**
 * Model for the scene on the Explore2D scene. This scene only has one vectorSet.
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
  const BooleanProperty = require( 'AXON/BooleanProperty' );

  class Explore2DScene extends Scene {
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
      sumVisibleProperty ) {

      //----------------------------------------------------------------------------------------
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );

      super( graphDimension, graphUpperLeftPosition, numberOfVectorSets, componentStyleProperty );


      // @private {Boolean Property} this scene shares one property for the sum visibility
      this.sumVisibleProperty = sumVisibleProperty;


      this.createVectorSets( componentStyleProperty );
    }

    /**
     * @public
     * Reset the vectorSets only
     */
    resetVectorSets() {
      // reset the each vectorSet in vectorSets
      this.vectorSets.forEach( vectorSet =>
        vectorSet.reset()
      );
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
          this.sumVisibleProperty, 
          VectorTypes.ONE ) );

    }
  }

  return vectorAddition.register( 'Explore2DScene', Explore2DScene );
} );
