// Copyright 2025, University of Colorado Boulder

/**
 * VectorScaleRotateDragListener scales and rotates a vector by dragging its head with the pointer.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import vectorAddition from '../../vectorAddition.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import Vector from '../model/Vector.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VectorTipNode from './VectorTipNode.js';

export default class VectorScaleRotateDragListener extends SoundDragListener {

  private readonly vector: Vector;
  private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>;
  private readonly tipNode: VectorTipNode;

  public constructor( vector: Vector,
                      tipNode: VectorTipNode,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      selectedVectorProperty: Property<Vector | null> ) {

    // Position of the vector tip, relative to the tail, in view coordinates.
    const tipPositionViewProperty = new Vector2Property( modelViewTransformProperty.value.modelToViewDelta( vector.xyComponents ) );

    super( {
      tandem: Tandem.OPT_OUT, // View is created dynamically and is not PhET-iO instrumented.
      targetNode: tipNode,
      positionProperty: tipPositionViewProperty,
      start: () => {
        affirm( !vector.animateBackProperty.value && !vector.isAnimating(),
          'VectorScaleRotateDragListener should be removed when the vector is animating back.' );
        selectedVectorProperty.value = vector;
      },
      end: () => {
        this.tipNode.doAccessibleObjectResponse();
      }
    } );

    this.vector = vector;
    this.modelViewTransformProperty = modelViewTransformProperty;
    this.tipNode = tipNode;

    // Move the tip to match the vector model.
    tipPositionViewProperty.lazyLink( tipPositionView => this.updateTipPosition( tipPositionView ) );
  }

  /**
   * Updates the model vector's tail position. Called when the vector is being rotated or scaled.
   */
  private updateTipPosition( tipPositionView: Vector2 ): void {
    affirm( !this.vector.animateBackProperty.value && !this.vector.isAnimating(),
      `Cannot drag tip when vector ${this.vector.accessibleSymbolProperty.value} is animating back` );
    const tipPositionModel = this.vector.tail.plus( this.modelViewTransformProperty.value.viewToModelDelta( tipPositionView ) );
    this.vector.moveTipToPositionWithInvariants( tipPositionModel );
  }
}

vectorAddition.register( 'VectorScaleRotateDragListener', VectorScaleRotateDragListener );