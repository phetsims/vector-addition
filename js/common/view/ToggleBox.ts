// Copyright 2019-2024, University of Colorado Boulder

/**
 * ToggleBox is a specialized version of AccordionBox that doesn't expand/collapse.  Instead, it toggles between
 * 'closed' content and 'open' content, while maintaining a fixed height.
 *
 * The box itself is a fixed width and height; both its fixed width and height are calculated by the largest
 * between the closed and open content added to its margins.
 *
 * However, there is an option to pass a defined fixed width and/or fixed height. The box will scale the nodes to fit
 * defined dimensions.
 *
 * Instances of this class are not meant to be disposed.
 *
 * @author Brandon Li
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import Node, { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

type SelfOptions = {

  // If provided, the content will scale to fix this width. Otherwise, the fixed size is calculated by the largest
  // of the content nodes and its respective margin.
  contentFixedWidth?: number | null;

  // If provided, the content will scale to fix this height. Otherwise, the fixed size is calculated by the largest
  // of the content nodes and its respective margin.
  contentFixedHeight?: number | null;
};

export type ToggleBoxOptions = SelfOptions & NodeTranslationOptions &
  PickOptional<AccordionBoxOptions, 'expandedProperty' | 'contentXSpacing' | 'isDisposable'>;

export default class ToggleBox extends AccordionBox {

  /**
   * @param closedContent - content when the box is closed
   * @param openContent - content when the box is open
   * @param [providedOptions]
   */
  protected constructor( closedContent: Node, openContent: Node, providedOptions?: ToggleBoxOptions ) {

    const options = optionize4<ToggleBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, VectorAdditionConstants.ACCORDION_BOX_OPTIONS, {

        // SelfOptions
        contentFixedWidth: null,
        contentFixedHeight: null,

        // AccordionBoxOptions
        contentYMargin: 0,
        titleYMargin: 0,
        buttonYMargin: 0,
        contentAlign: 'left',
        showTitleWhenExpanded: false,
        titleBarExpandCollapse: false
      }, providedOptions );

    // Determine the content width
    const contentWidth = options.contentFixedWidth || _.max( [ closedContent.width, openContent.width ] )!;
    const contentHeight = options.contentFixedHeight || _.max( [ closedContent.height, openContent.height ] )!;

    // Constrain the content width and height
    openContent.maxWidth = contentWidth;
    openContent.maxHeight = contentHeight;
    closedContent.maxWidth = contentWidth;
    closedContent.maxHeight = contentHeight;

    // Put the content in AlignBoxes, to handle alignment
    const alignBoxOptions = {
      xAlign: options.contentAlign,
      alignBounds: new Bounds2( 0, 0, contentWidth, contentHeight )
    };
    const openContentAlignBox = new AlignBox( openContent, alignBoxOptions );
    options.titleNode = new AlignBox( closedContent, alignBoxOptions ); // unorthodox use of AccordionBox, but it works

    super( openContentAlignBox, options );
  }
}

vectorAddition.register( 'ToggleBox', ToggleBox );