// Copyright 2019, University of Colorado Boulder

/**
 * VectorValuesToggleBox is the toggle box at the top of the screen. It displays the active vector's magnitude,
 * angle, x component, and y component.
 *
 * 'Is a' relationship with ToggleBox
 *    - when closed, displays 'Vector Values'
 *    - when open either displays 'select a vector' or the active vector's attributes
 *      (a series of labels and VectorValuesNumberDisplays)
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
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ToggleBox = require( 'VECTOR_ADDITION/common/view/ToggleBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSymbolNode = require( 'VECTOR_ADDITION/common/view/VectorSymbolNode' );
  const VectorValuesNumberDisplay = require( 'VECTOR_ADDITION/common/view/VectorValuesNumberDisplay' );

  //----------------------------------------------------------------------------------------
  // strings
  const noVectorSelectedString = require( 'string!VECTOR_ADDITION/noVectorSelected' );
  const symbolXString = require( 'string!VECTOR_ADDITION/symbol.x' );
  const symbolYString = require( 'string!VECTOR_ADDITION/symbol.y' );
  const vectorValuesString = require( 'string!VECTOR_ADDITION/vectorValues' );

  //----------------------------------------------------------------------------------------
  // constants

  // margin from the label to the number label (ltr)
  const LABEL_RIGHT_MARGIN = 7;

  // margin from the number display to the label (ltr)
  const LABEL_LEFT_MARGIN = 17;

  // width of the magnitude label
  const MAGNITUDE_LABEL_WIDTH = 50;

  // width of the angle label
  const ANGLE_LABEL_WIDTH = 15;

  // width of the component labels
  const COMPONENT_LABEL_WIDTH = 35;

  // possible types of attributes to display
  const ATTRIBUTE_DISPLAY_TYPES = VectorValuesNumberDisplay.ATTRIBUTE_DISPLAY_TYPES;


  class VectorValuesToggleBox extends ToggleBox {

    /**
     * @param {Graph} graph - the graph that contains the vectors to display
     * @param {Object} [options]
     */
    constructor( graph, options ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

      options = _.extend( {

        // superclass options
        contentFixedWidth: 440, // {number|null} fixed size of the panel (see superclass)
        contentFixedHeight: 45, // {number|null} fixed size of the panel (see superclass)
        isExpandedInitially: true

      }, options );

      //----------------------------------------------------------------------------------------
      // Create the scenery node for when the panel is closed, which is the inspectVectorText
      const inspectVectorText = new Text( vectorValuesString, {
        font: VectorAdditionConstants.TITLE_FONT
      } );

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes for when the panel is open

      // Text for when there isn't a vector that is active
      const selectVectorText = new Text( noVectorSelectedString, {
        font: VectorAdditionConstants.TITLE_FONT
      } );

      // Container for the labels and number displays that display the vector's attributes
      const vectorAttributesContainer = new HBox( { spacing: LABEL_LEFT_MARGIN } );

      // Create the content container for the open content
      const panelOpenContent = new Node();
      panelOpenContent.setChildren( [ selectVectorText, vectorAttributesContainer ] );

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes to display the vector. Each attribute has a label and a VectorValuesNumberDisplay
      //----------------------------------------------------------------------------------------

      const magnitudeDisplayNode = new VectorSymbolNode( {
        includeAbsoluteValueBars: true
      } );
      const magnitudeNumberDisplay = new VectorValuesNumberDisplay( graph, ATTRIBUTE_DISPLAY_TYPES.MAGNITUDE );

      const angleText = new Text( MathSymbols.THETA, { font: VectorAdditionConstants.EQUATION_SYMBOL_FONT } );
      const angleNumberDisplay = new VectorValuesNumberDisplay( graph, ATTRIBUTE_DISPLAY_TYPES.ANGLE );

      const xComponentText = new VectorSymbolNode( { showVectorArrow: false } );
      const xComponentNumberDisplay = new VectorValuesNumberDisplay( graph, ATTRIBUTE_DISPLAY_TYPES.X_COMPONENT );

      const yComponentText = new VectorSymbolNode( { showVectorArrow: false } );
      const yComponentNumberDisplay = new VectorValuesNumberDisplay( graph, ATTRIBUTE_DISPLAY_TYPES.Y_COMPONENT );

      //----------------------------------------------------------------------------------------
      // Add the new scenery nodes
      //----------------------------------------------------------------------------------------

      // Function that adds a label and display container combo, putting the label in a fixed sized AlignBox
      const addNumberDisplayAndLabel = ( label, numberDisplay, labelWidth ) => {

        // Align the label in a AlignBox to set a fixed width
        const fixedWidthLabel = new AlignBox( label, {
          xAlign: 'right',
          yAlign: 'center',
          alignBounds: new Bounds2( 0, 0, labelWidth, options.contentFixedHeight ),
          maxWidth: labelWidth
        } );
        label.maxWidth = labelWidth;
        vectorAttributesContainer.addChild( new HBox( {
          spacing: LABEL_RIGHT_MARGIN,
          children: [ fixedWidthLabel, numberDisplay ]
        } ) );
      };

      addNumberDisplayAndLabel( magnitudeDisplayNode, magnitudeNumberDisplay, MAGNITUDE_LABEL_WIDTH );
      addNumberDisplayAndLabel( angleText, angleNumberDisplay, ANGLE_LABEL_WIDTH );
      addNumberDisplayAndLabel( xComponentText, xComponentNumberDisplay, COMPONENT_LABEL_WIDTH );
      addNumberDisplayAndLabel( yComponentText, yComponentNumberDisplay, COMPONENT_LABEL_WIDTH );

      //----------------------------------------------------------------------------------------

      const updateCoefficient = coefficient => {
        magnitudeDisplayNode.setCoefficient( coefficient );
        xComponentText.setCoefficient( coefficient );
        yComponentText.setCoefficient( coefficient );
      };
      
      // Observe changes to when the graphs active vector Property changes to update the panel.
      // Doesn't need to be unlinked since the panel exists for the entire simulation.
      graph.activeVectorProperty.link( ( activeVector, oldActiveVector ) => {

        if ( activeVector !== null ) {
          vectorAttributesContainer.visible = true;
          selectVectorText.visible = false;

          // Get the vector symbol
          const vectorSymbol = activeVector.symbol ? activeVector.symbol : activeVector.fallBackSymbol;

          // Update labels (angle label is the same)
          magnitudeDisplayNode.setSymbol( vectorSymbol );
          xComponentText.setSymbol( `${vectorSymbol}<sub>${symbolXString}</sub>` );
          yComponentText.setSymbol( `${vectorSymbol}<sub>${symbolYString}</sub>` );
        }
        else {
          vectorAttributesContainer.visible = false;
          selectVectorText.visible = true;
        }

        selectVectorText.centerY = panelOpenContent.centerY;
        vectorAttributesContainer.centerY = panelOpenContent.centerY;

        if ( activeVector && activeVector.coefficientProperty ) {
          activeVector.coefficientProperty.link( updateCoefficient );
        }
        if ( oldActiveVector && oldActiveVector.coefficientProperty ) {
          oldActiveVector.coefficientProperty.unlink( updateCoefficient );
          // reset
          updateCoefficient( ( activeVector && activeVector.coefficientProperty ) ? activeVector.coefficientProperty.value : 1 );
        }
      } );

      selectVectorText.centerY = panelOpenContent.centerY;
      vectorAttributesContainer.centerY = panelOpenContent.centerY;

      //----------------------------------------------------------------------------------------
      // Create the inspect a vector panel
      //----------------------------------------------------------------------------------------

      super( inspectVectorText, panelOpenContent, options );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      throw new Error( 'VectorValuesToggleBox is not intended to be disposed' );
    }
  }

  return vectorAddition.register( 'VectorValuesToggleBox', VectorValuesToggleBox );
} );