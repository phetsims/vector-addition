// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const CommonModel = require( 'VECTOR_ADDITION/common/model/CommonModel' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  /**
   * @constructor
   */
  class Explore1DModel extends CommonModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const gridDimension = new Dimension2( 60, 40 );
      const upperLeftLocation = new Vector2( -30, 20 );

      super( gridDimension, upperLeftLocation, tandem );

      // the angle visibility should be set to false for Explore1D
      this.angleVisibleProperty.link( ( visible ) => {
        if ( visible ) {
          throw new Error( 'Angle Visibility is set to False for Explore1D ' );
        }
      } );
    }

    // @public resets the model
    reset() {
      super.reset();
    }

  }

  return vectorAddition.register( 'Explore1DModel', Explore1DModel );
} );