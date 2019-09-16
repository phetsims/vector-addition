// Copyright 2019, University of Colorado Boulder

/**
 * Base class for vector views for all types of vectors (sum, component, etc.).
 * Primarily responsibilities are:
 *  - Create an Arrow Node that mirrors a vector models tail/tip position
 *  - Create Other Nodes that ALL vectors in the sim have (ie. labels etc.)
 *
 * For an overview of the class hierarchy,
 * see https://github.com/phetsims/vector-addition/blob/master/doc/implementation-notes.md
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const RootVector = require( 'VECTOR_ADDITION/common/model/RootVector' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorLabelNode = require( 'VECTOR_ADDITION/common/view/VectorLabelNode' );

  // constants
  const ARROW_MOUSEAREA_OFFSET = 3; // offset to make the arrow easier to grab
  const LABEL_OFFSET = VectorAdditionConstants.VECTOR_LABEL_OFFSET;

  class RootVectorNode extends Node {

    /**
     * @param {RootVector} rootVector - the vector model
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {Property.<RootVector>|null} activeVectorProperty
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
        `Extra prototype on options: ${options}` );

      options = merge( {

        // {Object} options passed to ArrowNode
        arrowOptions: {
          cursor: 'move'
        }
      }, options );

      //----------------------------------------------------------------------------------------

      super( options );

      // Define a vector node in which the tail location (view coordinates) is (0, 0). Get the tip location in view
      // coordinates
      const tipDeltaLocation = modelViewTransformProperty.value.modelToViewDelta( rootVector.vectorComponents );

      // @protected {ArrowNode} arrowNode - Create an arrow node that represents an actual vector.
      this.arrowNode = new ArrowNode( 0, 0, tipDeltaLocation.x, tipDeltaLocation.y, options.arrowOptions );

      // @protected {VectorLabelNode} labelNode - Create a label for the vector that is displayed 'next' to the arrow.
      // The location of this depends on the angle of the vector. Since the positioning of 'next' is different for every
      // vector, use an overridable method to position it. ( updateLabelPositioning() )
      this.labelNode = new VectorLabelNode( rootVector,
        modelViewTransformProperty,
        valuesVisibleProperty,
        activeVectorProperty, {
          cursor: 'move'
        } );

      // Add children to this node
      this.setChildren( [ this.arrowNode, this.labelNode ] );

      //----------------------------------------------------------------------------------------
      // Update the tail/tip location when the vector's tail/tip position changes

      // @protected {Multilink} - observe changes to the tail/tip and mirror the positioning. If the values visibility
      // changes, update the view as well
      this.vectorObserver = Property.multilink(
        [ valuesVisibleProperty, rootVector.tailPositionProperty, rootVector.tipPositionProperty, activeVectorProperty ],
        ( valuesVisible ) => {

          // Update the appearance of the vector
          this.updateVector( rootVector, modelViewTransformProperty.value );

          // Update the appearance of the label
          this.updateLabelPositioning( rootVector, modelViewTransformProperty.value, valuesVisible );
        } );
    }

    /**
     * Updates the tail and tip position of the view. Called when the model changes tail/tip.
     * @param {RootVector} rootVector
     * @param {ModelViewTransform2} modelViewTransform
     * @protected
     */
    updateVector( rootVector, modelViewTransform ) {

      // Since the tail is defined at (0, 0) for the vector, the vector must be translated.
      this.translation = modelViewTransform.modelToViewPosition( rootVector.tail );

      // Get the tip location in view coordinates
      const tipDeltaLocation = modelViewTransform.modelToViewDelta( rootVector.vectorComponents );
      this.arrowNode.setTip( tipDeltaLocation.x, tipDeltaLocation.y );

      if ( rootVector.magnitude > 0 ) {
        // Make the arrow easier to grab
        this.arrowNode.mouseArea = this.arrowNode.shape.getOffsetShape( ARROW_MOUSEAREA_OFFSET );
      }
    }

    /**
     * Updates the label positioning, called when the vector is changing or the value checkbox is clicked.
     * This can be overridden if the positioning isn't appropriate (e.g. component nodes have different positioning)
     * @param {RootVector} rootVector
     * @param {ModelViewTransform2} modelViewTransform
     * @param {boolean} valuesVisible
     * @protected
     */
    updateLabelPositioning( rootVector, modelViewTransform, valuesVisible ) {

      // Reset the rotation
      this.labelNode.setRotation( 0 );

      if ( rootVector.magnitude === 0 ) { // don't do anything if the magnitude is 0
        this.labelNode.center = modelViewTransform.modelToViewDelta( Vector2.ZERO );
        return;
      }

      // Angle of the vector in radians (ranging from -Pi to Pi)
      const modelAngle = rootVector.angle;

      //----------------------------------------------------------------------------------------
      // convenience variables
      // Add a flip if x is negative
      const xFlip = ( rootVector.xComponent >= 0 ) ? 0 : Math.PI;

      // Add a flip if y is negative
      const yFlip = ( rootVector.yComponent >= 0 ) ? 0 : Math.PI;


      //----------------------------------------------------------------------------------------
      // Add extra offset to consider the size of the label. The offset is the margin between the arrow and the label

      const labelSize = ( rootVector.yComponent >= 0 ) ?
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
      const midPoint = rootVector.vectorComponents.timesScalar( 0.5 );

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