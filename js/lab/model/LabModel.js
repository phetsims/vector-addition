// Copyright 2019, University of Colorado Boulder

/**
 * Model for the `Lab` screen.
 *
 * Lab has a polar and a cartesian graph. Each scene has two vector sets respectively.
 *
 * Lab has four visibility properties: two for each scene respectively.
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
  const LAB_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;
  const DEFAULT_SUM_VISIBLE = VectorAdditionConstants.DEFAULT_SUM_VISIBLE;


  class LabModel extends VectorAdditionModel {
    /**
     * @param {Tandem} tandem
     * @constructor
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      //----------------------------------------------------------------------------------------
      // Create the 2 sum visible properties for cartesian scene

      const cartesianGroup1SumVisibileProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      const cartesianGroup2SumVisibileProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      //----------------------------------------------------------------------------------------
      // Create the 2 sum visible properties for polar scene

      const polarGroup3SumVisibileProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      const polarGroup4SumVisibileProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      super( [ cartesianGroup1SumVisibileProperty, cartesianGroup2SumVisibileProperty, polarGroup3SumVisibileProperty, polarGroup4SumVisibileProperty ], tandem );

      //----------------------------------------------------------------------------------------
      // Reference the sum visible properties

      // @public (read-only) {BooleanProperty}
      this.cartesianGroup1SumVisibileProperty = cartesianGroup1SumVisibileProperty;

      // @public (read-only) {BooleanProperty}
      this.cartesianGroup2SumVisibileProperty = cartesianGroup2SumVisibileProperty;

      // @public (read-only) {BooleanProperty}
      this.polarGroup3SumVisibileProperty = polarGroup3SumVisibileProperty;

      // @public (read-only) {BooleanProperty}
      this.polarGroup4SumVisibileProperty = polarGroup4SumVisibileProperty;

      //----------------------------------------------------------------------------------------
      // Create and add the graphs.

      // @public (read-only) {Graph}
      this.polarGraph = new Graph( LAB_GRAPH_BOUNDS, GraphOrientations.TWO_DIMENSIONAL );

      // @public (read-only) {Graph}
      this.cartesianGraph = new Graph( LAB_GRAPH_BOUNDS, GraphOrientations.TWO_DIMENSIONAL );

      this.graphs.push( this.cartesianGraph, this.polarGraph );

      //----------------------------------------------------------------------------------------
      // Create the two vector sets for the cartesian scene

      // @public (read-only) {VectorSet}
      this.cartesianGroup1VectorSet = this.cartesianGraph.createVectorSet( this.componentStyleProperty,
        this.cartesianGroup1SumVisibileProperty,
        VectorGroups.ONE,
        CoordinateSnapModes.CARTESIAN );

      // @public (read-only) {VectorSet}
      this.cartesianGroup2VectorSet = this.cartesianGraph.createVectorSet( this.componentStyleProperty,
        this.cartesianGroup2SumVisibileProperty,
        VectorGroups.TWO,
        CoordinateSnapModes.CARTESIAN );

      this.cartesianGraph.vectorSets.push( this.cartesianGroup1VectorSet, this.cartesianGroup2VectorSet );

      //----------------------------------------------------------------------------------------
      // Create the two vector sets for the polar scene

      // @public (read-only) {VectorSet}
      this.polarGroup3VectorSet = this.polarGraph.createVectorSet( this.componentStyleProperty,
        this.polarGroup3SumVisibileProperty,
        VectorGroups.THREE,
        CoordinateSnapModes.POLAR );

      // @public (read-only) {VectorSet}
      this.polarGroup4VectorSet = this.polarGraph.createVectorSet( this.componentStyleProperty,
        this.polarGroup4SumVisibileProperty,
        VectorGroups.FOUR,
        CoordinateSnapModes.POLAR );

      this.polarGraph.vectorSets.push( this.polarGroup3VectorSet, this.polarGroup4VectorSet );
    }
  }

  return vectorAddition.register( 'LabModel', LabModel );
} );