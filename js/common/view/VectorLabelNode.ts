// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorLabelNode is the label that appears on a vector that is shown on the graph.
 * It may be only the vector's symbol, or it may be the symbol and magnitude.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import vectorAddition from '../../vectorAddition.js';
import RootVector from '../model/RootVector.js';
import VectorAdditionColors from '../VectorAdditionColors.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorSymbolNode from './VectorSymbolNode.js';

const X_MARGIN = 5;
const Y_MARGIN = 3;

export default class VectorLabelNode extends Node {

  // Vector to be labeled.
  private readonly rootVector: RootVector;

  // Whether magnitude is visible in the label.
  private readonly valuesVisibleProperty: TReadOnlyProperty<boolean>;

  // Background behind the label text, so that it's easier to see on the graph.
  private readonly backgroundRectangle: Rectangle;

  // Symbol for the vector.
  private readonly vectorSymbolNode: VectorSymbolNode;

  // Magnitude of the vector.
  private readonly vectorMagnitudeText: Text;

  // All parts of the label except the background rectangle.
  private readonly vectorLabelContent: HBox;

  // Disposes of things that are specific to this class.
  private readonly disposeVectorLabelNode: () => void;

  public constructor( rootVector: RootVector,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      selectedVectorProperty: TReadOnlyProperty<RootVector | null> ) {

    // Create the background rectangle, set as an arbitrary rectangle for now
    const backgroundRectangle = new Rectangle( 0, 0, 1, 1, {
      fill: VectorAdditionColors.selectedVectorLabelBackgroundFillProperty,
      stroke: VectorAdditionColors.unselectedVectorLabelBackgroundStrokeProperty,
      cornerRadius: 4
    } );

    // Create the VectorSymbolNode, set to arbitrary value for now.
    const vectorSymbolNode = new VectorSymbolNode( {
      symbolFont: VectorAdditionConstants.VECTOR_LABEL_SYMBOL_FONT,
      font: VectorAdditionConstants.VECTOR_LABEL_FONT,
      spacing: 1
    } );

    // Create the text for the vector's magnitude
    const vectorMagnitudeText = new Text( '', { font: VectorAdditionConstants.VECTOR_LABEL_FONT } );

    // Create a horizontal layout box for the symbol and magnitude
    const vectorLabelContent = new HBox( {
      spacing: 7,
      align: 'origin' // so that text baselines will be aligned
    } );

    super( {
      children: [ backgroundRectangle, vectorLabelContent ],
      interruptSubtreeOnInvisible: false
    } );

    this.rootVector = rootVector;
    this.valuesVisibleProperty = valuesVisibleProperty;
    this.backgroundRectangle = backgroundRectangle;
    this.vectorSymbolNode = vectorSymbolNode;
    this.vectorMagnitudeText = vectorMagnitudeText;
    this.vectorLabelContent = vectorLabelContent;

    // Observe changes to the model vector, and update the label node. Dispose is required.
    const labelMultilink = new Multilink(
      [ valuesVisibleProperty, rootVector.tailPositionProperty, rootVector.tipPositionProperty, selectedVectorProperty ],
      () => this.update()
    );

    this.disposeVectorLabelNode = () => {
      this.vectorSymbolNode.dispose();
      labelMultilink.dispose();
    };
  }

  public override dispose(): void {
    this.disposeVectorLabelNode();
    super.dispose();
  }

  /**
   * Updates the label and background rectangle.
   */
  private update(): void {

    // Get the label display information
    const labelDisplayData = this.rootVector.getLabelDisplayData( this.valuesVisibleProperty.value );

    // Update the VectorSymbolNode
    this.vectorSymbolNode.setVectorSymbolNode( labelDisplayData.symbolProperty,
      labelDisplayData.coefficient,
      labelDisplayData.includeAbsoluteValueBars );

    // Update the displayed magnitude. Use dot/js/util/toFixed so that we get a consistent number of decimal places.
    if ( labelDisplayData.magnitude !== null ) {
      const roundedMagnitude = toFixed( labelDisplayData.magnitude, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES );
      const string = this.vectorSymbolNode.visible ? `${MathSymbols.EQUAL_TO} ${roundedMagnitude}` : roundedMagnitude;
      this.vectorMagnitudeText.setString( string );
    }

    // Toggle the visibility
    this.vectorMagnitudeText.visible = ( labelDisplayData.magnitude !== null );
    this.backgroundRectangle.visible = ( this.vectorSymbolNode.visible || this.vectorMagnitudeText.visible );

    // Update the children of the label content container
    this.vectorLabelContent.setChildren(
      [ this.vectorSymbolNode, this.vectorMagnitudeText ].filter( node => ( node.visible ) )
    );

    // Update the background
    if ( this.backgroundRectangle.visible ) {

      // Set the background size
      this.backgroundRectangle.setRectWidth( this.vectorLabelContent.width + 2 * X_MARGIN );
      this.backgroundRectangle.setRectHeight( this.vectorLabelContent.height + 2 * Y_MARGIN );

      // Update positioning
      this.vectorLabelContent.center = this.backgroundRectangle.center;
    }
  }

  /**
   * Determines whether the label is highlighted.
   */
  public setHighlighted( highlighted: boolean ): void {
    if ( highlighted ) {
      this.backgroundRectangle.fill = VectorAdditionColors.selectedVectorLabelBackgroundFillProperty;
      this.backgroundRectangle.stroke = VectorAdditionColors.selectedVectorLabelBackgroundStrokeProperty;
    }
    else {
      this.backgroundRectangle.fill = VectorAdditionColors.unselectedVectorLabelBackgroundFillProperty;
      this.backgroundRectangle.stroke = VectorAdditionColors.unselectedVectorLabelBackgroundStrokeProperty;
    }
  }
}

vectorAddition.register( 'VectorLabelNode', VectorLabelNode );