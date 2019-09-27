// Copyright 2019, University of Colorado Boulder

/**
 * GraphControlPanel is the base class for graph control panels. These panels contain controls that affect the graph.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Panel = require( 'SUN/Panel' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  class GraphControlPanel extends Panel {

    /**
     * @param {Node[]} children
     * @param {Object} [options]
     */
    constructor( children, options ) {

      options = _.extend( {}, VectorAdditionConstants.PANEL_OPTIONS, options );

      const content = new VBox( {
        children: children,
        spacing: VectorAdditionConstants.GRAPH_CONTROL_PANEL_Y_SPACING,
        align: 'left'
      } );

      // Make the panel a fixed width
      assert && assert( options.minWidth === undefined, 'GraphControlPanel sets minWidth' );
      assert && assert( options.maxWidth === undefined, 'GraphControlPanel sets maxWidth' );
      const panelWidth = VectorAdditionConstants.GRAPH_CONTROL_PANEL_CONTENT_WIDTH + ( 2 * options.xMargin );
      options.minWidth = panelWidth;
      options.maxWidth = panelWidth;

      super( content, options );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'GraphControlPanel is not intended to be disposed' );
    }
  }

  return vectorAddition.register( 'GraphControlPanel', GraphControlPanel );
} );