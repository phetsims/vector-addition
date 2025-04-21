// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorValuesToggleBox is the toggle box at the top of the screen. It displays the active vector's magnitude,
 * angle, x component, and y component.
 *
 * 'Is a' relationship with ToggleBox
 *    - when collapsed, displays 'Vector Values'
 *    - when expanded either displays 'select a vector' or the active vector's attributes
 *      (a series of labels and VectorValuesNumberDisplays)
 *
 * This panel exists for the entire sim and is never disposed.
 *
 * @author Martin Veillette
 * @author Brandon Li
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import EquationsVector from '../../equations/model/EquationsVector.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Graph from '../model/Graph.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionSymbols from '../VectorAdditionSymbols.js';
import ToggleBox, { ToggleBoxOptions } from './ToggleBox.js';
import VectorQuantity from './VectorQuantity.js';
import VectorSymbolNode from './VectorSymbolNode.js';
import VectorValuesNumberDisplay from './VectorValuesNumberDisplay.js';

//----------------------------------------------------------------------------------------
// constants

// margin from the label to the number label (ltr)
const LABEL_RIGHT_MARGIN = 7;

// margin from the number display to the label (ltr)
const LABEL_LEFT_MARGIN = 20;

// width of the magnitude label
const MAGNITUDE_LABEL_WIDTH = 50;

// width of the angle label
const ANGLE_LABEL_WIDTH = 15;

// width of the component labels
const COMPONENT_LABEL_WIDTH = 35;

type SelfOptions = EmptySelfOptions;

type VectorValuesToggleBoxOptions = SelfOptions & ToggleBoxOptions;

export default class VectorValuesToggleBox extends ToggleBox {

