// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Vector2 = require( 'DOT/Vector2' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const CommonModel = require( 'VECTOR_ADDITION/common/model/CommonModel' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );

  /**
   * @constructor
   */
  class LabModel extends CommonModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const gridDimension = new Dimension2( 60, 40 );

      const upperLeftCoordinate = new Vector2( -5, 35 );

      super( gridDimension, upperLeftCoordinate, tandem );

      this.vectorOrientationProperty = new Property( VectorOrientations.ALL );
    }

    // @public resets the model
    reset() {
      super.reset();
    }

  }

  return vectorAddition.register( 'LabModel', LabModel );
} );