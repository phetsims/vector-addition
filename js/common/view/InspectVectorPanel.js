// Copyright 2019, University of Colorado Boulder

/**
 * View for the 'Inspect a Vector' Panel at the top of the scene. Displays vector attributes (i.e. magnitude etc.)
 * of the graphs active vector.
 *
 * 'Is a' relationship with ExpandCollapsePanel
 *    - when closed, displays 'Inspect a Vector'
 *    - when open either displays 'select a vector' or the active vector's attributes
 *      (a series of labels and InspectVectorNumberDisplays)
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
  const InspectVectorNumberDisplay = require( 'VECTOR_ADDITION/common/view/InspectVectorNumberDisplay' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );

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

  // width for all labels (except the magnitude label)
  const LABEL_WIDTH = 16;

  // width of the magnitude label
  const MAGNITUDE_LABEL_WIDTH = 20;

  // screen view horizontal margin
  const SCREEN_VIEW_Y_MARGIN = VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN;

  // inspect vector panel left location
  const INSPECT_PANEL_LEFT = 195;

  // possible types of attributes to display
  const ATTRIBUTE_DISPLAY_TYPES = InspectVectorNumberDisplay.ATTRIBUTE_DISPLAY_TYPES;


  class InspectVectorPanel extends ExpandCollapsePanel {

    /**
     * @param {Graph} graph - the graph that contains the vectors to display
     * @param {Object} [options]
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
        contentFixedHeight: INSPECT_PANEL_HEIGHT, // {number|null} fixed size of the panel (see superclass)
        isExpandedInitially: true

      }, options );

      //----------------------------------------------------------------------------------------
      // Create the scenery node for when the panel is closed, which is the inspectVectorText
      const inspectVectorText = new Text( inspectAVectorString, { font: PANEL_FONT } );

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes for when the panel is open

      // Text for when there isn't a vector that is active
      const selectVectorText = new Text( selectAVectorString, { font: PANEL_FONT } );

      // Container for the labels and number displays that display the vector's attributes
      const vectorAttributesContainer = new HBox( { spacing: LABEL_LEFT_MARGIN } );

      // Create the content container for the open content
      const panelOpenContent = new Node();

      //----------------------------------------------------------------------------------------
      // Create the inspect a vector panel
      //----------------------------------------------------------------------------------------

      super( inspectVectorText, panelOpenContent, {
        contentFixedWidth: options.contentFixedWidth,
        contentFixedHeight: options.contentFixedHeight,
        isExpandedInitially: options.isExpandedInitially
      } );

      this.top = options.top;
      this.left = options.left;

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes to display the vector. Each attribute has a label and a InspectVectorNumberDisplay
      //----------------------------------------------------------------------------------------

      const magnitudeTextNode = new FormulaNode( '' );
      const magnitudeNumberDisplay = new InspectVectorNumberDisplay( graph, ATTRIBUTE_DISPLAY_TYPES.MAGNITUDE );

      const angleText = new Text( MathSymbols.THETA, { font: PANEL_FONT } );
      const angleNumberDisplay = new InspectVectorNumberDisplay( graph, ATTRIBUTE_DISPLAY_TYPES.ANGLE );

      const xComponentText = new RichText( '' ).setFont( new MathSymbolFont( { size: 17, weight: 500 } ) );
      const xComponentNumberDisplay = new InspectVectorNumberDisplay( graph, ATTRIBUTE_DISPLAY_TYPES.X_COMPONENT );

      const yComponentText = new RichText( '' ).setFont( new MathSymbolFont( { size: 17, weight: 500 } ) );
      const yComponentNumberDisplay = new InspectVectorNumberDisplay( graph, ATTRIBUTE_DISPLAY_TYPES.Y_COMPONENT );

      //----------------------------------------------------------------------------------------
      // Add the new scenery nodes
      //----------------------------------------------------------------------------------------

      // Function that adds a label and display container combo, putting the label in a fixed sized AlignBox
      const addNumberDisplayAndLabel = ( label, numberDisplay, labelWidth = LABEL_WIDTH ) => {

        label.maxWidth = labelWidth;
        // Align the label in a AlignBox to set a fixed width
        const fixedWidthLabel = new AlignBox( label, {
          xAlign: 'center',
          yAlign: 'center',
          alignBounds: new Bounds2( 0, 0, labelWidth, INSPECT_PANEL_HEIGHT ),
          maxWidth: labelWidth
        } );

        vectorAttributesContainer.addChild( new HBox( {
          spacing: LABEL_RIGHT_MARGIN,
          children: [ fixedWidthLabel, numberDisplay ]
        } ) );
      };

      addNumberDisplayAndLabel( magnitudeTextNode, magnitudeNumberDisplay, MAGNITUDE_LABEL_WIDTH );
      addNumberDisplayAndLabel( angleText, angleNumberDisplay );
      addNumberDisplayAndLabel( xComponentText, xComponentNumberDisplay );
      addNumberDisplayAndLabel( yComponentText, yComponentNumberDisplay );

      //----------------------------------------------------------------------------------------

      // Observe changes to when the graphs active vector Property changes to update the panel.
      // Doesn't need to be unlinked since the panel exists for the entire simulation.
      graph.activeVectorProperty.link( activeVector => {

        panelOpenContent.setChildren( [ activeVector === null ? selectVectorText : vectorAttributesContainer ] );

        if ( activeVector !== null ) {
          // Get the vector symbol
          const vectorSymbol = activeVector.symbol ? activeVector.symbol : activeVector.fallBackSymbol;

          // Update labels (angle label is the same)
          magnitudeTextNode.setFormula( `\|\\vec{${vectorSymbol}\}|` );
          xComponentText.setText( `${vectorSymbol}<sub>${symbolXString}</sub>` );
          yComponentText.setText( `${vectorSymbol}<sub>${symbolYString}</sub>` );
        }
      } );
    }
  }

  return vectorAddition.register( 'InspectVectorPanel', InspectVectorPanel );
} );