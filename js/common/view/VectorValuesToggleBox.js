// Copyright 2019-2023, University of Colorado Boulder

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

import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { AlignBox, HBox, Node, Text } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Graph from '../model/Graph.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ToggleBox from './ToggleBox.js';
import VectorQuantities from './VectorQuantities.js';
import VectorSymbolNode from './VectorSymbolNode.js';
import VectorValuesNumberDisplay from './VectorValuesNumberDisplay.js';

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

export default class VectorValuesToggleBox extends ToggleBox {

  /**
   * @param {Graph} graph - the graph that contains the vectors to display
   * @param {Object} [options]
   */
  constructor( graph, options ) {

    assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

    options = merge( {

      // superclass options
      contentFixedWidth: 500, // {number|null} fixed size of the panel (see superclass)
      contentFixedHeight: 45, // {number|null} fixed size of the panel (see superclass)
      isExpandedInitially: true

    }, options );

    //----------------------------------------------------------------------------------------
    // Create the scenery node for when the panel is closed, which is the inspectVectorText
    const inspectVectorText = new Text( VectorAdditionStrings.vectorValues, {
      font: VectorAdditionConstants.TITLE_FONT
    } );

    //----------------------------------------------------------------------------------------
    // Create the scenery nodes for when the panel is open

    // Text for when there isn't a vector that is active
    const selectVectorText = new Text( VectorAdditionStrings.noVectorSelected, {
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
    const magnitudeNumberDisplay = new VectorValuesNumberDisplay( graph, VectorQuantities.MAGNITUDE );

    const angleText = new Text( MathSymbols.THETA, { font: VectorAdditionConstants.EQUATION_SYMBOL_FONT } );
    const angleNumberDisplay = new VectorValuesNumberDisplay( graph, VectorQuantities.ANGLE );

    const xComponentText = new VectorSymbolNode( { showVectorArrow: false } );
    const xComponentNumberDisplay = new VectorValuesNumberDisplay( graph, VectorQuantities.X_COMPONENT );

    const yComponentText = new VectorSymbolNode( { showVectorArrow: false } );
    const yComponentNumberDisplay = new VectorValuesNumberDisplay( graph, VectorQuantities.Y_COMPONENT );

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
    // unlink is unnecessary, exists for the lifetime of the sim.
    graph.activeVectorProperty.link( ( activeVector, oldActiveVector ) => {

      if ( activeVector !== null ) {
        vectorAttributesContainer.visible = true;
        selectVectorText.visible = false;

        // Get the vector symbol
        const vectorSymbol = activeVector.symbol ? activeVector.symbol : activeVector.fallBackSymbol;

        // Update labels (angle label is the same)
        magnitudeDisplayNode.setSymbol( vectorSymbol );
        xComponentText.setSymbol( `${vectorSymbol}<sub>${VectorAdditionStrings.symbol.x}</sub>` );
        yComponentText.setSymbol( `${vectorSymbol}<sub>${VectorAdditionStrings.symbol.y}</sub>` );
      }
      else {
        vectorAttributesContainer.visible = false;
        selectVectorText.visible = true;
      }

      selectVectorText.centerY = panelOpenContent.centerY;
      vectorAttributesContainer.centerY = panelOpenContent.centerY;

      if ( activeVector && activeVector.coefficientProperty ) {
        activeVector.coefficientProperty.link( updateCoefficient ); // unlink required when active vector changes
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
    assert && assert( false, 'VectorValuesToggleBox is not intended to be disposed' );
  }
}

vectorAddition.register( 'VectorValuesToggleBox', VectorValuesToggleBox );