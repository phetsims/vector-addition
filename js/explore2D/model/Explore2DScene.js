// Copyright 2019, University of Colorado Boulder

/**
 * Model for a Scene on the Explore2D scene. Scenes on Explore2D only have one vectorSet.
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

  class Explore2DScene extends Scene {
    /**
     * @constructor
     * @param {Dimension2} graphDimension - the dimensions (width and height) of the graph
     * @param {Vector2} graphUpperLeftPosition - the model coordinates of the top left corner of the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty - explore2D only has one shared sumVisibleProperty
     * @param {VectorTypes} vectorType - the vectorType for explore2D
     */
    constructor(
      graphDimension,
      graphUpperLeftPosition,
      componentStyleProperty,
      sumVisibleProperty,
      vectorType ) {

      // Type check arguments
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      // The rest are checked in super-classes

      //----------------------------------------------------------------------------------------

      super( graphDimension, graphUpperLeftPosition, componentStyleProperty );

      // @private {Boolean Property} this scene shares one property for the sum visibility
      this.sumVisibleProperty = sumVisibleProperty;

      // @public (read-only) {VectorSet} - the vector set for this screen 
      this.vectorSet = new VectorSet(
        this.graph.modelViewTransformProperty,
        this.graph.graphModelBounds,
        componentStyleProperty,
        this.sumVisibleProperty,
        vectorType
      );

      this.vectorSets.push( this.vectorSet );
    }

  }

  return vectorAddition.register( 'Explore2DScene', Explore2DScene );
} );