// Copyright 2019, University of Colorado Boulder

/**
 * Base class for vector views for all types of vectors (sum, component, etc.).
 * Primarily responsibilities are:
 *  - Create an Arrow Node that mirrors a vector models tail/tip position
 *  - Create Other Nodes that ALL vectors in the sim have (ie. labels etc.)
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BaseVectorModel = require( 'VECTOR_ADDITION/common/model/BaseVectorModel' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Multilink = require( 'AXON/Multilink' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorLabelNode = require( 'VECTOR_ADDITION/common/view/VectorLabelNode' );
  const Vector2 = require( 'DOT/Vector2' );

  class BaseVectorNode extends Node {
    /**
     * @constructor
     * @param {BaseVectorModel} baseVectorModel - the vector model
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property for the coordinate transform
     * between model coordinates and view coordinates
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {Object} [arrowOptions] - options passed to the arrow node for specific / specialized styling
     */
    constructor( baseVectorModel, modelViewTransformProperty, valuesVisibleProperty, arrowOptions ) {

      // Type check arguments
      assert && assert( baseVectorModel instanceof BaseVectorModel, `invalid baseVectorModel: ${baseVectorModel}` );
      assert && assert( modelViewTransformProperty instanceof Property
      && modelViewTransformProperty.value instanceof ModelViewTransform2,
        `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
      assert && assert( typeof arrowOptions === 'object', `invalid arrowOptions: ${arrowOptions}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );

      //----------------------------------------------------------------------------------------

      super();

      // Define a vector node in which the tail location (view coordinates) 
      // is (0, 0). Get the tip location in view coordinates
      const tipDeltaLocation = modelViewTransformProperty.value.modelToViewDelta( baseVectorModel.attributesVector );

      // @protected {Node} arrowNode - Create an arrow node that represents an actual vector.
      this.arrowNode = new ArrowNode( 0, 0, tipDeltaLocation.x, tipDeltaLocation.y, arrowOptions );

      // @protected {Node} labelNode - Create a label for the vector that is displayed 'next' to the arrow.
      // The location of this depends on the angle of the vector.
      this.labelNode = new VectorLabelNode( baseVectorModel, valuesVisibleProperty, modelViewTransformProperty );

      this.setChildren( [ this.arrowNode, this.labelNode ] );

      //----------------------------------------------------------------------------------------
      // update the tail/tip location when the vector's tail/tip position changes

      // @private {Multilink} - observe changes to the tail/tip
      this.vectorObserver = new Multilink(
        [ baseVectorModel.tailPositionProperty, baseVectorModel.tipPositionProperty, valuesVisibleProperty ],
        () => {
          this.updateVector( baseVectorModel, modelViewTransformProperty.value ); 
          this.updateLabelPositioning( baseVectorModel, modelViewTransformProperty.value, valuesVisibleProperty.value );
        } );
      
    }

    /**
     * Update the tail and tip position of the view
     * @param {BaseVectorModel} baseVectorModel
     * @param {ModelViewTransform2} modelViewTransform
     * @private
     */
    updateVector( baseVectorModel, modelViewTransform ) {

      // Since the tail is defined at (0, 0) for the vector, we must translate.
      this.translation = modelViewTransform.modelToViewPosition( baseVectorModel.tail );

      // Get the tip location in view coordinates
      const tipDeltaLocation = modelViewTransform.modelToViewDelta( baseVectorModel.attributesVector );
      this.arrowNode.setTip( tipDeltaLocation.x, tipDeltaLocation.y );

      // make the arrow easier to grab
      this.arrowNode.mouseArea = this.arrowNode.shape.getOffsetShape( 3 );
    }
    /**
     * Update the label positioning
     * @param {BaseVectorModel} baseVectorModel
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Boolean} valuesVisible
     * @private
     */
    updateLabelPositioning( baseVectorModel, modelViewTransform, valuesVisible ) {

      this.labelNode.setRotation( 0 );

      const modelAngle = baseVectorModel.angle; // angle in the model in radians (ranging from -Pi to Pi)

      if ( !valuesVisible ) {

        // add a flip (180 degrees) if the angle is in quadrant III and IV (that is, y is negative)
        const yFlip = ( modelAngle >= 0 ) ? 0 : Math.PI;

        // add a flip (180 degrees) if the angle is in quadrant II and III (that is, x is negative)
        const xFlip = ( modelAngle <= Math.PI / 2 && modelAngle >= -Math.PI / 2 ) ? 0 : Math.PI;

        // create an offset that is perpendicular to the vector, 2 model unit long about
        // and is pointing in the positive theta for quadrants I and III and negative theta for quadrants II and IV
        const offset = Vector2.createPolar( 2, modelAngle + Math.PI / 2 + yFlip + xFlip );

        // create label halfway above the vector
        const midPoint = baseVectorModel.attributesVector.timesScalar( 0.5 );

        this.labelNode.center = modelViewTransform.modelToViewDelta( midPoint.plus( offset ) );

      }       
      else {
        // since the y-axis is inverted, the angle is the view is opposite to the model
        const viewAngle = -modelAngle;

        // add a flip (180 degrees) if the angle is in quadrant II and III (that is, x is negative)
        const xFlip = ( modelAngle <= Math.PI / 2 && modelAngle >= -Math.PI / 2 ) ? 0 : Math.PI;

        // add a flip (180 degrees) if the angle is in quadrant III and IV (that is, y is negative)
        const yFlip = ( modelAngle >= 0 ) ? 0 : Math.PI;

        // rotate label along the angle for quadrants I and IV, but flipped for quadrants II and III
        this.labelNode.setRotation( viewAngle + xFlip );

        // create an offset that is perpendicular to the vector, 2 model unit long about
        // and is pointing in the positive theta for quadrants I and III and negative theta for quadrants II and IV
        const offset = Vector2.createPolar( 2, modelAngle + Math.PI / 2 + yFlip + xFlip );

        // create label halfway above the vector
        const midPoint = baseVectorModel.attributesVector.timesScalar( 0.5 );

        this.labelNode.center = modelViewTransform.modelToViewDelta( midPoint.plus( offset ) );
      }
    }
    /**
     * Dispose the vector
     * @public
     * @override
     */
    dispose() {
      this.arrowNode.dispose();
      this.labelNode.dispose();
      this.vectorObserver.dispose();
      super.dispose();
    }
  }

  return vectorAddition.register( 'BaseVectorNode', BaseVectorNode );
} );