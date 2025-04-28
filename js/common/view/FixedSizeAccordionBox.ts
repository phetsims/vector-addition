// Copyright 2019-2025, University of Colorado Boulder

/**
 * FixedSizeAccordionBox is the base class for a specialized version of AccordionBox that doesn't change size
 * when expanded versus collapsed.
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
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {

  // If provided, the content will scale to fix these dimensions. Otherwise, the fixed size is calculated by
  // the largest of the titleNode and contentNodes, including margin.
  contentFixedWidth?: number | null;
  contentFixedHeight?: number | null;
};

export type FixedSizeAccordionBoxOptions = SelfOptions & NodeTranslationOptions &
  PickOptional<AccordionBoxOptions, 'expandedProperty' | 'contentXSpacing' | 'contentAlign'> &
  PickRequired<AccordionBoxOptions, 'tandem'>;

export default class FixedSizeAccordionBox extends AccordionBox {

  protected constructor( titleNode: Node, contentNode: Node, providedOptions: FixedSizeAccordionBoxOptions ) {

    const options = optionize4<FixedSizeAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, VectorAdditionConstants.ACCORDION_BOX_OPTIONS, {

        // SelfOptions
        contentFixedWidth: null,
        contentFixedHeight: null,

        // AccordionBoxOptions
        isDisposable: false,
        titleAlignX: 'left',
        contentYMargin: 0,
        titleYMargin: 0,
        buttonYMargin: 0,
        contentAlign: 'left',
        showTitleWhenExpanded: false,
        titleBarExpandCollapse: true
      }, providedOptions );

    // Determine the maximum dimensions.
    const maxWidth = options.contentFixedWidth || _.max( [ titleNode.width, contentNode.width ] )!;
    const maxHeight = options.contentFixedHeight || _.max( [ titleNode.height, contentNode.height ] )!;

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