// Copyright 2025, University of Colorado Boulder

/**
 * VectorToolboxSlot is the base class for a slot in a vector toolbox.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import VectorSet from '../model/VectorSet.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VectorAdditionSceneNode from './VectorAdditionSceneNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import vectorAddition from '../../vectorAddition.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Vector from '../model/Vector.js';
import Node from '../../../../scenery/js/nodes/Node.js';

type SelfOptions = EmptySelfOptions;

export type VectorToolboxSlotOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

export default class VectorToolboxSlot extends InteractiveHighlighting( HBox ) {

  protected constructor( vectors: Vector[], // vectors in the slot
                         getNextVector: () => Vector | null, // Gets the next available vector in the slot.
                         vectorSet: VectorSet,
                         modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                         sceneNode: VectorAdditionSceneNode,
                         iconNode: Node,
                         providedOptions: VectorToolboxSlotOptions ) {

    const options = optionize<VectorToolboxSlotOptions, SelfOptions, HBoxOptions>()( {

      // HBoxOptions
      isDisposable: false,
      spacing: 5,
      tagName: 'button'
    }, providedOptions );

    super( options );

    // Drag a vector out of the slot.
    this.addInputListener( SoundDragListener.createForwardingListener( event => {

      // Get the first available vector in the toolbox slot.
      const vector = getNextVector()!;
      affirm( vector, 'Expected vector to be defined.' );
      vector.reset();

      // Find where the icon was clicked relative to the scene node, in view coordinates.
      const vectorCenterView = sceneNode.globalToLocalPoint( event.pointer.point );

      // Convert the view coordinates of where the icon was clicked into model coordinates.
      const vectorCenterModel = modelViewTransformProperty.value.viewToModelPosition( vectorCenterView );

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
  }
}

vectorAddition.register( 'VectorToolboxSlot', VectorToolboxSlot );
