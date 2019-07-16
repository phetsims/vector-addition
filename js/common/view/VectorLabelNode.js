// Copyright 2019, University of Colorado Boulder

/**
 * View for the label 'next' to a vector. Vector labels depend on the type of vectors and differ in different situations
 *
 * For instance, vectors that don't have a tag (in lab) display a fall back tag only when they are active,
 * but vectors on explore1D always display a label.
 * (See https://github.com/phetsims/vector-addition/issues/39.)
 *
 * There are 4 different factors for determining what the label displays:
 *  - Whether the values are visible (determined by the values checkbox)
 *  - Whether the magnitude/component is of length 0. See
 *     https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit#bookmark=id.kmeaaeg3ukx9
 *  - Whether the vector has a tag (i.e the vectors on lab screen don't have tags)
 *  - Whether the vector is active (https://github.com/phetsims/vector-addition/issues/39#issuecomment-506586411)
 *
 * These factors play different roles for different vector types, making it difficult to generalize.
 *
 * Thus, a call to the models getLabelContent is needed to determine what is displayed.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const RootVector = require( 'VECTOR_ADDITION/common/model/RootVector' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Multilink = require( 'AXON/Multilink' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );

  // constants
  const VALUE_LABEL_OPTIONS = {
    font: new PhetFont( { size: 12.5, fontWeight: 800 } ),
    boundsMethod: 'accurate'
  };
  const ACTIVE_VECTOR_LABEL_BACKGROUND = VectorAdditionColors.ACTIVE_VECTOR_LABEL_BACKGROUND;


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

      options = _.extend( {
        fill: VectorAdditionColors[ rootVector.vectorGroup ].labelBackground, // label background
        scale: 0.67, // {number} - scale resize of the formula node
        opacity: 0.75, // {number} - opacity of the background,
        cornerRadius: 4, // {number}
        xMargin: 10, // {number}
        yMargin: 4, // {number}
        tagValueSpacing: 3 // {number} spacing between the tag and the value
      }, options );

      //----------------------------------------------------------------------------------------

      // Create the background rectangle, set as an arbitrary rectangle for now
      const backgroundRectangle = new Rectangle( 0, 0, 1, 1, options );

      // Create the label node, which is a parent of the tag and the value
      const vectorLabel = new Node();

      const coefficientLabel = new Text( '', VALUE_LABEL_OPTIONS );

      // Create the Formula Node for the label and scale it to the correct size
      const vectorTagNode = new FormulaNode( '' );
      vectorTagNode.scale( options.scale );

      // Create the text for the value
      const vectorValueNode = new Text( '', VALUE_LABEL_OPTIONS );

      super( {
        children: [ backgroundRectangle, vectorLabel.setChildren( [ coefficientLabel, vectorTagNode, vectorValueNode ] ) ]
      } );

      //----------------------------------------------------------------------------------------

      // Function to change the label value and the background rectangle
      const updateLabelNode = ( valuesVisible ) => {

        // Get the label display information
        const labelDisplayData = rootVector.getLabelContent( valuesVisible );

        // Toggle visibility
        coefficientLabel.visible = typeof labelDisplayData.coefficient === 'string';
        vectorTagNode.visible = typeof labelDisplayData.tag === 'string';
        vectorValueNode.visible = typeof labelDisplayData.value === 'string';
        backgroundRectangle.visible = vectorTagNode.visible || vectorValueNode.visible || coefficientLabel.visible;

        if ( coefficientLabel.visible ) {
          coefficientLabel.setText( labelDisplayData.coefficient );
        }
        else {
          coefficientLabel.setText( '' );
        }
        //----------------------------------------------------------------------------------------
        // Update the tag if it exists
        if ( vectorTagNode.visible ) {
          vectorTagNode.setFormula( `\\vec{ \\mathrm{ ${labelDisplayData.tag} } \}` );
        }
        else {
          vectorTagNode.setFormula( '' );
        }

        //----------------------------------------------------------------------------------------
        // Update the value if it exists
        if ( vectorValueNode.visible ) {
          vectorValueNode.setText( labelDisplayData.value );
        }
        else {
          vectorValueNode.setText( '' );
        }

        vectorValueNode.invalidateSelf();

        //----------------------------------------------------------------------------------------
        // Update the background
        if ( backgroundRectangle.visible ) {

          // Active vectors have different background colors
          if ( activeVectorProperty.value === rootVector ) {
            backgroundRectangle.fill = ACTIVE_VECTOR_LABEL_BACKGROUND;
          }
          else {
            backgroundRectangle.fill = options.fill;
          }

          vectorTagNode.left = coefficientLabel.right + options.tagValueSpacing;
          // Align the nodes together
          vectorValueNode.left = vectorTagNode.right + options.tagValueSpacing;

          vectorLabel.invalidateSelf();

          // Set the background size
          backgroundRectangle.setRectWidth( vectorLabel.getBounds().width + 2 * options.xMargin );
          backgroundRectangle.setRectHeight( vectorLabel.getBounds().height + 2 * options.yMargin );

          // Update positioning
          backgroundRectangle.center = vectorLabel.center;
          vectorValueNode.centerY = backgroundRectangle.centerY;
          vectorTagNode.centerY = backgroundRectangle.centerY;
          coefficientLabel.centerY = backgroundRectangle.centerY;
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
      this.disposeListeners = () => {
        this.labelMultilink.dispose();
      };

      this.updateLabelNode = updateLabelNode;
    }

    /**
     * Disposes the label node
     * @public
     */
    dispose() {
      this.disposeListeners();
      super.dispose();
    }
  }

  return vectorAddition.register( 'VectorLabelNode', VectorLabelNode );
} );