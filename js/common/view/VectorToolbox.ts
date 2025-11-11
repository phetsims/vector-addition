// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorToolbox is a Panel that contains 'slots' that can be clicked on to move vectors out of the toolbox.
 *
 * @author Martin Veillette
 * @author Brandon Li
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorToolboxSlot from './VectorToolboxSlot.js';

type HorizontalAlign = 'left' | 'center' | 'right';
type VerticalAlign = 'top' | 'center' | 'bottom';

type SelfOptions = {
  xAlign?: HorizontalAlign;  // horizontal alignment of the slots
  yAlign?: VerticalAlign; // vertical alignment of the slots
  ySpacing?: number; // the vertical spacing between slots
  contentWidth?: number; // fixed width of the panel content
  contentHeight?: number; // fixed height of the panel content
};

export type VectorToolboxOptions = SelfOptions & NodeTranslationOptions & PickRequired<PanelOptions, 'tandem'>;

export default class VectorToolbox extends Panel {

  public readonly slots: VectorToolboxSlot[];

  protected constructor( slots: VectorToolboxSlot[], providedOptions: VectorToolboxOptions ) {

    const options = optionize4<VectorToolboxOptions, SelfOptions, PanelOptions>()(
      {}, VectorAdditionConstants.PANEL_OPTIONS, {

        // SelfOptions
        xAlign: 'center',
        yAlign: 'center',
        ySpacing: 30,
        contentWidth: 80,
        contentHeight: 145,

        // PanelOptions
        isDisposable: false,
        lineWidth: 0.8,
        xMargin: 2,
        yMargin: 10,
        fill: Color.WHITE,
        stroke: Color.BLACK,
        accessibleHeading: VectorAdditionStrings.a11y.accessibleHeadings.availableVectorsStringProperty,
        visiblePropertyOptions: {
          phetioFeatured: true
        }
      }, providedOptions );

    // Create the container for the slots in a vertical alignment
    const slotsContainer = new VBox( {
      spacing: options.ySpacing,
      children: slots
    } );

    // Align the slots in a AlignBox to ensure sizing/alignment is correct
    const fixedSizeSlotsContainer = new AlignBox( slotsContainer, {
      alignBounds: new Bounds2( 0, 0, options.contentWidth, options.contentHeight ),
      xAlign: options.xAlign,
      yAlign: options.yAlign,
      maxWidth: options.contentWidth,
      maxHeight: options.contentHeight
    } );

    super( fixedSizeSlotsContainer, options );

    this.slots = slots;
  }
}

vectorAddition.register( 'VectorToolbox', VectorToolbox );