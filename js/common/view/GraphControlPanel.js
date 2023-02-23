// Copyright 2019-2023, University of Colorado Boulder

/**
 * GraphControlPanel is the base class for graph control panels. These panels contain controls that affect the graph.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

export default class GraphControlPanel extends Panel {

  /**
   * @param {Node[]} children
   * @param {Object} [options]
   */
  constructor( children, options ) {

    options = merge( {}, VectorAdditionConstants.PANEL_OPTIONS, options );

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

vectorAddition.register( 'GraphControlPanel', GraphControlPanel );