// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );

  const EQUATION_GRAPH_BOUNDS = new Bounds2( -5, -5, 55, 30 );

  /**
   * @constructor
   */
  class EquationModel extends VectorAdditionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      super( [], tandem );

      // @public (read-only) {Graph}
      this.graph = new Graph( EQUATION_GRAPH_BOUNDS, GraphOrientations.TWO_DIMENSIONAL );
      this.graphs.push( this.graph );

    }

    // @public resets the model
    reset() {
      super.reset();
      this.graphOrientationProperty.reset();
    }
  }

  return vectorAddition.register( 'EquationModel', EquationModel );
} );