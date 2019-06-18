// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );

  /**
   * @constructor
   */
  class EquationModel extends VectorAdditionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      super();
      this.gridModelBounds = new Bounds2( -5, -5, 35, 35 );
      this.vectorOrientationProperty = new Property( VectorOrientations.TWO_DIMENSIONAL );
    }

    // @public resets the model
    reset() {
      super.reset();
      this.vectorOrientationProperty.reset();
    }

  }

  return vectorAddition.register( 'EquationModel', EquationModel );
} );