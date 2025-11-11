// Copyright 2019-2025, University of Colorado Boulder

/**
 * FixedSizeAccordionBox is the base class for a specialized version of AccordionBox whose size is the same
 * when expanded and collapsed.
 *
 * @author Brandon Li
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import Node, { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

type SelfOptions = {
  // Fixed dimensions of the content. If the actual content is larger, it will be scaled to fit.
  contentFixedSize: Dimension2;
};

export type FixedSizeAccordionBoxOptions = SelfOptions & NodeTranslationOptions &
  PickOptional<AccordionBoxOptions, 'expandedProperty' | 'contentXSpacing' | 'contentAlign' | 'titleXSpacing' | 'accessibleHelpTextCollapsed'> &
  PickRequired<AccordionBoxOptions, 'tandem'>;

export default class FixedSizeAccordionBox extends AccordionBox {

  protected constructor( titleNode: Node, contentNode: Node, providedOptions: FixedSizeAccordionBoxOptions ) {

    const options = optionize4<FixedSizeAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, VectorAdditionConstants.ACCORDION_BOX_OPTIONS, {

        // AccordionBoxOptions
        isDisposable: false,
        titleAlignX: 'left',
        contentXMargin: 0,
        contentYMargin: 0,
        titleYMargin: 0,
        buttonYMargin: 0,
        contentAlign: 'left',
        showTitleWhenExpanded: false,
        titleBarExpandCollapse: true
      }, providedOptions );

    // Determine the maximum dimensions.
    const maxWidth = options.contentFixedSize.width;
    const maxHeight = options.contentFixedSize.height;

    options.titleNode = new AlignBox( titleNode, {
      xAlign: 'left',
      alignBounds: new Bounds2( 0, 0, maxWidth, maxHeight ),
      maxWidth: maxWidth,
      maxHeight: maxHeight
    } );

    const expandedContentAlignBox = new AlignBox( contentNode, {
      xAlign: options.contentAlign,
      alignBounds: new Bounds2( 0, 0, maxWidth, maxHeight ),
      maxWidth: maxWidth,
      maxHeight: maxHeight
    } );

    super( expandedContentAlignBox, options );
  }
}

vectorAddition.register( 'FixedSizeAccordionBox', FixedSizeAccordionBox );