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
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );

  // constants
  const GRAPH_DIMENSION = VectorAdditionConstants.GRAPH_DIMENSION;
  const GRAPH_UPPER_LEFT_COORDINATE = VectorAdditionConstants.GRAPH_UPPER_LEFT_COORDINATE;
  const DEFAULT_VECTOR_GROUP = VectorAdditionConstants.DEFAULT_VECTOR_GROUP;

  class Explore2DModel extends VectorAdditionModel {
    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // Create the one and only sum visible property for explore2D
      const sumVisibleProperty = new BooleanProperty( false );

      super( [ sumVisibleProperty ], tandem );

      // @public (read-only) {BooleanProperty} sumVisibleProperty
      this.sumVisibleProperty = sumVisibleProperty;

      // @public (read-only) {VectorGroups} vectorGroup - the vector group used on the explore2D screen
      this.vectorGroup = DEFAULT_VECTOR_GROUP;

      //----------------------------------------------------------------------------------------
      // Add the graphs on explore 2d

      // @public (read-only)
      this.polarGraph = this.addGraph(
        GRAPH_DIMENSION,
        GRAPH_UPPER_LEFT_COORDINATE,
        GraphOrientations.TWO_DIMENSIONAL );

      this.cartesianGraph = this.addGraph(
        GRAPH_DIMENSION,
        GRAPH_UPPER_LEFT_COORDINATE,
        GraphOrientations.TWO_DIMENSIONAL );

      //----------------------------------------------------------------------------------------
      //  Each graph has one vector set

      this.polarGraph.vectorSet = this.polarGraph.addVectorSet(
        this.componentStyleProperty, this.sumVisibleProperty, this.vectorGroup, CoordinateSnapModes.POLAR );

      this.cartesianGraph.vectorSet = this.cartesianGraph.addVectorSet(
        this.componentStyleProperty, this.sumVisibleProperty, this.vectorGroup, CoordinateSnapModes.CARTESIAN );

    }
  }

  return vectorAddition.register( 'Explore2DModel', Explore2DModel );
} );