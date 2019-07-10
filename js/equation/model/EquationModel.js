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
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );
  const EquationScene = require( 'VECTOR_ADDITION/equation/model/EquationScene' );

  class EquationModel extends VectorAdditionModel {
    /**
     * @param {Tandem} tandem
     * @constructor
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
      this.polarScene = new EquationScene( CoordinateSnapModes.POLAR, this.componentStyleProperty, VectorGroups.THREE );

      // @public (read-only) {graph}
      this.cartesianScene = new EquationScene( CoordinateSnapModes.CARTESIAN, this.componentStyleProperty, VectorGroups.ONE );

    }

    /**
     * Resets the equation model
     */
    reset() {


      // this.polarGraph.reset();
      // this.cartesianGraph.reset();
      
      super.reset();
    }
  }

  return vectorAddition.register( 'EquationModel', EquationModel );
} );