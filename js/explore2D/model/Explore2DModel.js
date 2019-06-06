// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const CommonModel = require( 'VECTOR_ADDITION/common/model/CommonModel' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientation = require( 'VECTOR_ADDITION/common/model/VectorOrientation' );

  /**
   * @constructor
   */
  class Explore2DModel extends CommonModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const gridDimension = new Dimension2( 60, 40 );
      const upperLeftCoordinate = new Vector2( -5, 35 );

      super( gridDimension, upperLeftCoordinate, tandem );

      this.vectorOrientationProperty = new Property( VectorOrientation.ALL );
    }

    // @public resets the model
    reset() {
      super.reset();
    }

  }

  return vectorAddition.register( 'Explore2DModel', Explore2DModel );
} );