// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  // const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  // const Vector2Property = require( 'DOT/Vector2Property' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const CommonModel = require( 'VECTOR_ADDITION/common/model/CommonModel' );
  const Property = require( 'AXON/Property' );
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

      super();

      this.gridModelBounds = new Bounds2( -5, -5, 55, 35 );
      this.vectorOrientationProperty = new Property( VectorOrientation.ALL );

      this.angleVisibleProperty = new BooleanProperty( false );
    }

    // @public resets the model
    reset() {
      super.reset();
      this.angleVisibleProperty.reset();
    }

  }

  return vectorAddition.register( 'Explore2DModel', Explore2DModel );
} );