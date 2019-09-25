// Copyright 2019, University of Colorado Boulder

/**
 * VectorLabelNode is the label that appears on a vector.  It may show only the vector's symbol, or the vector's value.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Multilink = require( 'AXON/Multilink' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RootVector = require( 'VECTOR_ADDITION/common/model/RootVector' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSymbolNode = require( 'VECTOR_ADDITION/common/view/VectorSymbolNode' );

  class VectorLabelNode extends Node {

    /**
     * @param {RootVector} rootVector
     * @param {ModelViewTransform2} modelViewTransformProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {Property.<RootVector|null>} activeVectorProperty
     * @param {Object} [options]
     */
    constructor( rootVector, modelViewTransformProperty, valuesVisibleProperty, activeVectorProperty, options ) {

      assert && assert( rootVector instanceof RootVector, `invalid rootVector: ${rootVector}` );
      assert && assert( modelViewTransformProperty instanceof Property && modelViewTransformProperty.value instanceof ModelViewTransform2,
        `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
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
        fill: rootVector.vectorColorPalette.labelBackgroundFill,
        stroke: rootVector.vectorColorPalette.labelBackgroundStroke,
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

      // Observe changes to the model vector, and update the label node
      this.labelMultilink = new Multilink(
        [ valuesVisibleProperty, rootVector.tailPositionProperty, rootVector.tipPositionProperty, activeVectorProperty ],
        () => this.update()
      );

      // @private {function} function to dispose listeners
      this.disposeVectorLabelNode = () => {
        this.labelMultilink.dispose();
      };
    }

    /**
     * Disposes the label node
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
        this.vectorValueText.setText( valueText );
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

        // Active vectors have different background colors
        this.backgroundRectangle.fill = ( this.activeVectorProperty.value === this.rootVector ) ?
                                        VectorAdditionColors.ACTIVE_VECTOR_LABEL_BACKGROUND :
                                        this.rootVector.vectorColorPalette.labelBackgroundFill;

        // Set the background size
        this.backgroundRectangle.setRectWidth( this.vectorLabelContent.width + 2 * this.xMargin );
        this.backgroundRectangle.setRectHeight( this.vectorLabelContent.height + 2 * this.yMargin );

        // Update positioning
        this.vectorLabelContent.center = this.backgroundRectangle.center;
      }
    }
  }

  return vectorAddition.register( 'VectorLabelNode', VectorLabelNode );
} );