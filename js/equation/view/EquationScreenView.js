// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class EquationScreenView extends VectorAdditionScreenView {

    /**
     * @param {EquationModel} equationModel
     * @param {Tandem} tandem
     */
    constructor( equationModel, tandem ) {

      super( equationModel, tandem );

    }

  }

  return vectorAddition.register( 'EquationScreenView', EquationScreenView );
} );
