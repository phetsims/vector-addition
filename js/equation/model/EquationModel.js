// Copyright 2019, University of Colorado Boulder

/**
 * Model for the `Equation` screen.
 *
 * Equation has a polar and a horizontal scene. Each scene has one equation vector set. Each vector set is a fixed
 * amount of vectors.
 *
 * Equation has no 'creator panel' but uses number spinners to adjust a base vector model and coefficients.
 *
 * The sum is denoted by 'c' and is always visible.
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
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EquationGraph = require( 'VECTOR_ADDITION/equation/model/EquationGraph' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );

  class EquationModel extends VectorAdditionModel {
    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      // On equation, the 'sum' is always visible
      const equationSumVisibleProperty = new BooleanProperty( true );

      equationSumVisibleProperty.link( ( isSumVisible ) => {
        if ( !isSumVisible ) {
          assert && assert( false, 'equation sum vectors are always visible' );
        }
      } );

      super( tandem );

      //----------------------------------------------------------------------------------------
      // Create the two graphs

      // @public (read-only) {graph}
      this.polarGraph = new EquationGraph( CoordinateSnapModes.POLAR,
        this.componentStyleProperty,
        VectorColorGroups.THREE );

      // @public (read-only) {graph}
      this.cartesianGraph = new EquationGraph( CoordinateSnapModes.CARTESIAN,
        this.componentStyleProperty,
        VectorColorGroups.ONE );

    }

    /**
     * Resets the equation model
     */
    reset() {

      this.polarGraph.reset();
      this.cartesianGraph.reset();

      super.reset();
    }
  }

  return vectorAddition.register( 'EquationModel', EquationModel );
} );