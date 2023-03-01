// Copyright 2019-2023, University of Colorado Boulder

/**
 * VectorLabelNode is the label that appears on a vector.  It may show only the vector's symbol, or the vector's value.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { HBox, Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import RootVector from '../model/RootVector.js';
import VectorAdditionColors from '../VectorAdditionColors.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorSymbolNode from './VectorSymbolNode.js';

export default class VectorLabelNode extends Node {

  /**
   * @param {RootVector} rootVector
   * @param {BooleanProperty} valuesVisibleProperty
   * @param {Property.<RootVector|null>} activeVectorProperty
   * @param {Object} [options]
   */
  constructor( rootVector, valuesVisibleProperty, activeVectorProperty, options ) {

    assert && assert( rootVector instanceof RootVector, `invalid rootVector: ${rootVector}` );
    assert && assert( valuesVisibleProperty instanceof BooleanProperty, `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
    assert && assert( activeVectorProperty instanceof Property && activeVectorProperty.value instanceof RootVector || activeVectorProperty.value === null,
      `invalid activeVectorProperty: ${activeVectorProperty}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

    options = merge( {
      xMargin: 5, // {number} horizontal margin
      yMargin: 1,  // {number} vertical margin
      symbolValueSpacing: 7 // {number} spacing between the vector symbol node and the value
    }, options );

    // Create the background rectangle, set as an arbitrary rectangle for now
    const backgroundRectangle = new Rectangle( 0, 0, 1, 1, {
      fill: VectorAdditionConstants.INACTIVE_VECTOR_LABEL_BACKGROUND_FILL,
      stroke: VectorAdditionConstants.INACTIVE_VECTOR_LABEL_BACKGROUND_STROKE,
      cornerRadius: 4
    } );

    // Create the VectorSymbolNode, set to arbitrary value for now.
    const vectorSymbolNode = new VectorSymbolNode( {
      symbolFont: VectorAdditionConstants.VECTOR_LABEL_SYMBOL_FONT,
      font: VectorAdditionConstants.VECTOR_LABEL_FONT,
      spacing: 1
    } );

    // Create the text for the value
    const vectorValueText = new Text( '', { font: VectorAdditionConstants.VECTOR_LABEL_FONT } );

    // Create a horizontal layout box for the symbol and the value
    const vectorLabelContent = new HBox( {
      spacing: options.symbolValueSpacing,
      align: 'origin' // so that text baselines will be aligned
    } );

    assert && assert( !options.children, 'VectorLabelNode sets children' );
    options.children = [ backgroundRectangle, vectorLabelContent ];

    super( options );

    // @private
    this.rootVector = rootVector;
    this.valuesVisibleProperty = valuesVisibleProperty;
    this.activeVectorProperty = activeVectorProperty;
    this.xMargin = options.xMargin;
    this.yMargin = options.yMargin;
    this.backgroundRectangle = backgroundRectangle;
    this.vectorSymbolNode = vectorSymbolNode;
    this.vectorValueText = vectorValueText;
    this.vectorLabelContent = vectorLabelContent;

    // Observe changes to the model vector, and update the label node. Dispose is required.
    const labelMultilink = new Multilink(
      [ valuesVisibleProperty, rootVector.tailPositionProperty, rootVector.tipPositionProperty, activeVectorProperty ],
      () => this.update()
    );

    // @private {function} function to dispose listeners
    this.disposeVectorLabelNode = () => {
      labelMultilink.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeVectorLabelNode();
    super.dispose();
  }

  /**
   * Updates the label and background rectangle.
   * @public
   */
  update() {

    // Get the label display information
    const labelDisplayData = this.rootVector.getLabelContent( this.valuesVisibleProperty.value );

    // Update the VectorSymbolNode
    this.vectorSymbolNode.setVectorSymbolNode( labelDisplayData.symbol,
      labelDisplayData.coefficient,
      labelDisplayData.includeAbsoluteValueBars );

    // Update the displayed value
    if ( labelDisplayData.value ) {
      const valueText = this.vectorSymbolNode.visible ? `${MathSymbols.EQUAL_TO} ${labelDisplayData.value}` : labelDisplayData.value;
      this.vectorValueText.setString( valueText );
    }

    // Toggle the visibility
    this.vectorValueText.visible = !!labelDisplayData.value;
    this.backgroundRectangle.visible = ( this.vectorSymbolNode.visible || this.vectorValueText.visible );

    // Update the children of the label content container
    this.vectorLabelContent.setChildren(
      [ this.vectorSymbolNode, this.vectorValueText ].filter( node => ( node.visible ) )
    );

    // Update the background
    if ( this.backgroundRectangle.visible ) {

      // Set the background size
      this.backgroundRectangle.setRectWidth( this.vectorLabelContent.width + 2 * this.xMargin );
      this.backgroundRectangle.setRectHeight( this.vectorLabelContent.height + 2 * this.yMargin );

      // Update positioning
      this.vectorLabelContent.center = this.backgroundRectangle.center;
    }
  }

  /**
   * Determines whether the label is highlighted.
   * @param {boolean} highlighted
   * @public
   */
  setHighlighted( highlighted ) {
    if ( highlighted ) {
      this.backgroundRectangle.fill = VectorAdditionColors.ACTIVE_VECTOR_LABEL_BACKGROUND_FILL;
      this.backgroundRectangle.stroke = VectorAdditionColors.ACTIVE_VECTOR_LABEL_BACKGROUND_STROKE;
    }
    else {
      this.backgroundRectangle.fill = VectorAdditionColors.INACTIVE_VECTOR_LABEL_BACKGROUND_FILL;
      this.backgroundRectangle.stroke = VectorAdditionColors.INACTIVE_VECTOR_LABEL_BACKGROUND_STROKE;
    }
  }
}

vectorAddition.register( 'VectorLabelNode', VectorLabelNode );