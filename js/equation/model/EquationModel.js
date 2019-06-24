// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );

  /**
   * @constructor
   */
  class EquationModel extends VectorAdditionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // Create the TWO sum visible properties for equation

      const group1SumVisibleProperty = new BooleanProperty( false );
      const group2SumVisibleProperty = new BooleanProperty( false );

      super( [ group1SumVisibleProperty, group2SumVisibleProperty ], tandem );

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