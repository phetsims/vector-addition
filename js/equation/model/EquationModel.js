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
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
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
      this.graphOrientationProperty = new Property( GraphOrientations.TWO_DIMENSIONAL );
    }

    // @public resets the model
    reset() {
      super.reset();
      this.graphOrientationProperty.reset();
    }

  }

  return vectorAddition.register( 'EquationModel', EquationModel );
} );