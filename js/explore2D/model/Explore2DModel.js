// Copyright 2019, University of Colorado Boulder

/**
 * Model for the `Explore2D` screen.
 *
 * Explore2D has a polar and a cartesian graph. Each scene has one vector set respectively.
 *
 * Explore2D has two visibility properties: one for each scene respectively.
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
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

  // constants
  const EXPLORE_2D_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;
  const DEFAULT_SUM_VISIBLE = VectorAdditionConstants.DEFAULT_SUM_VISIBLE;

  class Explore2DModel extends VectorAdditionModel {
    /**
     * @param {Tandem} tandem
     * @constructor
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      //----------------------------------------------------------------------------------------
      // Create the 2 sum visibility properties for each scene respectively

      const polarSumVisibileProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      const cartesianSumVisibileProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      super( [ polarSumVisibileProperty, cartesianSumVisibileProperty ], tandem );

      //----------------------------------------------------------------------------------------
      // Create references to the two sum visible properties

      // @public (read-only) {BooleanProperty} polarSumVisibileProperty
      this.polarSumVisibileProperty = polarSumVisibileProperty;

      // @public (read-only) {BooleanProperty} cartesianSumVisibileProperty
      this.cartesianSumVisibileProperty = cartesianSumVisibileProperty;

      //----------------------------------------------------------------------------------------
      // Declare the vector groups for each graph

      // @public (read-only) {VectorGroups} the vector group used on the cartesian scene
      this.cartesianVectorGroup = VectorGroups.ONE;

      // @public (read-only) {VectorGroups} the vector group used on the polar scene
      this.polarVectorGroup = VectorGroups.THREE;

      //----------------------------------------------------------------------------------------
      // Create and add the graphs

      // @public (read-only) {Graph}
      this.polarGraph = new Graph( EXPLORE_2D_GRAPH_BOUNDS, CoordinateSnapModes.POLAR, GraphOrientations.TWO_DIMENSIONAL );

      // @public (read-only) {Graph}
      this.cartesianGraph = new Graph( EXPLORE_2D_GRAPH_BOUNDS, CoordinateSnapModes.CARTESIAN, GraphOrientations.TWO_DIMENSIONAL );

      this.graphs.push( this.polarGraph, this.cartesianGraph );

      //----------------------------------------------------------------------------------------
      // Create the vector sets. Each graph has one vector set

      // @public (read-only) {VectorSet}
      this.polarVectorSet = this.polarGraph.createVectorSet( this.componentStyleProperty,
        this.polarSumVisibileProperty,
        this.polarVectorGroup );

      // @public (read-only) {VectorSet}
      this.cartesianVectorSet = this.cartesianGraph.createVectorSet( this.componentStyleProperty,
        this.cartesianSumVisibileProperty,
        this.cartesianVectorGroup );

      this.polarGraph.vectorSets.push( this.polarVectorSet );
      this.cartesianGraph.vectorSets.push( this.cartesianVectorSet );
    }
  }

  return vectorAddition.register( 'Explore2DModel', Explore2DModel );
} );