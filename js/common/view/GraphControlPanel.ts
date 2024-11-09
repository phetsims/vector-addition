// Copyright 2019-2024, University of Colorado Boulder

/**
 * GraphControlPanel is the base class for graph control panels. These panels contain controls that affect the graph.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node, NodeTranslationOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

export type GraphControlPanelOptions = SelfOptions & NodeTranslationOptions;

export default class GraphControlPanel extends Panel {

  protected constructor( children: Node[], providedOptions?: GraphControlPanelOptions ) {

    const options = optionize4<GraphControlPanelOptions, SelfOptions, PanelOptions>()(
      {}, VectorAdditionConstants.PANEL_OPTIONS, {
        isDisposable: false
      }, providedOptions );

    const content = new VBox( {
      children: children,
      spacing: VectorAdditionConstants.GRAPH_CONTROL_PANEL_Y_SPACING,
      align: 'left'
    } );

    // Make the panel a fixed width
    const panelWidth = VectorAdditionConstants.GRAPH_CONTROL_PANEL_CONTENT_WIDTH + ( 2 * options.xMargin );
    options.minWidth = panelWidth;
    options.maxWidth = panelWidth;

    super( content, options );
  }
}

vectorAddition.register( 'GraphControlPanel', GraphControlPanel );