// Copyright 2019-2025, University of Colorado Boulder

/**
 * FixedSizeAccordionBox is the base class for a specialized version of AccordionBox that doesn't expand/collapse.
 * Instead, it toggles between 'expanded' content and 'collapsed' content, while maintaining a fixed size.
 *
 * The fixed width and height are calculated by the largest between the expanded and collapsed content added to its
 * margins. However, there is an option to pass a defined fixed width and/or fixed height. The box will scale the
 * nodes to fit defined dimensions.
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

export default class FixedSizeAccordionBox extends AccordionBox {

  /**
   * @param expandedContent - content when the accordion box is expanded
   * @param collapsedContent - content when the accordion box is collapsed
   * @param [providedOptions]
   */
  protected constructor( expandedContent: Node, collapsedContent: Node, providedOptions?: ToggleBoxOptions ) {

    const options = optionize4<ToggleBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, VectorAdditionConstants.ACCORDION_BOX_OPTIONS, {

        // SelfOptions
        contentFixedWidth: null,
        contentFixedHeight: null,

        // AccordionBoxOptions
        isDisposable: false,
        contentYMargin: 0,
        titleYMargin: 0,
        buttonYMargin: 0,
        contentAlign: 'left',
        showTitleWhenExpanded: false,
        titleBarExpandCollapse: false
      }, providedOptions );

    // Determine the content width
    const contentWidth = options.contentFixedWidth || _.max( [ collapsedContent.width, expandedContent.width ] )!;
    const contentHeight = options.contentFixedHeight || _.max( [ collapsedContent.height, expandedContent.height ] )!;

    // Constrain the content width and height
    expandedContent.maxWidth = contentWidth;
    expandedContent.maxHeight = contentHeight;
    collapsedContent.maxWidth = contentWidth;
    collapsedContent.maxHeight = contentHeight;

    // Put the content in AlignBoxes, to handle alignment
    const alignBoxOptions = {
      xAlign: options.contentAlign,
      alignBounds: new Bounds2( 0, 0, contentWidth, contentHeight )
    };
    const expandedContentAlignBox = new AlignBox( expandedContent, alignBoxOptions );
    options.titleNode = new AlignBox( collapsedContent, alignBoxOptions ); // unorthodox use of AccordionBox, but it works

    super( expandedContentAlignBox, options );
  }
}

vectorAddition.register( 'FixedSizeAccordionBox', FixedSizeAccordionBox );