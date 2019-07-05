// Copyright 2019, University of Colorado Boulder

/**
 * View for a 'ExpandCollapsePanel'.
 *
 * The ExpandCollapsePanel is similar to a accordion box in the way it has a expand-collapse button
 * to toggle content of the Panel.
 *
 * However, it doesn't change height as it toggles visibility of two nodes depending on if it is
 * open or closed.
 *
 * A visual:
 * https://user-images.githubusercontent.com/42391580/60743952-f342d200-9f30-11e9-9a04-7b72ada15244.png
 *
 * The panel itself is a fixed width and height.
 *  - The fixed width is calculated from the longest between the closed and the open content
 *    - Option to pass a defined fixed width
 *  - The fixed height is calculated from the tallest between the closed and the open content
 *    - Option to pass a defined fixed height
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
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );

  class ExpandCollapsePanel extends Panel {
    /**
     * @param {Node} closedContent - content when the panel is closed
     * @param {Node} openContent - content when the panel is open
     * @param {Object} options
     *
     * @constructor
     */
    constructor( closedContent, openContent, options ) {

      options = _.extend( {

        isExpandedInitially: true, // {boolean} - false means the panel will start off as closed

        // panel appearance
        fill: VectorAdditionColors.LIGHT_GREY, // {string} fill of the panel
        stroke: VectorAdditionColors.PANEL_STROKE_COLOR, // {string} border color
        cornerRadius: 5, // {number} corner radius of the panel

        // button margin
        buttonXMargin: 5, // {number} horizontal margin of the button
        buttonYMargin: 2, // {number} vertical margin of the button
        
        // panel margin
        panelXMargin: 5, // {number} horizontal margin of the panel
        panelYMargin: 5, // {number} vertical margin of the panel

        // content margin
        contentXMargin: 2, // {number} horizontal margin of the content
        contentYMargin: 3, // {number} vertical margin of the content

        // content align
        contentXAlign: 'left', // {string} - 'left', 'center', or 'right'
        contentYAlign: 'center', // {string} - 'top', 'center', or 'bottom'

        // content dimension.
        contentFixedWidth: 900, // {number|null} null means fixed width will be calculated by the max of the closed
        // and the open content. If provided as a number, the content width will be fixed to this number
        contentFixedHeight: null, // {number|null} null means fixed height will be calculated by the max of the closed
        // and the open content. If provided as a number, the content width will be fixed to this number

        expandCollapseButtonSize: 20 // {number} size of the expand collapse button
      }, options );

      assert && assert( typeof options.isExpandedInitially === 'boolean', `invalid options.isExpandedInitially: ${options.isExpandedInitially}` );
      assert && assert( closedContent instanceof Node, `invalid closedContent: ${closedContent}` );
      assert && assert( openContent instanceof Node, `invalid openContent: ${openContent}` );

      /*---------------------------------------------------------------------------*
       * Create the Panel
       *---------------------------------------------------------------------------*/
      
      // Create a node as the reference of the content in the panel
      const panelContent = new Node();

      super( panelContent, {
        cornerRadius: options.cornerRadius,
        xMargin: options.panelXMargin,
        yMargin: options.panelYMargin,
        fill: options.fill,
        stroke: options.stroke
      } );

      /*---------------------------------------------------------------------------*
       * Create the expand collapse button
       *---------------------------------------------------------------------------*/
      
      // Create a property that indicates if the panel is open or not.
      const expandedProperty = new BooleanProperty( options.isExpandedInitially );

      // Observe when the panel is open and closed and update the visibility of the content.
      const expandedObserver = ( isExpanded ) => {
        openContent.visible = isExpanded;
        closedContent.visible = !isExpanded;
      };
      expandedProperty.link( expandedObserver );

      // Button to open and close the panel
      const expandCollapseButton = new ExpandCollapseButton( expandedProperty, {
        centerY: this.centerY,
        sideLength: options.expandCollapseButtonSize
      } );

      /*---------------------------------------------------------------------------*
       * Create the content container
       *---------------------------------------------------------------------------*/

      // Convenience References
      const contentWidth = options.contentFixedWidth ? options.contentFixedWidth :
                            _.max( [ closedContent.width, openContent.width ] ) +  2 * options.contentXMargin;

      const contentHeight = options.contentFixedHeight ? options.contentFixedHeight :
                              _.max( [ closedContent.height, openContent.height ] ) +  2 * options.contentYMargin;

      // Create the container for the closed and open content
      const contentContainer = new AlignBox( new Node( { children: [ closedContent, openContent ] } ), {
        xAlign: options.contentXAlign,
        yAlign: options.contentYAlign,
        xMargin: options.contentXMargin,
        yMargin: options.contentYMargin,
        alignBounds: new Bounds2( 0, 0, contentWidth, contentHeight ),
        left: expandCollapseButton.right + options.buttonXMargin + options.contentXMargin,
        centerY: this.centerY
      } );

      panelContent.setChildren( [ expandCollapseButton, contentContainer ] );

      //----------------------------------------------------------------------------------------
      // Constrain size if optional fixed sizes were provided
      //----------------------------------------------------------------------------------------

      if ( options.contentFixedWidth ) {
        closedContent.maxWidth = options.contentFixedWidth;
        openContent.maxWidth = options.contentFixedWidth;
      }
      if ( options.contentFixedHeight) {
        closedContent.maxHeight = options.contentFixedHeight;
        openContent.maxHeight = options.contentFixedHeight;
      }

      /*---------------------------------------------------------------------------*
       * Disposes of the links
       *---------------------------------------------------------------------------*/
      // @private {function}
      this.disposePanel = () => {
        expandCollapseButton.unlink( expandedObserver );
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