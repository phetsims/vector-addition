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
  const Util = require( 'DOT/Util' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );

  class VectorLabelNode extends Node {
    /**
     * @constructor
     * @param {BaseVectorModel} baseVectorModel
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {ModelViewTransform2} modelViewTransformProperty
     * @param {Object} [options]
     */
    constructor( baseVectorModel, modelViewTransformProperty, valuesVisibleProperty, options ) {

      options = _.extend( {
        fill: VectorAdditionColors[ baseVectorModel.vectorGroup ].labelBackground,
        scale: 0.67, // {number} - scale resize of the formula node
        opacity: 0.75, // {number} - opacity of the background,
        cornerRadius: 5, // {number}
        xMargin: 5, // {number}
        yMargin: 1 // {number}
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

      // Create the Formula Node for the label and scale it to the correct size
      const label = new FormulaNode( '' );
      label.scale( options.scale );

      super( {
        children: [ backgroundRectangle, label ]
      } );

      //----------------------------------------------------------------------------------------

      // Function to change the label value and the background rectangle
      const updateLabelNode = ( valuesVisible ) => {

        // Flag to indicate if the model represents component, which means the labeling is different
        const isComponentModel = baseVectorModel.vectorType === BaseVectorModel.VECTOR_TYPES.COMPONENT;

        let roundedMagnitude;
        if ( baseVectorModel.vectorType === BaseVectorModel.VECTOR_TYPES.COMPONENT ) {
          const xComponent = baseVectorModel.attributesVector.x;
          const yComponent = baseVectorModel.attributesVector.y;

          roundedMagnitude = Util.toFixed( xComponent ? xComponent : yComponent, 1 );
        }
        else {
          roundedMagnitude = Util.toFixed( baseVectorModel.magnitude, 1 );
        }

        //----------------------------------------------------------------------------------------

        if ( valuesVisible ) { // components only show the magnitude
          label.setFormula( isComponentModel ? roundedMagnitude :
                            `\|\\vec{ \\mathrm{ ${baseVectorModel.label} } \}|=\\mathrm{${roundedMagnitude}}` );
        }
        else if ( !valuesVisible && !isComponentModel ) {
          label.setFormula( `\\vec{ \\mathrm{ ${baseVectorModel.label} } \}` );
        }

        //----------------------------------------------------------------------------------------
        // Update the background

        // Calculate the bounds using getSafeSelfBounds. See https://github.com/phetsims/vector-addition/issues/40.
        const labelBounds = label.getSafeSelfBounds();

        backgroundRectangle.setRectWidth( labelBounds.width + 2 * options.xMargin );
        backgroundRectangle.setRectHeight( labelBounds.height + 2 * options.yMargin );
        backgroundRectangle.center = label.center;
      };

      //----------------------------------------------------------------------------------------

      // Observe changes to the model vector, and update the label node
      this.vectorObserver = new Multilink( [ valuesVisibleProperty,
          baseVectorModel.tailPositionProperty,
          baseVectorModel.tipPositionProperty ],
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