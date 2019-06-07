// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const CommonScreenView = require( 'VECTOR_ADDITION/common/view/CommonScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class EquationScreenView extends CommonScreenView {

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
