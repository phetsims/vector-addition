// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const CommonScreenView = require( 'VECTOR_ADDITION/common/view/CommonScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class LabScreenView extends CommonScreenView {

    /**
     * @param {LabModel} labModel
     * @param {Tandem} tandem
     */
    constructor( labModel, tandem ) {

      super( labModel, tandem );

    }
  }

  return vectorAddition.register( 'LabScreenView', LabScreenView );
} );