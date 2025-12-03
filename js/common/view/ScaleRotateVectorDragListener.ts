// Copyright 2025, University of Colorado Boulder

/**
 * ScaleRotateVectorDragListener scales and rotates a vector by dragging its head with the pointer.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import Vector from '../model/Vector.js';
import VectorTipNode from './VectorTipNode.js';

export default class ScaleRotateVectorDragListener extends SoundDragListener {

  private readonly vector: Vector;
  private readonly tipNode: VectorTipNode;
  private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>;

  public constructor( vector: Vector,
                      tipNode: VectorTipNode,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      selectedVectorProperty: Property<Vector | null> ) {

    // Position of the vector tip, relative to the tail, in view coordinates.
    const tipPositionViewProperty = new Vector2Property( modelViewTransformProperty.value.modelToViewDelta( vector.xyComponents ) );

    // Position of the vector tip in model coordinates when a drag starts, before tipPositionViewProperty has been changed.
    let previousTipPositionModel = vector.tip;

    super( {
      tandem: Tandem.OPT_OUT, // View is created dynamically and is not PhET-iO instrumented.
      targetNode: tipNode,
      positionProperty: tipPositionViewProperty,
      press: () => {
        previousTipPositionModel = vector.tip;
      },
      start: () => {
        affirm( !vector.animateToToolboxProperty.value && !vector.isAnimating(),
          'ScaleRotateVectorDragListener should be removed when the vector is animating to the toolbox.' );
        selectedVectorProperty.value = vector;
      },
      end: () => {
        this.tipNode.doAccessibleObjectResponse( previousTipPositionModel );
      }
    } );

    this.vector = vector;
    this.tipNode = tipNode;
    this.modelViewTransformProperty = modelViewTransformProperty;

    // Move the tip to match the vector model.
    tipPositionViewProperty.lazyLink( tipPositionView => this.updateTipPosition( tipPositionView ) );
  }

  /**
   * Updates the model vector's tail position. Called when the vector is being rotated or scaled.
   */
  private updateTipPosition( tipPositionView: Vector2 ): void {
    const tipPositionModel = this.vector.tail.plus( this.modelViewTransformProperty.value.viewToModelDelta( tipPositionView ) );
    this.vector.moveTipToPositionWithInvariants( tipPositionModel );
  }
}

vectorAddition.register( 'ScaleRotateVectorDragListener', ScaleRotateVectorDragListener );