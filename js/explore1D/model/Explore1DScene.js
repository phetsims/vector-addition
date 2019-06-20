// Copyright 2019, University of Colorado Boulder

/**
 * Model for a Scene on the Explore1D scene. Scenes on Explore1D only have one vectorSet.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Scene = require( 'VECTOR_ADDITION/common/model/Scene' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  class Explore1DScene extends Scene {
    /**
     * @constructor
     * @param {Dimension2} graphDimension - the dimensions (width and height) of the graph
     * @param {Vector2} graphUpperLeftPosition - the model coordinates of the top left corner of the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty - explore1D only has one shared sumVisibleProperty
     * @param {VectorOrientations} vectorOrientation - the orientation for this scene
     * @param {VectorTypes} vectorType - the vectorType for explore1D
     */
    constructor(
      graphDimension,
      graphUpperLeftPosition,
      componentStyleProperty,
      sumVisibleProperty,
      vectorOrientation,
      vectorType ) {

      // Type check arguments
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( VectorOrientations.includes( vectorOrientation ), `invalid vectorOrientation: ${vectorOrientation}` );
      // The rest are checked in super-classes

      //----------------------------------------------------------------------------------------

      super( graphDimension, graphUpperLeftPosition, componentStyleProperty );

      // Set the graph's orientation to horizontal
      this.graph.orientation = vectorOrientation;

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

  return vectorAddition.register( 'Explore1DScene', Explore1DScene );
} );