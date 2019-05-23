// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const CommonScreenView = require( 'VECTOR_ADDITION/common/view/CommonScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class EquationScreenView extends CommonScreenView {

    /**
     * @param {EquationModel} equationModel
     * @param {Tandem} tandem
     */
    constructor( equationModel, tandem ) {

      const gridViewBounds = new Bounds2( 29, 90, 29 + 500, 90 + 500 );
      super( gridViewBounds, equationModel, tandem );

    }

  }

  return vectorAddition.register( 'EquationScreenView', EquationScreenView );
} );
