// Copyright 2019, University of Colorado Boulder

/**
 * View for the label of a vector. Vector labels depend on the type of vector.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BaseVectorModel = require( 'VECTOR_ADDITION/common/model/BaseVectorModel' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Multilink = require( 'AXON/Multilink' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const Text = require( 'SCENERY/nodes/Text' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  const ANGLE_LABEL_FONT = new PhetFont( { family: 'serif', size: 11.5, fontWeight: 800 } );
  
  class VectorLabelNode extends Node {
    /**
     * @constructor
     * @param {BaseVectorModel} baseVectorModel
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {ModelViewTransform2} modelViewTransformProperty
     * @param {Object} [options]
     */
    constructor( baseVectorModel, modelViewTransformProperty, valuesVisibleProperty, activeVectorProperty, options ) {

      options = _.extend( {
        fill: VectorAdditionColors[ baseVectorModel.vectorGroup ].labelBackground,
        scale: 0.67, // {number} - scale resize of the formula node
        opacity: 0.75, // {number} - opacity of the background,
        cornerRadius: 4, // {number}
        xMargin: 8, // {number}
        yMargin: 5, // {number}
        tagValueSpacing: 3
      }, options );

      assert && assert( baseVectorModel instanceof BaseVectorModel, `invalid baseVectorModel: ${baseVectorModel}` );
      assert && assert( modelViewTransformProperty instanceof Property
      && modelViewTransformProperty.value instanceof ModelViewTransform2,
        `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      //----------------------------------------------------------------------------------------

      // Create the background rectangle, set as an arbitrary rectangle for now
      const backgroundRectangle = new Rectangle( 0, 0, 1, 1, options );

      const vectorLabelContainer = new Node();

      // Create the Formula Node for the label and scale it to the correct size
      const vectorNameLabel = new FormulaNode( '' );
      vectorNameLabel.scale( options.scale );

      // Create the text for the value if it has one
      const vectorValueLabel = new Text( '', { font: ANGLE_LABEL_FONT, boundsMethod: 'accurate' } );

      super( {
        children: [ backgroundRectangle, vectorLabelContainer.setChildren( [ vectorNameLabel, vectorValueLabel ] ) ]
      } );

      //----------------------------------------------------------------------------------------

      // Function to change the label value and the background rectangle
      const updateLabelNode = ( valuesVisible ) => {

        // Get the label display information
        const labelDisplay = baseVectorModel.getLabelContent( valuesVisible );
        
        vectorNameLabel.visible = typeof labelDisplay.prefix === 'string';
        vectorValueLabel.visible = typeof labelDisplay.value === 'string';
        backgroundRectangle.visible = vectorNameLabel.visible || vectorValueLabel.visible;

        //----------------------------------------------------------------------------------------
        // Update the label name if it exists
        if ( vectorNameLabel.visible ) {
          vectorNameLabel.setFormula( `\\vec{ \\mathrm{ ${labelDisplay.prefix} } \}` );
        }
        else {
          vectorNameLabel.setFormula( '' );
        }
        //----------------------------------------------------------------------------------------
        // Update the label value
        if ( vectorValueLabel.visible ) {
          vectorValueLabel.setText( labelDisplay.value );
        }
        else {
          vectorValueLabel.setText( '' );
        }
          vectorValueLabel.invalidateSelf();
        //----------------------------------------------------------------------------------------
        // Update the background
        if ( backgroundRectangle.visible ) {

          // Align the nodes together
          if ( vectorValueLabel.visible && vectorNameLabel.visible ) {
            vectorValueLabel.left = vectorNameLabel.right + options.tagValueSpacing;
          }


          vectorLabelContainer.invalidateSelf();
          backgroundRectangle.setRectWidth( vectorLabelContainer.getVisibleBounds().width + 2 * options.xMargin );
          backgroundRectangle.setRectHeight( vectorLabelContainer.getVisibleBounds().height + 2 * options.yMargin );
          backgroundRectangle.center = vectorLabelContainer.center;

          vectorValueLabel.centerY = backgroundRectangle.centerY;
          vectorNameLabel.centerY = backgroundRectangle.centerY;
        }

      };

      //----------------------------------------------------------------------------------------

      // Observe changes to the model vector, and update the label node
      this.vectorObserver = new Multilink( [ valuesVisibleProperty,
          baseVectorModel.tailPositionProperty,
          baseVectorModel.tipPositionProperty,
          activeVectorProperty ],
        updateLabelNode );

      // @private
      this.disposeListeners = () => {
        this.vectorObserver.dispose();
      };
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