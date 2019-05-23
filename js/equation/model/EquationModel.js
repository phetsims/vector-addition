// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const CommonModel = require( 'VECTOR_ADDITION/common/model/CommonModel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientation = require( 'VECTOR_ADDITION/common/model/VectorOrientation' );

  /**
   * @constructor
   */
  class EquationModel extends CommonModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      super();
      this.gridModelBounds = new Bounds2( -5, -5, 35, 35 );
      this.vectorOrientationProperty = new Property( VectorOrientation.ALL );
    }

    // @public resets the model
    reset() {
      //TODO Reset things here.
    }

  }

  return vectorAddition.register( 'EquationModel', EquationModel );
} );