// Copyright 2019, University of Colorado Boulder

/**
 * Model for the Explore1D screen
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Explore1DScene = require( 'VECTOR_ADDITION/explore1D/model/Explore1DScene' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const DEFAULT_VECTOR_ORIENTATION = VectorOrientations.HORIZONTAL;
  const GRAPH_DIMENSION = VectorAdditionConstants.GRAPH_DIMENSION;
  const GRAPH_UPPER_LEFT_COORDINATE = new Vector2( -30, 20 );
  const VECTOR_TYPE = VectorAdditionConstants.VECTOR_TYPE;

  class Explore1DModel extends VectorAdditionModel {
    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      super( tandem );

      // @public {EnumerationProperty.<VectorOrientations>} - controls the orientation of the vectors
      this.vectorOrientationProperty = new EnumerationProperty( VectorOrientations, DEFAULT_VECTOR_ORIENTATION );

      // @public (read-only) {VectorTypes} vectorType - the vector type used on the explore1D screen
      this.vectorType = VECTOR_TYPE;

    }

    /**
     * @override
     * @private
     * Create the Sum Visibility properties. Explore1D only has one shared sum visible property
     */
    createSumVisibilityProperties() {

      // @public (read-only) {BooleanProperty} sumVisibleProperty
      this.sumVisibleProperty = new BooleanProperty( false );
    }

    /**
     * @override
     * @private
     * Reset the Sum Visibility properties. Explore1D only has one shared sum visible property
     */
    resetSumVisibilityProperties() {
      this.sumVisibleProperty.reset();
    }

    /**
     * @override
     * Create the scenes for Explore1D
     * Explore1D has two (horizontal and vertical)
     */
    createScenes() {

      // @public (read-only) {Explore1DScene} - the horizontal scene
      this.horizontalScene = new Explore1DScene(
        GRAPH_DIMENSION,
        GRAPH_UPPER_LEFT_COORDINATE,
        this.componentStyleProperty,
        this.sumVisibleProperty,
        VectorOrientations.HORIZONTAL,
        VECTOR_TYPE );

      // @public (read-only) {Explore1DScene} - the vertical scene
      this.verticalScene = new Explore1DScene(
        GRAPH_DIMENSION,
        GRAPH_UPPER_LEFT_COORDINATE,
        this.componentStyleProperty,
        this.sumVisibleProperty,
        VectorOrientations.VERTICAL,
        VECTOR_TYPE );

      this.scenes.push( this.horizontalScene, this.verticalScene );
    }

  }

  return vectorAddition.register( 'Explore1DModel', Explore1DModel );
} );