  public constructor( graph: Graph, providedOptions?: VectorValuesToggleBoxOptions ) {

    const options = optionize<VectorValuesToggleBoxOptions, SelfOptions, ToggleBoxOptions>()( {

      // ToggleBoxOptions
      contentFixedWidth: 500,
      contentFixedHeight: 45,
      isDisposable: false
    }, providedOptions );

    const contentFixedHeight = options.contentFixedHeight!;
    assert && assert( contentFixedHeight !== null );

    //----------------------------------------------------------------------------------------
    // Create the scenery nodes for when the accordion box is collapsed.

    // 'Vector Values', displayed when accordion box is collapsed.
    const vectorValuesText = new Text( VectorAdditionStrings.vectorValuesStringProperty, {
      font: VectorAdditionConstants.TITLE_FONT
    } );

    //----------------------------------------------------------------------------------------
    // Create the scenery nodes for when the accordion box is expanded.

    // 'No vector selected', displayed when accordion box is expanded and no vector is selected.
    const noVectorSelectedText = new Text( VectorAdditionStrings.noVectorSelectedStringProperty, {
      font: VectorAdditionConstants.TITLE_FONT,
      maxWidth: 450
    } );

    // Container for the labels and number displays that display the vector's attributes
    const vectorAttributesContainer = new HBox( { spacing: LABEL_LEFT_MARGIN } );
    vectorAttributesContainer.addChild( new HStrut( 8 ) );

    // Create the content container for the expanded content
    const expandedContent = new Node();
    expandedContent.setChildren( [ noVectorSelectedText, vectorAttributesContainer ] );

    //----------------------------------------------------------------------------------------
    // Create the scenery nodes to display the vector. Each attribute has a label and a VectorValuesNumberDisplay
    //----------------------------------------------------------------------------------------

    const magnitudeVectorSymbolNode = new VectorSymbolNode( {
      includeAbsoluteValueBars: true
    } );
    const magnitudeNumberDisplay = new VectorValuesNumberDisplay( graph, VectorQuantity.MAGNITUDE );

    const angleText = new Text( MathSymbols.THETA, { font: VectorAdditionConstants.EQUATION_SYMBOL_FONT } );
    const angleNumberDisplay = new VectorValuesNumberDisplay( graph, VectorQuantity.ANGLE );

    const xVectorSymbolNode = new VectorSymbolNode( { showVectorArrow: false } );
    const xComponentNumberDisplay = new VectorValuesNumberDisplay( graph, VectorQuantity.X_COMPONENT );

    const yVectorSymbolNode = new VectorSymbolNode( { showVectorArrow: false } );
    const yComponentNumberDisplay = new VectorValuesNumberDisplay( graph, VectorQuantity.Y_COMPONENT );

    //----------------------------------------------------------------------------------------
    // Add the new scenery nodes
    //----------------------------------------------------------------------------------------

    // Function that adds a label and display container combo.
    const addNumberDisplayAndLabel = ( label: Node, numberDisplay: NumberDisplay, labelWidth: number ) => {
      label.maxWidth = labelWidth;
      vectorAttributesContainer.addChild( new HBox( {
        spacing: LABEL_RIGHT_MARGIN,
        children: [ label, numberDisplay ]
      } ) );
    };

    addNumberDisplayAndLabel( magnitudeVectorSymbolNode, magnitudeNumberDisplay, MAGNITUDE_LABEL_WIDTH );
    addNumberDisplayAndLabel( angleText, angleNumberDisplay, ANGLE_LABEL_WIDTH );
    vectorAttributesContainer.addChild( new HStrut( 5 ) );
    addNumberDisplayAndLabel( xVectorSymbolNode, xComponentNumberDisplay, COMPONENT_LABEL_WIDTH );
    addNumberDisplayAndLabel( yVectorSymbolNode, yComponentNumberDisplay, COMPONENT_LABEL_WIDTH );

    //----------------------------------------------------------------------------------------

    const updateCoefficient = ( coefficient: number ) => {
      magnitudeVectorSymbolNode.setCoefficient( coefficient );
      xVectorSymbolNode.setCoefficient( coefficient );
      yVectorSymbolNode.setCoefficient( coefficient );
    };

    // Observe changes to when the graphs active vector Property changes to update the panel.
    // unlink is unnecessary, exists for the lifetime of the sim.
    graph.activeVectorProperty.link( ( activeVector, oldActiveVector ) => {

      if ( activeVector !== null ) {
        vectorAttributesContainer.visible = true;
        noVectorSelectedText.visible = false;

        // Get the vector symbol
        const vectorSymbolProperty = activeVector.symbolProperty ? activeVector.symbolProperty : Vector.FALLBACK_SYMBOL_PROPERTY;

        // Update labels (angle label is the same)
        magnitudeVectorSymbolNode.setSymbolProperty( vectorSymbolProperty );
        xVectorSymbolNode.setSymbolProperty( new DerivedStringProperty(
          [ vectorSymbolProperty, VectorAdditionSymbols.xStringProperty ],
          ( vectorSymbol, xString ) => `${vectorSymbol}<sub>${xString}</sub>`
        ) );
        yVectorSymbolNode.setSymbolProperty( new DerivedStringProperty(
          [ vectorSymbolProperty, VectorAdditionSymbols.yStringProperty ],
          ( vectorSymbol, yString ) => `${vectorSymbol}<sub>${yString}</sub>`
        ) );
      }
      else {
        vectorAttributesContainer.visible = false;
        noVectorSelectedText.visible = true;
      }

      noVectorSelectedText.centerY = expandedContent.centerY;
      vectorAttributesContainer.centerY = expandedContent.centerY;

      if ( activeVector && activeVector instanceof EquationsVector ) {
        activeVector.coefficientProperty.link( updateCoefficient ); // unlink required when active vector changes
      }

      if ( oldActiveVector && oldActiveVector instanceof EquationsVector ) {
        oldActiveVector.coefficientProperty.unlink( updateCoefficient );
        // reset
        updateCoefficient( ( activeVector && activeVector instanceof EquationsVector ) ? activeVector.coefficientProperty.value : 1 );
      }
    } );

    noVectorSelectedText.centerY = expandedContent.centerY;
    vectorAttributesContainer.centerY = expandedContent.centerY;

    //----------------------------------------------------------------------------------------
    // Create the inspect a vector panel
    //----------------------------------------------------------------------------------------

    super( expandedContent, vectorValuesText, options );
  }
}

vectorAddition.register( 'VectorValuesToggleBox', VectorValuesToggleBox );