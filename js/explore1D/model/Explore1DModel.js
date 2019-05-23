// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  // const Property = require( 'AXON/Property' );
  // const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  // const Vector2Property = require( 'DOT/Vector2Property' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const CommonModel = require( 'VECTOR_ADDITION/common/model/CommonModel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  /**
   * @constructor
   */
  class Explore1DModel extends CommonModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      super();

      this.gridModelBounds = new Bounds2( -30, -20, 30, 20 );

      //TODO
    }

    // @public resets the model
    reset() {
      //TODO Reset things here.
    }

  }

  return vectorAddition.register( 'Explore1DModel', Explore1DModel );
} );