// Copyright 2019, University of Colorado Boulder

/**
 * Model for the explore2D screen
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Explore2DScene = require( 'VECTOR_ADDITION/explore2D/model/Explore2DScene' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );

  // constants
  const GRAPH_DIMENSION = VectorAdditionConstants.GRAPH_DIMENSION;
  const GRAPH_UPPER_LEFT_COORDINATE = VectorAdditionConstants.GRAPH_UPPER_LEFT_COORDINATE;
  const VECTOR_TYPE = VectorAdditionConstants.VECTOR_TYPE;

  class Explore2DModel extends VectorAdditionModel {
    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      super( tandem );

      // @public (read-only) {VectorTypes} vectorType - the vector type used on the explore1D screen
      this.vectorType = VECTOR_TYPE;
    }

    /**
     * @override
     * @private
     * Create the Sum Visibility properties. Explore2D only has one shared sum visible property
     */
    createSumVisibilityProperties() {

      // @public (read-only) {BooleanProperty} sumVisibleProperty
      this.sumVisibleProperty = new BooleanProperty( false );
    }

    /**
     * @override
     * @private
     * Reset the Sum Visibility properties. Explore2D only has one shared sum visible property
     */
    resetSumVisibilityProperties() {
      this.sumVisibleProperty.reset();
    }

    /**
     * @override
     * Create the scenes for Explore2D
     * Explore2D has one scene
     */
    createScenes() {

      // @public (read-only) {Explore2DScene} - the horizontal scene
      this.scene = new Explore2DScene(
        GRAPH_DIMENSION,
        GRAPH_UPPER_LEFT_COORDINATE,
        this.componentStyleProperty,
        this.sumVisibleProperty,
        VECTOR_TYPE );

      this.scenes.push( this.scene );
    }

  }

  return vectorAddition.register( 'Explore2DModel', Explore2DModel );
} );