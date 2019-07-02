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
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );

  // constants
  const GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

  class LabModel extends VectorAdditionModel {
    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // Create the 2 sum visible properties per scene for lab

      const cartesianGroup1SumVisibileProperty = new BooleanProperty( false );
      const cartesianGroup2SumVisibileProperty = new BooleanProperty( false );

      const polarGroup3SumVisibileProperty = new BooleanProperty( false );
      const polarGroup4SumVisibileProperty = new BooleanProperty( false );

      super( [ cartesianGroup1SumVisibileProperty, cartesianGroup2SumVisibileProperty, polarGroup3SumVisibileProperty, polarGroup4SumVisibileProperty ], tandem );


      this.cartesianGroup1SumVisibileProperty = cartesianGroup1SumVisibileProperty;
      this.cartesianGroup2SumVisibileProperty = cartesianGroup2SumVisibileProperty;
      this.polarGroup3SumVisibileProperty = polarGroup3SumVisibileProperty;
      this.polarGroup4SumVisibileProperty = polarGroup4SumVisibileProperty;

      //----------------------------------------------------------------------------------------
      // Create and add the graphs

      // @public (read-only) {Graph}
      this.polarGraph = new Graph( GRAPH_BOUNDS, GraphOrientations.TWO_DIMENSIONAL );
      this.graphs.push( this.polarGraph );

      // @public (read-only) {Graph}
      this.cartesianGraph = new Graph( GRAPH_BOUNDS, GraphOrientations.TWO_DIMENSIONAL );
      this.graphs.push( this.cartesianGraph );

      //----------------------------------------------------------------------------------------
      // Create the vector sets. Each graph has two vector set


      this.cartesianGraph.group1VectorSet = this.cartesianGraph.createVectorSet( this.componentStyleProperty,
        this.cartesianGroup1SumVisibileProperty,
        VectorGroups.ONE,
        CoordinateSnapModes.CARTESIAN );
      this.cartesianGraph.vectorSets.push( this.cartesianGraph.group1VectorSet );

      this.cartesianGraph.group2VectorSet = this.cartesianGraph.createVectorSet( this.componentStyleProperty,
        this.cartesianGroup2SumVisibileProperty,
        VectorGroups.TWO,
        CoordinateSnapModes.CARTESIAN );
      this.cartesianGraph.vectorSets.push( this.cartesianGraph.group2VectorSet );

      this.polarGraph.group3VectorSet = this.polarGraph.createVectorSet( this.componentStyleProperty,
        this.polarGroup3SumVisibileProperty,
        VectorGroups.THREE,
        CoordinateSnapModes.POLAR );
      this.polarGraph.vectorSets.push( this.polarGraph.group3VectorSet );

      this.polarGraph.group4VectorSet = this.polarGraph.createVectorSet( this.componentStyleProperty,
        this.polarGroup4SumVisibileProperty,
        VectorGroups.FOUR,
        CoordinateSnapModes.POLAR );
      this.polarGraph.vectorSets.push( this.polarGraph.group4VectorSet );


    }
  }

  return vectorAddition.register( 'LabModel', LabModel );
} );