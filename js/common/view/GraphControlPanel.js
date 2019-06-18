// Copyright 2019, University of Colorado Boulder

/**
 * Control panel that appears on the top-right corner.
 *
 * This has a fixed width.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Panel = require( 'SUN/Panel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Node = require( 'SCENERY/nodes/Node' );

  // constants
  const PANEL_WIDTH = VectorAdditionConstants.PANEL_WIDTH;


  class GraphControlPanel extends Panel {

    /**
     * @param {Node} content
     * @param {Object} [options]
     * @constructor
     */
    constructor( content, options ) {

      assert && assert( content instanceof Node, `invalid content: ${content}` );

      // prevents the content from getting narrower than fixedWidth
      const strut = new HStrut( PANEL_WIDTH, { pickable: false } );


      // align content to the left
      content.left = strut.left;

      const fixedWidthNode = new Node( {
        maxWidth: PANEL_WIDTH, // prevents the content from getting wider than fixedWidth
        children: [ strut, content ]
      } );

      super( fixedWidthNode, options );
    }
  }

  return vectorAddition.register( 'GraphControlPanel', GraphControlPanel );
} );
