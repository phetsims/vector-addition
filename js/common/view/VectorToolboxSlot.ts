// Copyright 2025, University of Colorado Boulder

/**
 * VectorToolboxSlot is the base class for a slot in a vector toolbox.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VectorAdditionSceneNode from './VectorAdditionSceneNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector from '../model/Vector.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import VectorSet from '../model/VectorSet.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';

type SelfOptions = EmptySelfOptions;

export type VectorToolboxSlotOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

export default class VectorToolboxSlot extends InteractiveHighlighting( HBox ) {

  protected constructor( vectors: Vector[], // vectors in this slot
                         getNextVector: () => Vector | null, // Gets the next vector to be dragged out of the slot.
                         vectorSet: VectorSet,
                         modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                         sceneNode: VectorAdditionSceneNode,
                         iconNode: Node,
                         iconComponents: Vector2,
                         providedOptions: VectorToolboxSlotOptions ) {

    const options = optionize<VectorToolboxSlotOptions, SelfOptions, HBoxOptions>()( {

      // HBoxOptions
      isDisposable: false,
      spacing: 5,
      tagName: 'button'
    }, providedOptions );

    super( options );

    // Dragging the vector out of the slot.
    this.addInputListener( SoundDragListener.createForwardingListener( event => {

      // Find where the icon was clicked relative to the scene node, in view coordinates.
      const vectorCenterView = sceneNode.globalToLocalPoint( event.pointer.point );

      // Convert the view coordinates of where the icon was clicked into model coordinates.
      const vectorCenterModel = modelViewTransformProperty.value.viewToModelPosition( vectorCenterView );

      const vector = getNextVector()!;
      affirm( vector, 'Expected vector to be defined.' );
      vector.reset();

      // Calculate where the tail position is relative to the scene node.
      vector.tailPositionProperty.value = vectorCenterModel.minus( vector.xyComponents.timesScalar( 0.5 ) );

      // Add to activeVectors, so that it is included in the sum calculation when dropped on the graph.
      vectorSet.activeVectors.push( vector );

      // Tell sceneNode to create the view for the vector.
      sceneNode.registerVector( vector, vectorSet, event );
    } ) );

    // Hide the icon and disable focus when all vectors have left the toolbox.
    vectorSet.activeVectors.lengthProperty.link( () => {
      const slotIsEmpty = _.every( vectors, vector => vectorSet.activeVectors.includes( vector ) );
      iconNode.visible = !slotIsEmpty;
      this.focusable = !slotIsEmpty;
    } );

    // When a vector is added to activeVectors, add the listener that handles animating it back to the toolbox.
    vectorSet.activeVectors.addItemAddedListener( vector => {

      const animateVectorBackListener = ( animateBack: boolean ) => {
        if ( animateBack ) {

          // Get the model position of the icon node.
          const iconPosition = modelViewTransformProperty.value.viewToModelBounds( sceneNode.boundsOf( iconNode ) ).center;

          // Animate the vector to its icon in the panel.
          vector.animateToPoint( iconPosition, iconComponents, () => {
            vectorSet.activeVectors.remove( vector );
            vector.reset();
            //TODO https://github.com/phetsims/vector-addition/issues/258 Why is this needed? Without it, fails the 2nd time that a vector is activated.
            vector.animateBackProperty.value = false;
          } );
        }
      };
      vector.animateBackProperty.link( animateVectorBackListener ); // unlink required when the vector is removed

      // Clean up when the vector is removed.
      const vectorRemovedListener = ( removedVector: Vector ) => {
        if ( removedVector === vector ) {
          vector.animateBackProperty.unlink( animateVectorBackListener );
          vectorSet.activeVectors.removeItemRemovedListener( vectorRemovedListener );
        }
      };
      vectorSet.activeVectors.addItemRemovedListener( vectorRemovedListener );
    } );
  }
}

vectorAddition.register( 'VectorToolboxSlot', VectorToolboxSlot );