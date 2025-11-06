// Copyright 2025, University of Colorado Boulder

/**
 * MoveVectorDragListener translates a vector by dragging it with the pointer.
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
import Vector2 from '../../../../dot/js/Vector2.js';

export class MoveVectorDragListener extends SoundDragListener {

  private readonly vector: Vector;
  private readonly vectorNode: VectorNode;
  private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>;

  public constructor( vector: Vector,
                      vectorNode: VectorNode,
                      vectorShadowNode: Node,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      selectedVectorProperty: Property<Vector | null>,
                      graphBoundsProperty: TReadOnlyProperty<Bounds2> ) {

    // Create a Property for the position of the vector tail.
    const tailPositionProperty = new Vector2Property( modelViewTransformProperty.value.modelToViewPosition( vector.tail ) );

    super( {
      tandem: Tandem.OPT_OUT, // View is created dynamically and is not PhET-iO instrumented.
      positionProperty: tailPositionProperty,

      start: () => {
        affirm( !vector.isAnimating(), `VectorTranslationDragListener should be removed when vector ${vector.accessibleSymbolProperty.value} is animating back to toolbox.` );
        if ( vector.isOnGraphProperty.value ) {
          selectedVectorProperty.value = vector;
        }
      },

      end: () => {
        if ( vector.isOnGraphProperty.value ) {
          this.vectorNode.doAccessibleObjectResponse();
        }
        else {

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
            this.vectorNode.doAccessibleObjectResponse();
          }
          else {

            // Animate the vector back to the toolbox.
            vector.animateToToolboxProperty.value = true;
          }
        }
      }
    } );

    this.vector = vector;
    this.vectorNode = vectorNode;
    this.modelViewTransformProperty = modelViewTransformProperty;

    // Translate when the vector's tail position changes.
    tailPositionProperty.lazyLink( tailPositionView => {
      this.updateTailPosition( tailPositionView );
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

  /**
   * Updates the model vector's tail position. Called when the vector is being translated.
   */
  private updateTailPosition( tailPositionView: Vector2 ): void {

    const tailPositionModel = this.modelViewTransformProperty.value.viewToModelPosition( tailPositionView );

    if ( !this.vector.isOnGraphProperty.value ) {
      // Allow translation to anywhere if it isn't on the graph.
      this.vector.tailPositionProperty.value = tailPositionModel;
    }
    else {
      // Update the model tail position, subject to symmetric rounding, and fit inside the graph bounds.
      this.vector.moveTailToPositionWithInvariants( tailPositionModel );
    }
  }
}

vectorAddition.register( 'MoveVectorDragListener', MoveVectorDragListener );