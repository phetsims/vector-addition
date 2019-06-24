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
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );


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

      //----------------------------------------------------------------------------------------

      // @private {Multilink} - observe changes to the model vector to update the label
      this.vectorObserver = new Multilink(
        [ valuesVisibleProperty,
          baseVectorModel.tailPositionProperty,
          baseVectorModel.tipPositionProperty ],
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

      // TODO: consolidate positioning
      // TODO: i think that positioning can be done inside of vectorNode. We can have a method for it and in this way
      // component can override it (because their positioning is slightly different)

      if ( !baseVectorModel.label && valuesVisible ) {
        this.label.setFormula( `${Util.toFixed( baseVectorModel.magnitude, 1 )}` );
      }
      if ( baseVectorModel.label && !valuesVisible ) {
        this.label.setFormula( `\\vec{ \\mathrm{ ${baseVectorModel.label} } \}` );

        const modelAngle = baseVectorModel.angle; // angle in the model in radians (ranging from -Pi to Pi)

        // add a flip (180 degrees) if the angle is in quadrant III and IV (that is, y is negative)
        const yFlip = ( modelAngle >= 0 ) ? 0 : Math.PI;

        // add a flip (180 degrees) if the angle is in quadrant II and III (that is, x is negative)
        const xFlip = ( modelAngle <= Math.PI / 2 && modelAngle >= -Math.PI / 2 ) ? 0 : Math.PI;

        // create an offset that is perpendicular to the vector, 2 model unit long about
        // and is pointing in the positive theta for quadrants I and III and negative theta for quadrants II and IV
        const offset = Vector2.createPolar( 2, modelAngle + Math.PI / 2 + yFlip + xFlip );

        // create label halfway above the vector
        const midPoint = baseVectorModel.attributesVector.timesScalar( 0.5 );

        this.label.center = this.modelViewTransformProperty.value.modelToViewDelta( midPoint.plus( offset ) );


      }
      else if ( !baseVectorModel.label && !valuesVisible ) {
        this.label.setFormula( '' );
      }
      else if ( baseVectorModel.label && valuesVisible ) {
        this.label.setFormula( `\|\\vec{ \\mathrm{ ${baseVectorModel.label} } \}|=\\mathrm{${Util.toFixed( baseVectorModel.magnitude, 1 )}}` );

        const modelAngle = baseVectorModel.angle; // angle in the model in radians (ranging from -Pi to Pi)

        // since the y-axis is inverted, the angle is the view is opposite to the model
        const viewAngle = -modelAngle;

        // add a flip (180 degrees) if the angle is in quadrant II and III (that is, x is negative)
        const xFlip = ( modelAngle <= Math.PI / 2 && modelAngle >= -Math.PI / 2 ) ? 0 : Math.PI;

        // add a flip (180 degrees) if the angle is in quadrant III and IV (that is, y is negative)
        const yFlip = ( modelAngle >= 0 ) ? 0 : Math.PI;

        // rotate label along the angle for quadrants I and IV, but flipped for quadrants II and III
        this.setRotation( viewAngle + xFlip );

        // create a vector at the mid point of the vector, remembering the entire node has already been rotated
        const midPosition = Vector2.createPolar( baseVectorModel.magnitude / 2, xFlip );

        // create an offset that is perpendicular to the vector, 2 model unit long about
        // and is pointing above if y>=0 but below is y<0
        const offset = Vector2.createPolar( 2, Math.PI / 2 + yFlip );

        this.label.center =
          this.modelViewTransformProperty.value.modelToViewDelta( midPosition.plus( offset ) );
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