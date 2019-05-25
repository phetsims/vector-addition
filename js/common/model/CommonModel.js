// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientation = require( 'VECTOR_ADDITION/common/model/VectorOrientation' );

  /**
   * @constructor
   */
  class CommonModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {


      this.sumVisibleProperty = new BooleanProperty( false );
      this.valuesVisibleProperty = new BooleanProperty( false );
      this.gridVisibleProperty = new BooleanProperty( false );
      this.vectorOrientationProperty = new Property( VectorOrientation.HORIZONTAL );


    }

    // @public resets the model
    reset() {
      this.sumVisibleProperty.reset();
      this.valuesVisibleProperty.reset();
      this.gridVisibleProperty.reset();
    }

  }

  return vectorAddition.register( 'CommonModel', CommonModel );
} );