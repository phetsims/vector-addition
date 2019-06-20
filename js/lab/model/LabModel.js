// Copyright 2019, University of Colorado Boulder

/**
 * Model for the Lab screen
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const LabScene = require( 'VECTOR_ADDITION/lab/model/LabScene' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );

  // constants
  const GRAPH_DIMENSION = VectorAdditionConstants.GRAPH_DIMENSION;
  const GRAPH_UPPER_LEFT_COORDINATE = VectorAdditionConstants.GRAPH_UPPER_LEFT_COORDINATE;


  class LabModel extends VectorAdditionModel {
    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      super( tandem );
    }

    /**
     * @override
     * @private
     * Create the Sum Visibility properties. Lab has 2 sum visible properties
     */
    createSumVisibilityProperties() {

      // @public {BooleanProperty}
      this.sumGroup1VisibleProperty = new BooleanProperty( false );
      // @public {BooleanProperty}
      this.sumGroup2VisibleProperty = new BooleanProperty( false );
    }

    /**
     * @override
     * @private
     * Reset the Sum Visibility properties.
     */
    resetSumVisibilityProperties() {
      this.sumGroup1VisibleProperty.reset();
      this.sumGroup2VisibleProperty.reset();
    }

    /**
     * @override
     * Create the scenes for Lab
     * Lab has one scene
     */
    createScenes() {
      // @public (read-only) {Explore2DScene} - the horizontal scene
      this.scene = new LabScene(
        GRAPH_DIMENSION,
        GRAPH_UPPER_LEFT_COORDINATE,
        this.componentStyleProperty,
        this.sumGroup1VisibleProperty,
        this.sumGroup2VisibleProperty );

      this.scenes.push( this.scene );
    }

  }

  return vectorAddition.register( 'LabModel', LabModel );
} );