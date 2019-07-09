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

      super( tandem );

      //----------------------------------------------------------------------------------------
      // Reference the sum visible properties

      // @public (read-only) {BooleanProperty}
      this.cartesianGroup1SumVisibileProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      // @public (read-only) {BooleanProperty}
      this.cartesianGroup2SumVisibileProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      // @public (read-only) {BooleanProperty}
      this.polarGroup3SumVisibileProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      // @public (read-only) {BooleanProperty}
      this.polarGroup4SumVisibileProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      //----------------------------------------------------------------------------------------
      // Create and add the graphs.

      // @public (read-only) {Graph}
      this.polarGraph = new Graph( LAB_GRAPH_BOUNDS, CoordinateSnapModes.POLAR, GraphOrientations.TWO_DIMENSIONAL );

      // @public (read-only) {Graph}
      this.cartesianGraph = new Graph( LAB_GRAPH_BOUNDS, CoordinateSnapModes.CARTESIAN, GraphOrientations.TWO_DIMENSIONAL );

      //----------------------------------------------------------------------------------------
      // Create the two vector sets for the cartesian scene

      // @public (read-only) {VectorSet}
      this.cartesianGroup1VectorSet = this.cartesianGraph.createVectorSet( this.componentStyleProperty,
        this.cartesianGroup1SumVisibileProperty,
        VectorGroups.ONE );

      // @public (read-only) {VectorSet}
      this.cartesianGroup2VectorSet = this.cartesianGraph.createVectorSet( this.componentStyleProperty,
        this.cartesianGroup2SumVisibileProperty,
        VectorGroups.TWO );

      this.cartesianGraph.vectorSets.push( this.cartesianGroup1VectorSet, this.cartesianGroup2VectorSet );

      //----------------------------------------------------------------------------------------
      // Create the two vector sets for the polar scene

      // @public (read-only) {VectorSet}
      this.polarGroup3VectorSet = this.polarGraph.createVectorSet( this.componentStyleProperty,
        this.polarGroup3SumVisibileProperty,
        VectorGroups.THREE );

      // @public (read-only) {VectorSet}
      this.polarGroup4VectorSet = this.polarGraph.createVectorSet( this.componentStyleProperty,
        this.polarGroup4SumVisibileProperty,
        VectorGroups.FOUR );

      this.polarGraph.vectorSets.push( this.polarGroup3VectorSet, this.polarGroup4VectorSet );
    }


    reset() {
      this.cartesianGraph.reset();
      this.polarGraph.reset();

      this.cartesianGroup1SumVisibileProperty.reset();

      // @public (read-only) {BooleanProperty}
      this.cartesianGroup2SumVisibileProperty.reset();

      // @public (read-only) {BooleanProperty}
      this.polarGroup3SumVisibileProperty.reset();

      // @public (read-only) {BooleanProperty}
      this.polarGroup4SumVisibileProperty.reset();

    }
  }

  return vectorAddition.register( 'LabModel', LabModel );
} );