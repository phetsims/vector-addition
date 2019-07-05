// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel at the top of the equation screen to toggle coefficients.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const ExpandCollapsePanel = require( 'VECTOR_ADDITION/common/view/ExpandCollapsePanel' );
  
  // constants

  class CoefficientSelectorPanel extends ExpandCollapsePanel {
    /**
     * @constructor
     * arguments
     */
    constructor( vectorSet, options ) {

      super( new Text( 'closed' ), new Text( 'open' ), options );
    }

  }

  return vectorAddition.register( 'CoefficientSelectorPanel', CoefficientSelectorPanel );
} );