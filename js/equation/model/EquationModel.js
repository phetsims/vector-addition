// Copyright 2019, University of Colorado Boulder

/**
 * Model for the `Equation` screen.
 *
 * Equation has a polar and a horizontal scene. Each scene has one equation vector set. Each vector set is a fixed
 * amount of vectors.
 *
 * Equation has no 'creator panel' but uses number spinners to adjust a base vector model and coefficients.
 *
 * The sum is denoted by 'c'. The sum is always visible.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );


  const EQUATION_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS
                                  .withOffsets( 0, 0, 0, -VectorAdditionConstants.DEFAULT_VECTOR_LENGTH );

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
      // super.reset();
      // this.graphOrientationProperty.reset();
    }
  }

  return vectorAddition.register( 'EquationModel', EquationModel );
} );