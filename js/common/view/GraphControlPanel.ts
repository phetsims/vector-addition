// Copyright 2019-2025, University of Colorado Boulder

/**
 * GraphControlPanel is the base class for graph control panels. These panels contain controls that affect what is
 * shown on the graph.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Node, { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

type SelfOptions = EmptySelfOptions;

export type GraphControlPanelOptions = SelfOptions & NodeTranslationOptions & PickRequired<PanelOptions, 'tandem'>;

export default class GraphControlPanel extends Panel {

  protected constructor( content: Node, providedOptions: GraphControlPanelOptions ) {

    const options = optionize4<GraphControlPanelOptions, SelfOptions, PanelOptions>()(
      {}, VectorAdditionConstants.PANEL_OPTIONS, {

        // PanelOptions
        isDisposable: false,
        visiblePropertyOptions: {
          phetioFeatured: true
        }
      }, providedOptions );

    // Make the panel a fixed width
    const panelWidth = VectorAdditionConstants.GRAPH_CONTROL_PANEL_CONTENT_WIDTH + ( 2 * options.xMargin );
    options.minWidth = panelWidth;
    options.maxWidth = panelWidth;

    super( content, options );
  }
}

vectorAddition.register( 'GraphControlPanel', GraphControlPanel );