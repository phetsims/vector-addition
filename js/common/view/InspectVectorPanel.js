// Copyright 2019, University of Colorado Boulder

/**
 * View for the 'Inspect a Vector' Panel at the top of the scene. Displays vector attributes (i.e. magnitude etc.)
 * of the graphs active vector.
 *
 * 'Is a' relationship with ExpandCollapsePanel
 *    - when closed, displays 'Inspect a Vector'
 *    - when open either displays 'select a vector' or the active vector's attributes
 *      (a series of labels and number displays)
 *
 * A visual:
 *  https://user-images.githubusercontent.com/42391580/60760546-3619ae00-9ff4-11e9-8e91-508fc27f5e7c.png
 *
 * This panel exists for the entire sim and is never disposed.
 *
 * @author Martin Veillette
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ExpandCollapsePanel = require( 'VECTOR_ADDITION/common/view/ExpandCollapsePanel' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Range = require( 'DOT/Range' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  //----------------------------------------------------------------------------------------
  // strings
  const inspectAVectorString = require( 'string!VECTOR_ADDITION/inspectAVector' );
  const selectAVectorString = require( 'string!VECTOR_ADDITION/selectAVector' );
  const symbolXString = require( 'string!VECTOR_ADDITION/symbol.x' );
  const symbolYString = require( 'string!VECTOR_ADDITION/symbol.y' );

  //----------------------------------------------------------------------------------------
  // constants

  // fixed width and height of the panel
  const INSPECT_PANEL_WIDTH = 410;
  const INSPECT_PANEL_HEIGHT = VectorAdditionConstants.EXPAND_COLLAPSE_PANEL_HEIGHT;

  // font for the panel
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;

  // margin from the label to the number label (ltr)
  const LABEL_RIGHT_MARGIN = 7;

  // margin from the number display to the label (ltr)
  const LABEL_LEFT_MARGIN = 17;

  // width for all labels except the magnitude label
  const LABEL_WIDTH = 14;

  // width of the magnitude label
  const MAGNITUDE_LABEL_WIDTH = 17;

  // rounding in decimal places of the number displays
  const NUMBER_DISPLAY_ROUNDING = VectorAdditionConstants.NUMBER_DISPLAY_ROUNDING;

  // screen view horizontal margin
  const SCREEN_VIEW_Y_MARGIN = VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN;

  // inspect vector panel left location
  const INSPECT_PANEL_LEFT = 195;


  class InspectVectorPanel extends ExpandCollapsePanel {
    /**
     * @constructor
     *
     * @param {Graph} graph - the graph that contains the vectors to display
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. Some options are
     *                             specific to this class while some are passed to the superclass. See the code where
     *                             the options are set in the early portion of the constructor for details.
     */
    constructor( graph, options ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {

        // specific to this class
        top: SCREEN_VIEW_Y_MARGIN,
        left: INSPECT_PANEL_LEFT,

        // super class options
        contentFixedWidth: INSPECT_PANEL_WIDTH, // {number|null} fixed size of the panel (see superclass)
        contentFixedHeight: INSPECT_PANEL_HEIGHT // {number|null} fixed size of the panel (see superclass)

      }, options );


      //----------------------------------------------------------------------------------------
      // Create the scenery node for when the panel is closed
      //----------------------------------------------------------------------------------------
      const inspectVectorText = new Text( inspectAVectorString, {
        font: PANEL_FONT
      } );

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes for when the panel is open
      //----------------------------------------------------------------------------------------

      // Text for when there isn't a vector that is active
      const selectVectorText = new Text( selectAVectorString, {
        font: PANEL_FONT
      } );

      // Container for the labels and number displays that display the vector's attributes
      const vectorAttributesContainer = new HBox( {
        spacing: LABEL_LEFT_MARGIN // major spacing
      } );

      // Create the content container for the open content
      const panelOpenContent = new Node();

      //----------------------------------------------------------------------------------------
      // Create the inspect a vector panel
      //----------------------------------------------------------------------------------------

      super( inspectVectorText, panelOpenContent, {
        contentFixedWidth: options.contentFixedWidth,
        contentFixedHeight: options.contentFixedHeight
      } );

      //----------------------------------------------------------------------------------------
      // Layout the inspect vector panel
      //----------------------------------------------------------------------------------------

      this.top = options.top;
      this.left = options.left;
 
      //----------------------------------------------------------------------------------------
      // Create the scenery nodes to display the vector (go inside of vectorAttributesContainer)
      // Each attribute has a label and a number display container (parent of the soon to be declared number display)
      //----------------------------------------------------------------------------------------
     
      const magnitudeTextNode = new FormulaNode( '', { maxWidth: MAGNITUDE_LABEL_WIDTH, centerY: this.centerY } );
      const magnitudeNumberDisplayContainer = new Node();
      let magnitudeNumberDisplay;

      //----------------------------------------------------------------------------------------
      const angleText = new Text( MathSymbols.THETA, { maxWidth: LABEL_WIDTH, font: PANEL_FONT, centerY: this.centerY } );
      const angleNumberDisplayContainer = new Node();
      let angleNumberDisplay;

      //----------------------------------------------------------------------------------------
      const xComponentText = new RichText( '', { maxWidth: LABEL_WIDTH , centerY: this.centerY} );
      const xComponentNumberDisplayContainer = new Node();
      let xNumberDisplay;

      //----------------------------------------------------------------------------------------
      const yComponentText = new RichText( '', { maxWidth: LABEL_WIDTH , centerY: this.centerY} );
      const yComponentNumberDisplayContainer = new Node();
      let yNumberDisplay;

      //----------------------------------------------------------------------------------------
      // Add the new scenery nodes
      //----------------------------------------------------------------------------------------

      // Function that adds a label and display container combo, putting the label in a fixed size
      const addNumberDisplayAndLabel = ( label, numberDisplayContainer, fixedLabelWidth ) => {
        // Make the label have a 'fixed' width
        const fixedWidthLabel = new AlignBox( label, {
          xAlign: 'center',
          yAlign: 'center',
          alignBounds: new Bounds2( 0, 0, fixedLabelWidth, INSPECT_PANEL_HEIGHT ),
          maxWidth: fixedLabelWidth,
          centerY: this.centerY
        } );
        vectorAttributesContainer.addChild( new HBox( {
          spacing: LABEL_RIGHT_MARGIN,
          children: [ fixedWidthLabel, numberDisplayContainer ],
          centerY: this.centerY
        } ) );
      };

      addNumberDisplayAndLabel( magnitudeTextNode, magnitudeNumberDisplayContainer, MAGNITUDE_LABEL_WIDTH );
      addNumberDisplayAndLabel( angleText, angleNumberDisplayContainer, LABEL_WIDTH );
      addNumberDisplayAndLabel( xComponentText, xComponentNumberDisplayContainer, LABEL_WIDTH );
      addNumberDisplayAndLabel( yComponentText, yComponentNumberDisplayContainer, LABEL_WIDTH );

      //----------------------------------------------------------------------------------------
      // Function to update a number display container
      //----------------------------------------------------------------------------------------
      const updateNumberDisplay = ( oldNumberDisplay, displayContainer, numberProperty, range ) => {
        if ( oldNumberDisplay ) {
          oldNumberDisplay.dispose();
        }

        oldNumberDisplay = new NumberDisplay( numberProperty, range, {
          decimalPlaces: NUMBER_DISPLAY_ROUNDING
        } );

        displayContainer.setChildren( [ oldNumberDisplay ] );
      };

      //----------------------------------------------------------------------------------------
      // Function that updates the labels and creates new number displays for an active vector
      //----------------------------------------------------------------------------------------
      const updateVectorDisplay = ( activeVector ) => {

        // Get the vector tag
        const vectorTag = activeVector.tag ? activeVector.tag : activeVector.fallBackTag;

        // Calculate the maximum magnitude, width (xComponent) and height (yComponent)
        const maxMagnitude = graph.graphModelBounds.rightTop.distance( graph.graphModelBounds.leftBottom ) + 1;
        const graphWidth = graph.graphModelBounds.width;
        const graphHeight = graph.graphModelBounds.height;

        //----------------------------------------------------------------------------------------
        // Update labels

        magnitudeTextNode.setFormula( `\|\\mathbf{\\vec{${vectorTag}\}\}|` );
        xComponentText.setText( `${vectorTag}<sub>${symbolXString}</sub>` );
        yComponentText.setText( `${vectorTag}<sub>${symbolYString}</sub>` );

        //----------------------------------------------------------------------------------------
        // Update number displays
        updateNumberDisplay( magnitudeNumberDisplay,
          magnitudeNumberDisplayContainer,
          activeVector.magnitudeProperty,
          new Range( 0, maxMagnitude ) );

        updateNumberDisplay( angleNumberDisplay,
          angleNumberDisplayContainer,
          activeVector.angleDegreesProperty,
          new Range( -180, 180 ) );

        updateNumberDisplay( xNumberDisplay,
          xComponentNumberDisplayContainer,
          activeVector.xComponentProperty,
          new Range( -graphWidth, graphWidth ) );

        updateNumberDisplay( yNumberDisplay,
          yComponentNumberDisplayContainer,
          activeVector.yComponentProperty,
          new Range( -graphHeight, graphHeight ) );
      };

      //----------------------------------------------------------------------------------------

      // Observe changes to the expanded property (when the expanded collapse button is clicked) or when the graphs
      // active vector property changes to determine visibility of nodes and update the panel.
      // Doesn't need to be disposed because the inspect vector panel always exists
      graph.activeVectorProperty.link( activeVector => {

        panelOpenContent.setChildren( [ activeVector === null ? selectVectorText : vectorAttributesContainer ] );

        if ( activeVector !== null ) {
          updateVectorDisplay( activeVector );
        }
      } );

    }
  }

  return vectorAddition.register( 'InspectVectorPanel', InspectVectorPanel );
} );