// Copyright 2019-2023, University of Colorado Boulder

/**
 * Base class for vector views for all types of vectors (sum, component, etc.).
 * Primarily responsibilities are:
 *  - Create an ArrowNode or DashedArrowNode that displays a vector's tail/tip position
 *  - Create other Nodes that ALL vectors in the sim have (i.e. labels etc.)
 *
 * For an overview of the class hierarchy,
 * see https://github.com/phetsims/vector-addition/blob/master/doc/implementation-notes.md
 *
 * @author Brandon Li
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import RootVector from '../model/RootVector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import DashedArrowNode from './DashedArrowNode.js';
import VectorLabelNode from './VectorLabelNode.js';

// constants

// Used to prevent vector label from going off-screen. This is the magnitude of a vector that fills the
// graph along a diagonal, minus the margin that constrains dragging of the vector's tail.
// See https://github.com/phetsims/vector-addition/issues/212#issuecomment-537628386 for a screenshot.
const MAX_LABEL_VECTOR_MAGNITUDE = new Vector2(
  VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS.width - VectorAdditionConstants.VECTOR_TAIL_DRAG_MARGIN,
  VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS.height - VectorAdditionConstants.VECTOR_TAIL_DRAG_MARGIN
).magnitude;

export default class RootVectorNode extends Node {

  /**
   * @param {RootVector} rootVector - the vector model
   * @param {ReadOnlyProperty.<ModelViewTransform2>} modelViewTransformProperty
   * @param {BooleanProperty} valuesVisibleProperty
   * @param {Property.<RootVector>|null} activeVectorProperty
   * @param {Object} [options]
   */
  constructor( rootVector, modelViewTransformProperty, valuesVisibleProperty, activeVectorProperty, options ) {

    assert && assert( rootVector instanceof RootVector, `invalid rootVector: ${rootVector}` );
    assert && assert( modelViewTransformProperty instanceof ReadOnlyProperty && modelViewTransformProperty.value instanceof ModelViewTransform2,
      `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
    assert && assert( valuesVisibleProperty instanceof BooleanProperty, `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
    assert && assert( activeVectorProperty instanceof Property && activeVectorProperty.value instanceof RootVector || activeVectorProperty.value === null,
      `invalid activeVectorProperty: ${activeVectorProperty}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
      `Extra prototype on options: ${options}` );

    options = merge( {

      arrowType: 'solid',

      // options passed to ArrowNode or DashedArrowNode
      arrowOptions: {
        cursor: 'move'
      }
    }, options );

    //----------------------------------------------------------------------------------------

    super( options );

    // Define a vector node in which the tail position (view coordinates) is (0, 0). Get the tip position in view
    // coordinates
    const tipDeltaPosition = modelViewTransformProperty.value.modelToViewDelta( rootVector.vectorComponents );

    // @protected {ArrowNode} arrowNode - Create an arrow node that represents an actual vector.
    if ( options.arrowType === 'solid' ) {
      this.arrowNode = new ArrowNode( 0, 0, tipDeltaPosition.x, tipDeltaPosition.y, options.arrowOptions );
    }
    else {
      this.arrowNode = new DashedArrowNode( 0, 0, tipDeltaPosition.x, tipDeltaPosition.y, options.arrowOptions );
    }

    // @protected {VectorLabelNode} labelNode - Create a label for the vector that is displayed 'next' to the arrow.
    // The position of this depends on the angle of the vector. Since the positioning of 'next' is different for every
    // vector, use an overridable method to position it. ( updateLabelPositioning() )
    // dispose is required because this observes the Properties that are passed to it.
    this.labelNode = new VectorLabelNode( rootVector, valuesVisibleProperty, activeVectorProperty, {
      cursor: 'move'
    } );

    // Add children to this node
    this.setChildren( [ this.arrowNode, this.labelNode ] );

    //----------------------------------------------------------------------------------------
    // Update the tail/tip position when the vector's tail/tip position changes

    // Observe changes to the tail/tip and mirror the positioning. If the values visibility changes, update the
    // view as well.  unmultilink is required on dispose.
    const updateMultilink = Multilink.multilink(
      [ valuesVisibleProperty, rootVector.tailPositionProperty, rootVector.tipPositionProperty, activeVectorProperty ],
      valuesVisible => {

        // Update the appearance of the vector
        this.updateVector( rootVector, modelViewTransformProperty.value );

        // Update the appearance of the label
        this.updateLabelPositioning( rootVector, modelViewTransformProperty.value, valuesVisible );
      } );

    // @private
    this.disposeRootVectorNode = () => {
      this.labelNode.dispose();
      Multilink.unmultilink( updateMultilink );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeRootVectorNode();
    super.dispose();
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

    // Get the tip position in view coordinates
    const tipDeltaPosition = modelViewTransform.modelToViewDelta( rootVector.vectorComponents );
    this.arrowNode.setTip( tipDeltaPosition.x, tipDeltaPosition.y );

    // Make the arrow easier to grab by setting pointer areas
    if ( rootVector.magnitude > VectorAdditionConstants.ZERO_THRESHOLD && this.arrowNode.shape ) {
      this.arrowNode.mouseArea = this.arrowNode.shape.getOffsetShape( VectorAdditionConstants.VECTOR_MOUSE_AREA_DILATION );
      this.arrowNode.touchArea = this.arrowNode.shape.getOffsetShape( VectorAdditionConstants.VECTOR_TOUCH_AREA_DILATION );
    }

    // See https://github.com/phetsims/vector-addition/issues/252
    this.arrowNode.visible = ( rootVector.magnitude > VectorAdditionConstants.ZERO_THRESHOLD );
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

    // If the magnitude is effectively 0, center the label on the vector's position.
    // See https://github.com/phetsims/vector-addition/issues/260
    if ( rootVector.magnitude < VectorAdditionConstants.ZERO_THRESHOLD ) {
      this.labelNode.center = modelViewTransform.modelToViewDelta( Vector2.ZERO );
      return;
    }

    // Angle of the vector in radians (ranging from -Pi to Pi)
    const modelAngle = rootVector.angle;

    //----------------------------------------------------------------------------------------
    // Determine how the labels should be positioned.

    // Add a flip if x is negative
    const xFlip = ( rootVector.xComponent < 0 ) ? Math.PI : 0;

    // Add a flip if y is negative
    const yFlip = ( rootVector.yComponent < 0 ) ? Math.PI : 0;

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

    // Create an offset that is perpendicular to the vector
    const offset = Vector2.createPolar( VectorAdditionConstants.VECTOR_LABEL_OFFSET + labelSize, modelAngle + Math.PI / 2 + yFlip );

    // Position the label
    this.labelNode.center = RootVectorNode.computeLabelCenter( rootVector, modelViewTransform, offset );
  }

  /**
   * Computes the center position for the label.
   * See https://github.com/phetsims/vector-addition/issues/212
   *
   * @param {RootVector} vector
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Vector2} offset - perpendicular offset
   * @returns {Vector2}
   * @public
   */
  static computeLabelCenter( vector, modelViewTransform, offset ) {
    assert && assert( vector instanceof RootVector, 'invalid vector' );
    assert && assert( modelViewTransform instanceof ModelViewTransform2, 'invalid modelViewTransform' );
    assert && assert( offset instanceof Vector2, 'invalid offset' );

    // Create a vector parallel to rootVector that determines where the label will be placed.
    let labelVector = null;
    if ( vector.vectorComponents.magnitude < MAX_LABEL_VECTOR_MAGNITUDE ) {
      labelVector = vector.vectorComponents;
    }
    else {
      labelVector = vector.vectorComponents.normalized().timesScalar( MAX_LABEL_VECTOR_MAGNITUDE );
    }

    return modelViewTransform.modelToViewDelta( labelVector.timesScalar( 0.5 ).plus( offset ) );
  }
}

vectorAddition.register( 'RootVectorNode', RootVectorNode );