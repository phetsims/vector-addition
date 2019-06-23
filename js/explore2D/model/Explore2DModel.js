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
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );

  // constants
  const GRAPH_DIMENSION = VectorAdditionConstants.GRAPH_DIMENSION;
  const GRAPH_UPPER_LEFT_COORDINATE = VectorAdditionConstants.GRAPH_UPPER_LEFT_COORDINATE;
  const VECTOR_TYPE = VectorAdditionConstants.VECTOR_TYPE;

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

      // @public (read-only) {VectorTypes} vectorType - the vector type used on the explore1D screen
      this.vectorType = VECTOR_TYPE;

      //----------------------------------------------------------------------------------------
      // Add the only graph on explore 2d

      // @public (read-only)
      this.graph = this.addGraph( 
        GRAPH_DIMENSION,
        GRAPH_UPPER_LEFT_COORDINATE,
        GraphOrientations.TWO_DIMENSIONAL );


      //----------------------------------------------------------------------------------------
      // The graph has one vector set

      this.graph.vectorSet = this.graph.addVectorSet(
        this.componentStyleProperty, this.sumVisibleProperty, this.vectorType );


    }
  }

  return vectorAddition.register( 'Explore2DModel', Explore2DModel );
} );