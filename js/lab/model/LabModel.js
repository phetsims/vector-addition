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
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

  // constants
  const GRAPH_DIMENSION = VectorAdditionConstants.GRAPH_DIMENSION;
  const GRAPH_UPPER_LEFT_COORDINATE = VectorAdditionConstants.GRAPH_UPPER_LEFT_COORDINATE;

  class LabModel extends VectorAdditionModel {
    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // Create the TWO sum visible properties for lab

      const group1SumVisibleProperty = new BooleanProperty( false );
      const group2SumVisibleProperty = new BooleanProperty( false );

      super( [ group1SumVisibleProperty, group2SumVisibleProperty ], tandem );

      // @public (read-only) {BooleanProperty} group1SumVisibleProperty
      this.group1SumVisibleProperty = group1SumVisibleProperty;

      // @public (read-only) {BooleanProperty} group2SumVisibleProperty
      this.group2SumVisibleProperty = group2SumVisibleProperty;


      //----------------------------------------------------------------------------------------
      // Add the only graph on lab

      // @public (read-only)
      this.graph = this.addGraph( 
        GRAPH_DIMENSION,
        GRAPH_UPPER_LEFT_COORDINATE,
        GraphOrientations.TWO_DIMENSIONAL );


      //----------------------------------------------------------------------------------------
      // The graph has TWO vector sets

      this.graph.group1VectorSet = this.graph.addVectorSet(
        this.componentStyleProperty, this.group1SumVisibleProperty, VectorGroups.ONE );

      this.graph.group2VectorSet = this.graph.addVectorSet(
        this.componentStyleProperty, this.group2SumVisibleProperty, VectorGroups.TWO );

    }
  }

  return vectorAddition.register( 'LabModel', LabModel );
} );