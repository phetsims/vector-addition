// Copyright 2025, University of Colorado Boulder

/**
 * VectorTranslationDragListener translates a vector by dragging it with the pointer.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector from '../model/Vector.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import VectorNode from './VectorNode.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';

export class VectorTranslationDragListener extends SoundDragListener {

  public constructor( vector: Vector,
                      selectedVectorProperty: Property<Vector | null>,
                      graphBoundsProperty: TReadOnlyProperty<Bounds2>,
                      vectorNode: VectorNode,
                      vectorShadowNode: Node,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      cursor: string ) {

    // Create a Property for the position of the tail of the vector.
    const tailPositionProperty = new Vector2Property( modelViewTransformProperty.value.modelToViewPosition(
      vector.tail ) );

    super( {
      tandem: Tandem.OPT_OUT, // VectorNode is created dynamically and is not PhET-iO instrumented.
      pressCursor: cursor,
      targetNode: vectorNode,
      positionProperty: tailPositionProperty,

      start: () => {
        affirm( !vector.animateBackProperty.value && !vector.isAnimating(),
          'body drag listener should be removed when the vector is animating back.' );
        if ( vector.isOnGraphProperty.value ) {
          selectedVectorProperty.value = vector;
        }
      },

      end: () => {

        affirm( !vector.animateBackProperty.value && !vector.isAnimating(),
          'body drag listener should be removed when the vector is animating back.' );

        // Determine whether to drop the vector on the graph, or animate the vector back to the toolbox.
        if ( !vector.isOnGraphProperty.value ) {

          // Get the cursor position as this determines whether the vector is destined for the graph or toolbox.
          // See https://github.com/phetsims/vector-addition/issues/50
          const cursorPosition = modelViewTransformProperty.value
            .viewToModelDelta( this.localPoint ).plus( vector.tail );

          // If the cursor is on the graph, drop the vector on the graph.
          if ( graphBoundsProperty.value.containsPoint( cursorPosition ) ) {

            // Drop the vector where the shadow was positioned.
            const shadowOffset = modelViewTransformProperty.value.viewToModelDelta( vectorShadowNode.center )
              .minus( vector.xyComponents.timesScalar( 0.5 ) );
            const shadowTailPosition = vector.tail.plus( shadowOffset );
            vector.dropOntoGraph( shadowTailPosition );
          }
          else {

            // Animate the vector back to the toolbox.
            vector.animateBackProperty.value = true;
          }
        }
      }
    } );

    // Translate when the vector's tail position changes.
    tailPositionProperty.lazyLink( tailPositionView => {
      vectorNode.updateTailPosition( tailPositionView );
      if ( vector.isRemovableFromGraph ) {
        const tailPositionModel = modelViewTransformProperty.value.viewToModelPosition( tailPositionView );

        const cursorPositionModel = modelViewTransformProperty.value
          .viewToModelDelta( this.localPoint ).plus( tailPositionModel );

        if ( vector.isOnGraphProperty.value && !graphBoundsProperty.value.containsPoint( cursorPositionModel ) ) {
          vector.popOffOfGraph();
        }
      }
    } );
  }
}

vectorAddition.register( 'VectorTranslationDragListener', VectorTranslationDragListener );