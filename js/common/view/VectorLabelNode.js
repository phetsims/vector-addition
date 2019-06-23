// Copyright 2019, University of Colorado Boulder

/**
 * View for the label of a vector
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
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );
  const Vector2 = require( 'DOT/Vector2' );


  class VectorLabelNode extends Node {
    /**
     * @constructor
     * @param {BaseVectorModel} baseVectorModel
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {ModelViewTransform2} modelViewTransformProperty
     * @param {Object} [options]
     */
    constructor( baseVectorModel, valuesVisibleProperty, modelViewTransformProperty, options ) {

      options = _.extend( {
        fill: baseVectorModel.vectorType === VectorTypes.ONE ?
              VectorAdditionColors.VECTOR_GROUP_1_COLORS.labelBackground :
              VectorAdditionColors.VECTOR_GROUP_2_COLORS.labelBackground,
        scale: 0.67, // {number} - scale resize of the formula node
        opacity: 0.75, // {number} - opacity of the background,
        cornerRadius: 5, // {number}
        xMargin: 5.5, // {number}
        yMargin: 0.5 // {number}
      }, options );

      assert && assert( baseVectorModel instanceof BaseVectorModel, `invalid baseVectorModel: ${baseVectorModel}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );

      //----------------------------------------------------------------------------------------

      super();

      // @private {Rectangle} - the background rectangle, set as arbitrary rectangle for now
      this.backgroundRectangle = new Rectangle( -25, -25, 25, 25, options );

      // @private {FormulaNode} - the label, set as empty for now
      this.label = new FormulaNode( '' );
      this.label.scale( options.scale );

      this.setChildren( [ this.backgroundRectangle, this.label ] );

      // @public - create references to the xMargin and yMargin
      this.xMargin = options.xMargin;
      this.yMargin = options.yMargin;

      this.modelViewTransformProperty = modelViewTransformProperty;

      //----------------------------------------------------------------------------------------

      // @private {Multilink} - observe changes to the model vector to update the label
      this.vectorObserver = new Multilink(
        [ valuesVisibleProperty, baseVectorModel.attributesVectorProperty, baseVectorModel.tailPositionProperty, baseVectorModel.tipPositionProperty ],
        ( valuesVisible ) => {
          this.updateLabel( baseVectorModel, valuesVisible );
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
     * @private
     */
    updateLabel( baseVectorModel, valuesVisible ) {

      this.setRotation( 0 );

      if ( !baseVectorModel.label && valuesVisible ) {
        this.label.setFormula( `${Util.toFixed( baseVectorModel.magnitude, 1 )}` );
      }
      if ( baseVectorModel.label && !valuesVisible ) {
        this.label.setFormula( `\\vec{ \\mathrm{ ${baseVectorModel.label} } \}` );
        this.label.center = this.modelViewTransformProperty.value.modelToViewDelta( baseVectorModel.components.timesScalar( 0.5 ) );
      }
      else if ( !baseVectorModel.label && !valuesVisible ) {
        this.label.setFormula( '' );
      }
      else if ( baseVectorModel.label && valuesVisible ) {
        this.label.setFormula( `\|\\vec{ \\mathrm{ ${baseVectorModel.label} } \}|=\\mathrm{${Util.toFixed( baseVectorModel.magnitude, 1 )}}` );

        // TODO: explain thought process
        const rotation = Math.abs( baseVectorModel.angle ) < Math.PI / 2 ? -baseVectorModel.angle : Math.PI - baseVectorModel.angle;
          this.setRotation( rotation );

        const vector = new Vector2.createPolar( 2, -rotation + Math.PI / 2 );
        const offset = ( baseVectorModel.angle >= 0 ) ? vector : vector.negated();

        this.label.center = this.modelViewTransformProperty.value.modelToViewDelta( 
          baseVectorModel.components
            .timesScalar( 0.5 )
            .plus( offset )
            .rotated( rotation ) );


      }
      this.label.invalidateDOM();
      this.resizeBackground();
    }

    /**
     * Resize the background rectangle
     * @public
     */
    resizeBackground() {

      const labelBounds = this.label.calculateDOMBounds();

      const labelWidth = labelBounds.width;
      const labelHeight = labelBounds.height;

      this.backgroundRectangle.setRectWidth( labelWidth + 2 * this.xMargin );
      this.backgroundRectangle.setRectHeight( labelHeight + 2 * this.yMargin );
      this.backgroundRectangle.center = this.label.center;
    }

  }

  return vectorAddition.register( 'VectorLabelNode', VectorLabelNode );
} );