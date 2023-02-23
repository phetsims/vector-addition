// Copyright 2019-2023, University of Colorado Boulder

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

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import { AlignBox, Node } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

export default class ToggleBox extends AccordionBox {

  /**
   * @param {Node} closedContent - content when the box is closed
   * @param {Node} openContent - content when the box is open
   * @param {Object} [options]
   */
  constructor( closedContent, openContent, options ) {

    options = merge( {}, VectorAdditionConstants.ACCORDION_BOX_OPTIONS, {

      isExpandedInitially: true, // {boolean} - false means the box will start off as closed


      contentYMargin: 0,
      titleYMargin: 0,
      buttonYMargin: 0,

      // content align
      contentAlign: 'left',    // {string} - 'left', 'center', or 'right'
      contentFixedWidth: null, // {number|null} if provided, the content will scale to fix this width. Otherwise,
                               // the fixed size is calculated by the largest of the content nodes and its respective
                               // margin

      contentFixedHeight: null  // {number|null} if provided, the content will scale to fix this height. Otherwise,
                                // the fixed size is calculated by the largest of the content nodes and its respective
                                // margin

      // See VectorAdditionConstants.ACCORDION_BOX_OPTIONS for the rest of the defaults
    }, options );

    assert && assert( closedContent instanceof Node, `invalid closedContent: ${closedContent}` );
    assert && assert( openContent instanceof Node, `invalid openContent: ${openContent}` );

    // Determine the content width
    const contentWidth = options.contentFixedWidth || _.max( [ closedContent.width, openContent.width ] );
    const contentHeight = options.contentFixedHeight || _.max( [ closedContent.height, openContent.height ] );

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
    const closedContentAlignBox = new AlignBox( closedContent, alignBoxOptions );

    super( openContentAlignBox, merge( {
      expandedProperty: new BooleanProperty( options.isExpandedInitially ),
      showTitleWhenExpanded: false,
      titleNode: closedContentAlignBox, // unorthodox use of AccordionBox, but it works
      titleBarExpandCollapse: false
    }, options ) );
  }
}

vectorAddition.register( 'ToggleBox', ToggleBox );