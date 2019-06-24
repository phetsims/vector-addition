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
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Vector2 = require( 'DOT/Vector2' );

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
        this.componentStyleProperty, this.sumVisibleProperty, this.vectorGroup );

      this.verticalGraph.vectorSet = this.verticalGraph.addVectorSet(
        this.componentStyleProperty, this.sumVisibleProperty, this.vectorGroup );

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