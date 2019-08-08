// Copyright 2019, University of Colorado Boulder

/**
 * View for the 'ExpandCollapsePanel'. Used in a variety of places throughout the project.
 *
 * A visual:
 * https://user-images.githubusercontent.com/42391580/60743952-f342d200-9f30-11e9-9a04-7b72ada15244.png
 *
 * A specialized version of an 'AccordionBox' that doesn't change height when expanded/closed. The expand collapse
 * button solely toggles between 'closed' content and 'open' content.
 *
 * The panel itself is a fixed width and height; both its fixed width and height are calculated by the largest
 * between the closed and open content added to its margins.
 *
 * However, there is an option to pass a defined fixed width and/or fixed height. The panel will scale the nodes to fit
 * defined dimensions.
 *
 * These Panels are not meant to be disposed.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );


  class ExpandCollapsePanel extends AccordionBox {

    /**
     * @param {Node} closedContent - content when the panel is closed
     * @param {Node} openContent - content when the panel is open
     * @param {Object} [options]
     */
    constructor( closedContent, openContent, options ) {

      options = _.extend( {

        isExpandedInitially: true, // {boolean} - false means the panel will start off as closed
        contentXSpacing: 10,
        titleXSpacing: 10,

        // content align
        contentAlign: 'left',    // {string} - 'left', 'center', or 'right'
        contentYMargin: 8,
        titleYMargin: 8,
        contentFixedWidth: null, // {number|null} if provided, the content will scale to fix this width. Otherwise,
                                 // the fixed size is calculated by the largest of the content nodes and its respective
                                 // margin

        contentFixedHeight: null  // {number|null} if provided, the content will scale to fix this height. Otherwise,
                                  // the fixed size is calculated by the largest of the content nodes and its respective
                                  // margin

        // See VectorAdditionConstants.ACCORDION_BOX_OPTIONS for the rest of the defaults
      }, VectorAdditionConstants.ACCORDION_BOX_OPTIONS, options );


      assert && assert( typeof options.isExpandedInitially === 'boolean',
        `invalid options.isExpandedInitially: ${options.isExpandedInitially}` );
      assert && assert( closedContent instanceof Node, `invalid closedContent: ${closedContent}` );
      assert && assert( openContent instanceof Node, `invalid openContent: ${openContent}` );


      //----------------------------------------------------------------------------------------
      // Create the content container
      //----------------------------------------------------------------------------------------

      // Convenience References
      const contentWidth = options.contentFixedWidth ? options.contentFixedWidth :
                           _.max( [ closedContent.width, openContent.width ] );

      const contentHeight = options.contentFixedHeight ? options.contentFixedHeight :
                            _.max( [ closedContent.height, openContent.height ] );


      // Align the closed and open content in a align box, adding a strict bounds
      const openContentAlignBox = new AlignBox( openContent, {
        xAlign: options.contentAlign,
        alignBounds: new Bounds2( 0, 0, contentWidth, contentHeight ),
        maxWidth: contentWidth,
        maxHeight: contentHeight,
        xMargin: options.titleXSpacing
      } );

      const closedContentAlignBox = new AlignBox( closedContent, {
        xAlign: options.contentAlign,
        alignBounds: new Bounds2( 0, 0, contentWidth, contentHeight ),
        maxWidth: contentWidth,
        maxHeight: contentHeight
      } );


      closedContent.maxWidth = contentWidth;
      openContent.maxWidth = contentWidth;

      closedContent.maxHeight = contentHeight;
      openContent.maxHeight = contentHeight;

      super( openContentAlignBox, _.extend( {
        expandedProperty: new BooleanProperty( options.isExpandedInitially ),
        showTitleWhenExpanded: false,
        titleNode: closedContentAlignBox,
        titleBarExpandCollapse: false
      }, options ) );
    }
  }

  return vectorAddition.register( 'ExpandCollapsePanel', ExpandCollapsePanel );
} );