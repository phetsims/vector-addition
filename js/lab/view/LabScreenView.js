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

  class LabScreenView extends CommonScreenView {

    /**
     * @param {LabModel} labModel
     * @param {Tandem} tandem
     */
    constructor( labModel, tandem ) {

      const gridViewBounds = new Bounds2( 29, 90, 29 + 750, 90 + 500 );
      super( gridViewBounds, labModel, tandem );

    }
  }

  return vectorAddition.register( 'LabScreenView', LabScreenView );
} );