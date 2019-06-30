// Copyright 2019, University of Colorado Boulder

/**
 * Model for the Explore2D screen. Explore2D has a polar and a cartesian scene. Each scene has one vector set.
 * Explore2D has two visibility properties: one for each scene.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

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

      const polarSumVisibileProperty = new BooleanProperty( false );
      const cartesianSumVisibileProperty = new BooleanProperty( false );

      super( [ polarSumVisibileProperty, cartesianSumVisibileProperty ], tandem );


      // @public (read-only) {BooleanProperty} polarSumVisibileProperty
      this.polarSumVisibileProperty = polarSumVisibileProperty;
     
      // @public (read-only) {BooleanProperty} cartesianSumVisibileProperty
      this.cartesianSumVisibileProperty = cartesianSumVisibileProperty;

      //----------------------------------------------------------------------------------------

      // @public (read-only) {VectorGroups} the vector group used on the cartesian scene
      this.cartesianVectorGroup = VectorGroups.ONE;

      // @public (read-only) {VectorGroups} the vector group used on the polar scene
      this.polarVectorGroup = VectorGroups.THREE;

      //----------------------------------------------------------------------------------------
      // Create and add the graphs
      
      // @public (read-only) {Graph}
      this.polarGraph = new Graph( GRAPH_DIMENSION,
        GRAPH_UPPER_LEFT_COORDINATE,
        GraphOrientations.TWO_DIMENSIONAL );
      this.graphs.push( this.polarGraph );

      // @public (read-only) {Graph}
      this.cartesianGraph = new Graph( GRAPH_DIMENSION,
        GRAPH_UPPER_LEFT_COORDINATE,
        GraphOrientations.TWO_DIMENSIONAL );
      this.graphs.push( this.cartesianGraph );

      //----------------------------------------------------------------------------------------
      // Create the vector sets. Each graph has one vector set

      this.polarGraph.vectorSet = this.polarGraph.createVectorSet( this.componentStyleProperty,
        this.polarSumVisibileProperty,
        this.polarVectorGroup,
        CoordinateSnapModes.POLAR );
      this.polarGraph.vectorSets.push( this.polarGraph.vectorSet );

      this.cartesianGraph.vectorSet = this.cartesianGraph.createVectorSet( this.componentStyleProperty,
        this.cartesianSumVisibileProperty,
        this.cartesianVectorGroup,
        CoordinateSnapModes.CARTESIAN );
      this.cartesianGraph.vectorSets.push( this.cartesianGraph.vectorSet );

    }
  }

  return vectorAddition.register( 'Explore2DModel', Explore2DModel );
} );