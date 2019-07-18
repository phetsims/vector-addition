// Copyright 2019, University of Colorado Boulder

/**
 * View for the 'ExpandCollapsePanel'. Used in a variety of places throughout the project.
 *
 * The ExpandCollapsePanel is a panel that contains 3 things:
 *  - expand collapse button
 *  - closed content
 *  - open content
 *
 * Based on if the expand collapse button is open or closed, the content will be toggled.
 *
 * The closed and open content are placed to the right of the button.
 *
 * A visual:
 * https://user-images.githubusercontent.com/42391580/60743952-f342d200-9f30-11e9-9a04-7b72ada15244.png
 *
 * The panel itself is a fixed width and height; both its fixed width and height are calculated by the largest
 * between the closed and open content added to its margins.
 *
 * There is an option to pass a defined fixed width and/or fixed height. The panel will scale the nodes to fit the
 * the defined dimensions.
 *
 * References to the two children are preferred.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  class ExpandCollapsePanel extends Panel {

    /**
     * @param {Node} closedContent - content when the panel is closed
     * @param {Node} openContent - content when the panel is open
     * @param {Object} [options]
     */
    constructor( closedContent, openContent, options ) {

      options = _.extend( {

        isExpandedInitially: true, // {boolean} - false means the panel will start off as closed

        // content align
        contentXAlign: 'left', // {string} - 'left', 'center', or 'right'
        contentYAlign: 'center', // {string} - 'top', 'center', or 'bottom'


        contentFixedWidth: null, // {number|null} if provided, the content will scale to fix this width. Otherwise,
                                 // the fixed size is calculated by the largest of the content nodes and its respective
                                 // margin

        contentFixedHeight: null, // {number|null} if provided, the content will scale to fix this height. Otherwise,
                                  // the fixed size is calculated by the largest of the content nodes and its respective
                                  // margin

        // superclass options
        xMargin: 0, // {number} horizontal margin of the superclass panel
        yMargin: 0 // {number} vertical margin of the superclass panel

        // See VectorAdditionConstants.EXPAND_COLLAPSE_PANEL for the rest of the defaults
      }, VectorAdditionConstants.EXPAND_COLLAPSE_PANEL, options );


      assert && assert( typeof options.isExpandedInitially === 'boolean', `invalid options.isExpandedInitially: ${options.isExpandedInitially}` );
      assert && assert( closedContent instanceof Node, `invalid closedContent: ${closedContent}` );
      assert && assert( openContent instanceof Node, `invalid openContent: ${openContent}` );

      //----------------------------------------------------------------------------------------
      // Create the Panel
      //----------------------------------------------------------------------------------------

      // Create a node as the reference of the content inside the panel
      const panelContent = new Node();

      super( panelContent, {
        // Pass individual options to superclass, as passing all of options with custom keys is a code smell.
        cornerRadius: options.cornerRadius,
        xMargin: options.xMargin,
        yMargin: options.yMargin,
        fill: options.fill,
        stroke: options.stroke
      } );

      //----------------------------------------------------------------------------------------
      // Create the expand-collapse button
      //----------------------------------------------------------------------------------------

      // Create a Property that indicates if the panel is open or not.
      const expandedProperty = new BooleanProperty( options.isExpandedInitially );

      // Button to open and close the panel
      const expandCollapseButton = new ExpandCollapseButton( expandedProperty, options.expandCollapseButtonOptions );

      // Align the expand collapse button in a align box, giving margins and centering it
      const expandCollapseButtonContainer = new AlignBox( expandCollapseButton, {
        xAlign: 'center',
        yAlign: 'center',
        xMargin: options.buttonXMargin,
        yMargin: options.buttonYMargin,
        centerY: this.centerY
      } );

      //----------------------------------------------------------------------------------------
      // Create the content container
      //----------------------------------------------------------------------------------------

      // Convenience References
      const contentWidth = options.contentFixedWidth ? options.contentFixedWidth + 2 * options.contentXMargin :
                           _.max( [ closedContent.width, openContent.width ] ) + 2 * options.contentXMargin;

      const contentHeight = options.contentFixedHeight ? options.contentFixedHeight + 2 * options.contentYMargin :
                            _.max( [ closedContent.height, openContent.height ] ) + 2 * options.contentYMargin;

      // Create the container for the content on the right
      const contentContainer = new Node();

      // Align the closed and open content in a align box, adding a strict bounds
      const contentAlignBox = new AlignBox( contentContainer, {
        xAlign: options.contentXAlign,
        yAlign: options.contentYAlign,
        xMargin: options.contentXMargin,
        yMargin: options.contentYMargin,
        alignBounds: new Bounds2( 0, 0, contentWidth, contentHeight ),
        centerY: this.centerY, // since it is the full height, center it. The align box will align the content inside.
        left: expandCollapseButtonContainer.right + options.contentXMargin,
        maxWidth: contentWidth
      } );

      //----------------------------------------------------------------------------------------
      // Observe when the panel is open and closed and update the content
      //----------------------------------------------------------------------------------------

      const expandedListener = ( isExpanded ) => {
        contentContainer.setChildren( [ isExpanded ? openContent : closedContent ] );
      };
      expandedProperty.link( expandedListener );

      // Set the children of the panel
      panelContent.setChildren( [ expandCollapseButtonContainer, contentAlignBox ] );

      //----------------------------------------------------------------------------------------
      // Constrain size if optional fixed sizes were provided
      //----------------------------------------------------------------------------------------

      if ( options.contentFixedWidth ) {
        closedContent.maxWidth = options.contentFixedWidth;
        openContent.maxWidth = options.contentFixedWidth;
      }
      if ( options.contentFixedHeight ) {
        closedContent.maxHeight = options.contentFixedHeight;
        openContent.maxHeight = options.contentFixedHeight;
      }

      //----------------------------------------------------------------------------------------
      // Disposes of the links
      //----------------------------------------------------------------------------------------

      // @private {function}
      this.disposePanel = () => {
        expandCollapseButton.unlink( expandedListener );
        expandCollapseButton.dispose();
      };
    }

    /**
     * Disposes the panel
     * @public
     */
    dispose() {
      this.disposePanel();
    }
  }

  return vectorAddition.register( 'ExpandCollapsePanel', ExpandCollapsePanel );
} );