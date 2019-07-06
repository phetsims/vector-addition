// Copyright 2019, University of Colorado Boulder

/**
 * Root class (meant to be subtyped) for vector views for all types of vectors (sum, component, etc.).
 * Primarily responsibilities are:
 *  - Create an Arrow Node that mirrors a vector models tail/tip position
 *  - Create Other Nodes that ALL vectors in the sim have (ie. labels etc.)
 *
 * For an overview of the vector class hierarchy visit https://github.com/phetsims/vector-addition/issues/31
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const RootVectorModel = require( 'VECTOR_ADDITION/common/model/RootVectorModel' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorLabelNode = require( 'VECTOR_ADDITION/common/view/VectorLabelNode' );

  // constants
  const ARROW_MOUSEAREA_OFFSET = 3; // offset to make the arrow easier to grab
  const LABEL_OFFSET = VectorAdditionConstants.VECTOR_LABEL_OFFSET;

  class RootVectorNode extends Node {
    /**
     * @constructor
     * @param {RootVectorModel} rootVectorModel - the vector model
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {Property.<RootVectorModel>|null} activeVectorProperty
     * @param {Object} [arrowOptions]
     */
    constructor( rootVectorModel,
                 modelViewTransformProperty,
                 valuesVisibleProperty,
                 activeVectorProperty,
                 arrowOptions
    ) {

      assert && assert( rootVectorModel instanceof RootVectorModel, `invalid rootVectorModel: ${rootVectorModel}` );
      assert && assert( modelViewTransformProperty instanceof Property
      && modelViewTransformProperty.value instanceof ModelViewTransform2,
        `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( activeVectorProperty instanceof Property
                        && activeVectorProperty.value instanceof RootVectorModel || activeVectorProperty.value === null,
        `invalid activeVectorProperty: ${activeVectorProperty}` );
      assert && assert( !arrowOptions || Object.getPrototypeOf( arrowOptions ) === Object.prototype,
        `Extra prototype on Options: ${arrowOptions}` );

      arrowOptions = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, arrowOptions );

      //----------------------------------------------------------------------------------------

      super();

      // Define a vector node in which the tail location (view coordinates) is (0, 0). Get the tip location in view
      // coordinates
      const tipDeltaLocation = modelViewTransformProperty.value.modelToViewDelta( rootVectorModel.vectorComponents );

      // @protected {ArrowNode} arrowNode - Create an arrow node that represents an actual vector.
      this.arrowNode = new ArrowNode( 0, 0, tipDeltaLocation.x, tipDeltaLocation.y, arrowOptions );

      // @protected {VectorLabelNode} labelNode - Create a label for the vector that is displayed 'next' to the arrow.
      // The location of this depends on the angle of the vector. Since the positioning of 'next' is different for every
      // vector, use an overridable method to position it. ( updateLabelPositioning() )
      this.labelNode = new VectorLabelNode( rootVectorModel, modelViewTransformProperty, valuesVisibleProperty, activeVectorProperty );

      // Add children to this node
      this.setChildren( [ this.arrowNode, this.labelNode ] );

      //----------------------------------------------------------------------------------------
      // Update the tail/tip location when the vector's tail/tip position changes

      // @protected {Multilink} - observe changes to the tail/tip and mirror the positioning. If the values visibility
      // changes, update the view as well
      this.vectorObserver = Property.multilink(
        [ valuesVisibleProperty, rootVectorModel.tailPositionProperty, rootVectorModel.tipPositionProperty ],
        ( valuesVisible ) => {

          // Update the appearance of the vector
          this.updateVector( rootVectorModel, modelViewTransformProperty.value );

          // Update the appearance of the label
          this.updateLabelPositioning( rootVectorModel, modelViewTransformProperty.value, valuesVisible );
        } );
    }

    /**
     * Updates the tail and tip position of the view. Called when the model changes tail/tip.
     * @param {RootVectorModel} rootVectorModel
     * @param {ModelViewTransform2} modelViewTransform
     * @protected
     */
    updateVector( rootVectorModel, modelViewTransform ) {

      // Since the tail is defined at (0, 0) for the vector, the vector must be translated.
      this.translation = modelViewTransform.modelToViewPosition( rootVectorModel.tail );

      // Get the tip location in view coordinates
      const tipDeltaLocation = modelViewTransform.modelToViewDelta( rootVectorModel.vectorComponents );
      this.arrowNode.setTip( tipDeltaLocation.x, tipDeltaLocation.y );

      if ( rootVectorModel.magnitude > 0 ) {
        // Make the arrow easier to grab
        this.arrowNode.mouseArea = this.arrowNode.shape.getOffsetShape( ARROW_MOUSEAREA_OFFSET );
      }
    }

    /**
     * Updates the label positioning, called when the vector is changing or the value checkbox is clicked.
     * This can be overridden if the positioning isn't appropriate (e.g. component nodes have different positioning)
     * @param {RootVectorModel} rootVectorModel
     * @param {ModelViewTransform2} modelViewTransform
     * @param {boolean} valuesVisible
     * @protected
     */
    updateLabelPositioning( rootVectorModel, modelViewTransform, valuesVisible ) {

      if ( rootVectorModel.magnitude === 0 ) { // don't do anything if the magnitude is 0
        return;
      }

      // Reset the rotation
      this.labelNode.setRotation( 0 );

      // Angle of the vector in radians (ranging from -Pi to Pi)
      const modelAngle = rootVectorModel.angle;

      //----------------------------------------------------------------------------------------
      // convenience variables
      // Add a flip if x is negative
      const xFlip = ( rootVectorModel.xComponent >= 0 ) ? 0 : Math.PI;

      // Add a flip if y is negative
      const yFlip = ( rootVectorModel.yComponent >= 0 ) ? 0 : Math.PI;


      //----------------------------------------------------------------------------------------
      // Add extra offset to consider the size of the label. The offset is the margin between the arrow and the label

      const labelSize = ( rootVectorModel.yComponent >= 0 ) ?
                        modelViewTransform.viewToModelDeltaX( this.labelNode.height / 2 ) :
                        -modelViewTransform.viewToModelDeltaY( this.labelNode.height / 2 );

      //----------------------------------------------------------------------------------------
      if ( valuesVisible ) {

        // Since the y-axis is inverted, the angle is the view is opposite to the model
        const viewAngle = -modelAngle;

        // Rotate label along the angle if x is positive, but flipped if x is negative
        this.labelNode.setRotation( viewAngle + xFlip );
      }

      // Create an offset that is perpendicular to the vector, and is pointing in the positive theta if x is positive
      // and negative theta if x is positive
      const offset = Vector2.createPolar( LABEL_OFFSET + labelSize, modelAngle + Math.PI / 2 + yFlip + xFlip );

      // Create label halfway above the vector
      const midPoint = rootVectorModel.vectorComponents.timesScalar( 0.5 );

      this.labelNode.center = modelViewTransform.modelToViewDelta( midPoint.plus( offset ) );
    }

    /**
     * Disposes the vector
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

  return vectorAddition.register( 'RootVectorNode', RootVectorNode );
} );