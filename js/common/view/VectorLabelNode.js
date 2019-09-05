// Copyright 2019, University of Colorado Boulder

/**
 * View for the label 'next' to a vector.
 *
 * See RootVector.getLabelContent() for context.
 *
 * The label node contains:
 *  - A Vector Symbol Node
 *  - A Text node to display a value string
 *
 * @author Brandon Li
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
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RootVector = require( 'VECTOR_ADDITION/common/model/RootVector' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorSymbolNode = require( 'VECTOR_ADDITION/common/view/VectorSymbolNode' );

  // constants
  const TEXT_OPTIONS = {
    font: new PhetFont( 15 )
  };
  const ACTIVE_VECTOR_LABEL_BACKGROUND = VectorAdditionColors.ACTIVE_VECTOR_LABEL_BACKGROUND;


  class VectorLabelNode extends Node {
    /**
     * @param {RootVector} rootVector
     * @param {ModelViewTransform2} modelViewTransformProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {Property.<RootVector|null>} activeVectorProperty
     * @param {Object} [options] TODO #165 options not passed to super
     */
    constructor( rootVector, modelViewTransformProperty, valuesVisibleProperty, activeVectorProperty, options ) {

      assert && assert( rootVector instanceof RootVector, `invalid rootVector: ${rootVector}` );
      assert && assert( modelViewTransformProperty instanceof Property
      && modelViewTransformProperty.value instanceof ModelViewTransform2,
        `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( activeVectorProperty instanceof Property
                        && activeVectorProperty.value instanceof RootVector || activeVectorProperty.value === null,
        `invalid activeVectorProperty: ${activeVectorProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = merge( {

        backgroundRectangleOptions: { // {Object} passed to the backgroundRectangle
          fill: rootVector.vectorColorPalette.labelBackgroundFill,
          stroke: rootVector.vectorColorPalette.labelBackgroundStroke,
          cornerRadius: 4
        },

        xMargin: 5,                   // {number} horizontal margin
        yMargin: 1,                   // {number} vertical margin
        symbolValueSpacing: 7         // {number} spacing between the vector symbol node and the value

      }, options );

      //----------------------------------------------------------------------------------------

      // Create the background rectangle, set as an arbitrary rectangle for now
      const backgroundRectangle = new Rectangle( 0, 0, 1, 1, options.backgroundRectangleOptions );

      // Create the Vector Symbol Node, set to arbitrary value for now.
      const vectorSymbolNode = new VectorSymbolNode( null, null, false, {
        coefficientTextOptions: TEXT_OPTIONS,
        spacing: 1
      } );

      // Create the text for the value
      const vectorValueText = new Text( '', TEXT_OPTIONS );

      // Create a horizontal layout box for the symbol and the value
      const vectorLabelContent = new HBox( { spacing: options.symbolValueSpacing } );

      super( {
        children: [ backgroundRectangle, vectorLabelContent ]
      } );

      //----------------------------------------------------------------------------------------

      // Function to change the label node and the background rectangle
      const updateLabelNode = ( valuesVisible ) => {

        // Get the label display information
        const labelDisplayData = rootVector.getLabelContent( valuesVisible );

        // Update the VectorSymbolNode
        vectorSymbolNode.setVectorSymbolNode( labelDisplayData.symbol,
          labelDisplayData.coefficient,
          labelDisplayData.includeAbsoluteValueBars );

        // Update the vector value text
        labelDisplayData.value && vectorValueText.setText( vectorSymbolNode.visible ? `${MathSymbols.EQUAL_TO} ${labelDisplayData.value}` : labelDisplayData.value );

        //----------------------------------------------------------------------------------------
        // Toggle the visibility
        vectorValueText.visible = labelDisplayData.value ? true : false;
        backgroundRectangle.visible = vectorSymbolNode.visible || vectorValueText.visible;

        // Update the children of the label content container
        vectorLabelContent.setChildren( [ vectorSymbolNode, vectorValueText ].filter( node => ( node.visible ) ) );

        //----------------------------------------------------------------------------------------
        // Update the background
        if ( backgroundRectangle.visible ) {

          // Active vectors have different background colors
          backgroundRectangle.fill = activeVectorProperty.value === rootVector ?
                                     ACTIVE_VECTOR_LABEL_BACKGROUND :
                                     options.backgroundRectangleOptions.fill;


          // Set the background size
          backgroundRectangle.setRectWidth( vectorLabelContent.width + 2 * options.xMargin );
          backgroundRectangle.setRectHeight( vectorLabelContent.height + 2 * options.yMargin );

          // Update positioning
          vectorLabelContent.center = backgroundRectangle.center;
        }
      };

      //----------------------------------------------------------------------------------------

      // Observe changes to the model vector, and update the label node
      this.labelMultilink = new Multilink( [ valuesVisibleProperty,
          rootVector.tailPositionProperty,
          rootVector.tipPositionProperty,
          activeVectorProperty ],
        updateLabelNode );

      // @private {function} function to dispose listeners
      this.disposeVectorLabelNode = () => {
        this.labelMultilink.dispose();
      };

      this.updateLabelNode = updateLabelNode;
    }

    /**
     * Disposes the label node
     * @public
     */
    dispose() {
      this.disposeVectorLabelNode();
      super.dispose();
    }
  }

  return vectorAddition.register( 'VectorLabelNode', VectorLabelNode );
} );