// Copyright 2019, University of Colorado Boulder

/**
 * View for the 'Inspect a Vector' Panel at the top of the scene. Displays vector attributes (i.e. magnitude etc.)
 * of the graphs active vector.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Panel = require( 'SUN/Panel' );
  const Property = require( 'AXON/Property' );
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
  const INSPECT_PANEL_WIDTH = 450;
  const INSPECT_PANEL_HEIGHT = 50;
  const EXPAND_COLLAPSE_BUTTON_SIZE = 21;
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;
  const BUTTON_TEXT_MARGIN = 13; // margin between the expand collapse button and the content on the right
  const LABEL_RIGHT_MARGIN = 7; // margin from the label to the number label (ltr)
  const LABEL_LEFT_MARGIN = 17; // margin from the number display to the label (ltr)
  const LABEL_WIDTH = 14;
  const MAGNITUDE_LABEL_WIDTH = 17;
  const ANGLE_ROUNDING = VectorAdditionConstants.ANGLE_ROUNDING;

  class InspectVectorPanel extends Panel {
    /**
     * @constructor
     * @param {Graph} graph - the graph that contains the vectors to display.
     * @param {Object} [options]
     */
    constructor( graph, options ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {
        isExpandedInitially: false, // {boolean} - true means the panel will start off as expanded
        panelOptions: null // {object} defaults below, passed to super class
      }, options );

      options.panelOptions = _.extend( {}, VectorAdditionConstants.PANEL_OPTIONS, {
        cornerRadius: 5,
        xMargin: 7,
        yMargin: 2,
        minWidth: INSPECT_PANEL_WIDTH, // Panel is a fixed size
        maxWidth: INSPECT_PANEL_WIDTH,
        maxHeight: INSPECT_PANEL_HEIGHT
      }, options.panelOptions );

      //----------------------------------------------------------------------------------------

      // Create an arbitrary node as a reference to the content in the panel
      const panelContent = new Node();

      super( panelContent, options.panelOptions );

      // Create a property that indicates if the panel is open or not.
      const expandedProperty = new BooleanProperty( options.isExpandedInitially );

      //----------------------------------------------------------------------------------------

      // Button to open and close the panel
      const expandCollapseButton = new ExpandCollapseButton( expandedProperty, {
        sideLength: EXPAND_COLLAPSE_BUTTON_SIZE,
        centerY: this.centerY
      } );

      // Convenience variable of the panel right content width (width of the panel excluding the collapse button)
      const rightContentWidth = INSPECT_PANEL_WIDTH - expandCollapseButton.right - BUTTON_TEXT_MARGIN;

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes that go on the right side of the panel
      //----------------------------------------------------------------------------------------

      const inspectVectorText = new Text( inspectAVectorString, {
        font: PANEL_FONT,
        centerY: this.centerY,
        maxWidth: rightContentWidth
      } );

      // Text for when there isn't a vector that is active
      const selectVectorText = new Text( selectAVectorString, {
        font: PANEL_FONT,
        centerY: this.centerY,
        maxWidth: rightContentWidth
      } );

      // Container for the labels and number displays that display the vector's attributes
      const vectorAttributesContainer = new HBox( {
        spacing: LABEL_LEFT_MARGIN, // major spacing
        align: 'center',
        maxWidth: rightContentWidth
      } );

      // The node for the right content, which has 3 children and toggles visibility of the children based on the state
      const panelRightContent = new Node( {
        children: [ inspectVectorText, selectVectorText, vectorAttributesContainer ],
        centerY: this.centerY,
        maxWidth: rightContentWidth
      } );

      //----------------------------------------------------------------------------------------

      panelContent.setChildren( [
        expandCollapseButton,
        // Constrain the size of panel right content in a align box
        new AlignBox( panelRightContent, {
          xAlign: 'left',
          yAlign: 'center',
          alignBounds: new Bounds2( 0, 0, rightContentWidth, INSPECT_PANEL_HEIGHT - 2 * options.panelOptions.yMargin ),
          centerY: this.centerY,
          left: expandCollapseButton.right + BUTTON_TEXT_MARGIN,
          maxWidth: rightContentWidth
        } )
      ] );

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes to display the vector (go inside of vectorAttributesContainer)
      //----------------------------------------------------------------------------------------
      const magnitudeTextNode = new FormulaNode( '', { maxWidth: MAGNITUDE_LABEL_WIDTH } );

      // Create a arbitrary node for now that will contain the number display
      const magnitudeNumberDisplayContainer = new Node();

      //----------------------------------------------------------------------------------------
      const angleText = new Text( MathSymbols.THETA, { maxWidth: LABEL_WIDTH, font: PANEL_FONT } );

      // Create a arbitrary node for now that will contain the number display
      const angleNumberDisplayContainer = new Node();

      //----------------------------------------------------------------------------------------
      const xComponentText = new RichText( '', { maxWidth: LABEL_WIDTH } );

      // Create a arbitrary node for now that will contain the number display
      const xComponentNumberDisplayContainer = new Node();

      //----------------------------------------------------------------------------------------
      const yComponentText = new RichText( '', { maxWidth: LABEL_WIDTH } );

      // Create a arbitrary node for now that will contain the number display
      const yComponentNumberDisplayContainer = new Node();

      //----------------------------------------------------------------------------------------
      // Add the new scenery nodes
      //----------------------------------------------------------------------------------------

      // Function that adds a label and display container combo in a fixed size align box
      const addNumberDisplayAndLabel = ( label, numberDisplayContainer ) => {
        // Make the label have a 'fixed' width
        const fixedWidthLabel = new AlignBox( label, {
          xAlign: 'center',
          yAlign: 'center',
          alignBounds: new Bounds2( 0, 0, LABEL_WIDTH, this.height ),
          maxWidth: LABEL_WIDTH
        } );
        vectorAttributesContainer.addChild( new HBox( {
          spacing: LABEL_RIGHT_MARGIN,
          children: [ fixedWidthLabel, numberDisplayContainer ],
          centerY: this.centerY
        } ) );
      };
      addNumberDisplayAndLabel( magnitudeTextNode, magnitudeNumberDisplayContainer );
      addNumberDisplayAndLabel( angleText, angleNumberDisplayContainer );
      addNumberDisplayAndLabel( xComponentText, xComponentNumberDisplayContainer );
      addNumberDisplayAndLabel( yComponentText, yComponentNumberDisplayContainer );

      //----------------------------------------------------------------------------------------
      // Function that updates the labels and creates new number displays for an active vector
      const updateVectorDisplay = ( activeVector ) => {

        // Get the vector tag
        const vectorTag = activeVector.tag ? activeVector.tag : activeVector.fallBackTag;

        // Convenience variables
        const maxMagnitude = Math.pow( Math.pow( graph.graphModelBounds.width, 2 ) + Math.pow( graph.graphModelBounds.height, 2 ), 0.5 ) + 1;
        const graphWidth = graph.graphModelBounds.width;
        const graphHeight = graph.graphModelBounds.height;

        //----------------------------------------------------------------------------------------
        magnitudeTextNode.setFormula( `\|\\mathbf{\\vec{${vectorTag}\}\}|` );

        magnitudeNumberDisplayContainer.setChildren( [
          new NumberDisplay( activeVector.magnitudeProperty, new Range( 0, maxMagnitude ), {
            decimalPlaces: 1
          } ) ] );

        //----------------------------------------------------------------------------------------
        // Angle text stays the same
        angleNumberDisplayContainer.setChildren( [
          new NumberDisplay( activeVector.angleDegreesProperty, new Range( -180, 180 ), {
            decimalPlaces: ANGLE_ROUNDING
          } ) ] );

        //----------------------------------------------------------------------------------------
        xComponentText.setText( `${vectorTag}<sub>${symbolXString}</sub>` );

        xComponentNumberDisplayContainer.setChildren( [
          new NumberDisplay( activeVector.xComponentProperty, new Range( -graphWidth, graphWidth ), {
            decimalPlaces: 1
          } ) ] );

        //----------------------------------------------------------------------------------------
        yComponentText.setText( `${vectorTag}<sub>${symbolYString}</sub>` );

        yComponentNumberDisplayContainer.setChildren( [
          new NumberDisplay( activeVector.yComponentProperty, new Range( -graphHeight, graphHeight ), {
            decimalPlaces: 1
          } ) ] );
      };

      //----------------------------------------------------------------------------------------

      // Observe changes to the expanded property (when the expanded collapse button is clicked) or when the graphs
      // active vector property changes to determine visibility of nodes and update the panel.
      // Doesn't need to be disposed because the inspect vector panel always exists
      Property.multilink( [ expandedProperty, graph.activeVectorProperty ], ( isExpanded, activeVector ) => {
        inspectVectorText.visible = !isExpanded;
        selectVectorText.visible = isExpanded && activeVector === null;
        vectorAttributesContainer.visible = isExpanded && activeVector !== null;

        if ( activeVector !== null ) {
          updateVectorDisplay( activeVector );
        }

        inspectVectorText.centerY = this.centerY;
        selectVectorText.centerY = this.centerY;
        vectorAttributesContainer.centerY = this.centerY;
      } );
    }
  }

  return vectorAddition.register( 'InspectVectorPanel', InspectVectorPanel );
} );