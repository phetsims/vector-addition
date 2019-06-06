// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  // const Vector2 = require( 'VECTOR_ADDITION/common/model/Vector2' );
  // const Vector2Property = require( 'DOT/Vector2Property' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const CommonModel = require( 'VECTOR_ADDITION/common/model/CommonModel' );
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
      const upperLeftLocation = new Vector2( -5, 35 );
      super( gridDimension, upperLeftLocation, tandem );

      this.gridModelBounds = new Bounds2( -5, -5, 55, 35 );
      this.vectorOrientationProperty = new Property( VectorOrientation.ALL );
    }

    // @public resets the model
    reset() {
      super.reset();
    }

  }

  return vectorAddition.register( 'Explore2DModel', Explore2DModel );
} );