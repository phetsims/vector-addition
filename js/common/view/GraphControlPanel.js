// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel that appears on the upper-right corner of every screen respectively.
 *
 * Encapsulated class for all control panels but accommodates the different control panel content of each screen. 
 * See https://github.com/phetsims/vector-addition/issues/79 for context.
 *
 * ## Ordering
 *  - Sum Checkboxes Container (optional)
 *  - Values Visible Checkbox
 *  - Angle Visible Checkbox (optional)
 *  - Grid Visible Checkbox
 *  - Line and Component style radio buttons (optional)
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Panel = require( 'SUN/Panel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );


  // constants

  class GraphControlPanel extends Panel {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {
       
       assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
         `Extra prototype on Options: ${options}` );

       super();
    }

  }

  return vectorAddition.register( 'GraphControlPanel', GraphControlPanel );
} );