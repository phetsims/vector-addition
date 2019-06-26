// Copyright 2019, University of Colorado Boulder

/**
 * View for the label of a vector. This is different from the component label
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BaseVectorModel = require( 'VECTOR_ADDITION/common/model/BaseVectorModel' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const Multilink = require( 'AXON/Multilink' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Util = require( 'DOT/Util' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorComponent = require( 'VECTOR_ADDITION/common/model/VectorComponent' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

  // constants

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
        fill: baseVectorModel.vectorGroup === VectorGroups.ONE ?
              VectorAdditionColors.VECTOR_GROUP_1_COLORS.labelBackground :
              VectorAdditionColors.VECTOR_GROUP_2_COLORS.labelBackground,
        scale: 0.67, // {number} - scale resize of the formula node
        opacity: 0.75, // {number} - opacity of the background,
        cornerRadius: 5, // {number}
        xMargin: 5, // {number}
        yMargin: 1 // {number}
      }, options );

      assert && assert( baseVectorModel instanceof BaseVectorModel, `invalid baseVectorModel: ${baseVectorModel}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );

      //----------------------------------------------------------------------------------------

      super();

      // @private {Rectangle} - the background rectangle, set of size zero to start with
      this.backgroundRectangle = new Rectangle( 0, 0, 0, 0, options );

      // @private {FormulaNode} - the label, set as empty for now
      this.label = new FormulaNode( '' );
      this.label.scale( options.scale );

      // @private {number} - create references to the xMargin and yMargin
      this.xMargin = options.xMargin;
      this.yMargin = options.yMargin;

      // @private
      this.modelViewTransformProperty = modelViewTransformProperty;

      this.setChildren( [ this.backgroundRectangle, this.label ] );


      // @private {Multilink} - observe changes to the model vector to update the label
      this.vectorObserver = new Multilink(
        [ valuesVisibleProperty,
          baseVectorModel.tailPositionProperty,
          baseVectorModel.tipPositionProperty ],
        ( valuesVisible ) => {
          this.updateLabel( baseVectorModel,
            valuesVisible,
            VectorComponent.Types.includes( baseVectorModel.componentType ) );
        } );

    }

    /**
     * Dispose the label node
     * @public
     */
    dispose() {
      this.vectorObserver.dispose();
      super.dispose();
    }

    /**
     * Update the label when the model vector changes or the values visibility checkbox is clicked
     * @param {BaseVectorModel} baseVectorModel
     * @param {boolean} valuesVisible
     * @param {boolean} isComponent - whether the model is a component
     * @private
     */
    updateLabel( baseVectorModel, valuesVisible, isComponent ) {

      if ( !valuesVisible ) {

        if ( !isComponent ) {
          this.label.setFormula( `\\vec{ \\mathrm{ ${baseVectorModel.label} } \}` );
        }

      }
      else if ( valuesVisible ) {
        if ( !isComponent ) {
          this.label.setFormula( `\|\\vec{ \\mathrm{ ${baseVectorModel.label} } \}|=\\mathrm{${Util.toFixed( baseVectorModel.magnitude, 1 )}}` );
        }
        else {
          this.label.setFormula( `${baseVectorModel.magnitude}` );
        }
      }

      this.resizeBackground();
    }

    /**
     * Resize the background rectangle
     * @private
     */
    resizeBackground() {

      const labelBounds = this.label.getSafeSelfBounds();

      const labelWidth = labelBounds.width;
      const labelHeight = labelBounds.height;

      this.backgroundRectangle.setRectWidth( labelWidth + 2 * this.xMargin );
      this.backgroundRectangle.setRectHeight( labelHeight + 2 * this.yMargin );
      this.backgroundRectangle.center = this.label.center;
    }
  }

  return vectorAddition.register( 'VectorLabelNode', VectorLabelNode );
} );