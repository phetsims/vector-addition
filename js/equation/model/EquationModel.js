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
 * The equation model adds the following to the vector addition model
 *  - Properties (one for each scene) to control equation types (see ./EquationTypes.js)
 *  - Properties (one for each scene) to control if the base vectors are visible
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  // const BooleanProperty = require( 'AXON/BooleanProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );

  // constants
  const EQUATION_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS
                                  .withOffsets( 0, 0, 0, -VectorAdditionConstants.DEFAULT_VECTOR_LENGTH );
  const STARTING_EQUATION_TYPE = EquationTypes.ADDITION;

  class EquationModel extends VectorAdditionModel {
    /**
     * @param {Tandem} tandem
     * @constructor
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      // On equation, the 'sum' is always visible
      const equationSumVisibleProperties = [];

      super( equationSumVisibleProperties, tandem );

      //----------------------------------------------------------------------------------------
      // Create the two graphs

      // @public (read-only) {graph}
      this.polarGraph = new Graph( EQUATION_GRAPH_BOUNDS, GraphOrientations.TWO_DIMENSIONAL );

      // @public (read-only) {graph}
      this.cartesianGraph = new Graph( EQUATION_GRAPH_BOUNDS, GraphOrientations.TWO_DIMENSIONAL );

      this.graphs.push( this.polarGraph, this.cartesianGraph );

      //----------------------------------------------------------------------------------------
      // Add properties (one for each scene) to control equation types (see ./EquationTypes.js)

      // @public (read-only) {EnumerationProperty}
      this.polarEquationTypeProperty = new EnumerationProperty( EquationTypes, STARTING_EQUATION_TYPE );

      // @public (read-only) {EnumerationProperty}
      this.cartesianEquationTypeProperty = new EnumerationProperty( EquationTypes, STARTING_EQUATION_TYPE );

      //----------------------------------------------------------------------------------------
      // Add properties (one for each scene) to control if the base vectors are visible

      // // @public (read-only) {BooleanProperty}
      // this.polarBaseVectorsVisible = new  BooleanProperty

    }

    // @public resets the model
    reset() {
      // super.reset();
      // this.graphOrientationProperty.reset();
    }
  }

  return vectorAddition.register( 'EquationModel', EquationModel );
} );