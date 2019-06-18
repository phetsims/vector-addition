// Copyright 2019, University of Colorado Boulder

/**
 * Model for the scene on the Explore2D scene. 
 * This scene only has one vectorSet.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Scene = require( 'VECTOR_ADDITION/common/model/Scene' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );

  // constants
  const NUMBER_OF_VECTOR_SETS = 1;

  class Explore2DScene extends Scene {
    /**
     * @constructor
     * @param {Dimension2} graphDimension - the dimensions (width and height) of the graph
     * @param {Vector2} graphUpperLeftPosition - the model coordinates of the top left corner of the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty
     */
    constructor( graphDimension, graphUpperLeftPosition, componentStyleProperty, sumVisibleProperty ) {

      //----------------------------------------------------------------------------------------
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      // The rest are checked in super

      super( graphDimension, graphUpperLeftPosition, NUMBER_OF_VECTOR_SETS, componentStyleProperty );

      // @private {Boolean Property} this scene shares one property for the sum visibility
      this.sumVisibleProperty = sumVisibleProperty;

      // Create the vector set
      this.createVectorSets( componentStyleProperty );
    }

    /**
     * @override
     * @public
     * Create the vector sets
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     */
    createVectorSets( componentStyleProperty ) {

      // @public (read-only) the vectorSet for explore2D
      this.vectorSet = new VectorSet( 
        this.graph.modelViewTransformProperty, 
        this.graph.graphModelBounds, 
        componentStyleProperty, 
        this.sumVisibleProperty, 
        VectorTypes.ONE );

      this.vectorSets.push( this.VectorSet );

    }
  }

  return vectorAddition.register( 'Explore2DScene', Explore2DScene );
} );
