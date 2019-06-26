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
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );

  // constants
  const DEFAULT_VECTOR_ORIENTATION = GraphOrientations.HORIZONTAL;
  const GRAPH_DIMENSION = VectorAdditionConstants.GRAPH_DIMENSION;
  const GRAPH_UPPER_LEFT_COORDINATE = new Vector2( -30, 20 );
  const DEFAULT_VECTOR_GROUP = VectorAdditionConstants.DEFAULT_VECTOR_GROUP;

  class Explore1DModel extends VectorAdditionModel {
    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // Create the one and only (shared between graphs) sum visible property for explore1D
      const sumVisibleProperty = new BooleanProperty( false );

      super( [ sumVisibleProperty ], tandem );

      // @public (read-only) {BooleanProperty} sumVisibleProperty
      this.sumVisibleProperty = sumVisibleProperty;

      // @public {EnumerationProperty.<GraphOrientations>} - controls the orientation of the vectors
      this.graphOrientationProperty = new EnumerationProperty( GraphOrientations, DEFAULT_VECTOR_ORIENTATION );

      // @public (read-only) {VectorGroups} VectorGroups - the only vector group used on the explore1D screen
      this.vectorGroup = DEFAULT_VECTOR_GROUP;

      //----------------------------------------------------------------------------------------
      // Add the graphs

      // @public (read-only)
      this.horizontalGraph = this.addGraph(
        GRAPH_DIMENSION,
        GRAPH_UPPER_LEFT_COORDINATE,
        GraphOrientations.HORIZONTAL );

      // @public (read-only)
      this.verticalGraph = this.addGraph(
        GRAPH_DIMENSION,
        GRAPH_UPPER_LEFT_COORDINATE,
        GraphOrientations.VERTICAL );

      //----------------------------------------------------------------------------------------
      // Each graph has one vector set for explore1D

      this.horizontalGraph.vectorSet = this.horizontalGraph.addVectorSet(
        this.componentStyleProperty, this.sumVisibleProperty, this.vectorGroup, CoordinateSnapModes.CARTESIAN );

      this.verticalGraph.vectorSet = this.verticalGraph.addVectorSet(
        this.componentStyleProperty, this.sumVisibleProperty, this.vectorGroup, CoordinateSnapModes.CARTESIAN );

      // Disable polar / cartesian mode
      this.coordinateSnapModeProperty.link( coordinateSnapMode => {
        if ( coordinateSnapMode !== CoordinateSnapModes.CARTESIAN ) {
          throw new Error( 'Explore1D only uses cartesian' );
        }
      } );

      // Disable angle
      this.angleVisibleProperty.link( angleVisible => {
        if ( angleVisible ) {
          throw new Error( 'Angles are never visible for Explore1D' );
        }
      } );
    }

    /**
     * @public
     * @override
     * Reset the Explore1D model
     */
    reset() {
      this.graphOrientationProperty.reset();
      super.reset();
    }
  }

  return vectorAddition.register( 'Explore1DModel', Explore1DModel );
} );