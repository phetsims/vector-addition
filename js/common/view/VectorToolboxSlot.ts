// Copyright 2025, University of Colorado Boulder

/**
 * VectorToolboxSlot is the base class for a slot in a vector toolbox.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import VectorSet from '../model/VectorSet.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VectorAdditionSceneNode from './VectorAdditionSceneNode.js';
import optionize from '../../../../phet-core/js/optionize.js';
import vectorAddition from '../../vectorAddition.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Vector from '../model/Vector.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ArrowOverSymbolNode from './ArrowOverSymbolNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  mouseAreaDilation: Vector2;
  touchAreaDilation: Vector2;
  iconEffectiveWidth: number;
  symbolProperty: TReadOnlyProperty<string>;
};

export type VectorToolboxSlotOptions = SelfOptions & PickRequired<HBoxOptions, 'tandem' | 'accessibleName' | 'accessibleHelpText'>;

export default class VectorToolboxSlot extends InteractiveHighlighting( HBox ) {

  protected constructor( vectors: Vector[], // vectors in the slot
                         getNextVector: () => Vector | null, // Gets the next available vector in the slot.
                         vectorSet: VectorSet<Vector>,
                         modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                         sceneNode: VectorAdditionSceneNode,
                         iconModelComponents: Vector2,
                         providedOptions: VectorToolboxSlotOptions ) {

    // Get the icon's xy-components in view coordinates.
    const iconViewComponents = modelViewTransformProperty.value.modelToViewDelta( iconModelComponents );

    // Create the vector icon.
    const iconNode = VectorAdditionIconFactory.createVectorToolboxIcon( iconViewComponents, vectorSet.vectorColorPalette );

    // Create a fixed-size box for the icon. The icon is placed in an AlignBox to ensure the icon
    // has the same effective width regardless of the initial icon's xy-components. This ensures that
    // the label of the slot is in the same place regardless of the icon size.
    const alignBox = new AlignBox( iconNode, {
      alignBounds: new Bounds2( 0, 0, providedOptions.iconEffectiveWidth, iconNode.height )
    } );

    // Label for the slot, always visible.
    const arrowOverSymbolNode = new ArrowOverSymbolNode( providedOptions.symbolProperty );

    const options = optionize<VectorToolboxSlotOptions, SelfOptions, HBoxOptions>()( {

      // HBoxOptions
      isDisposable: false,
      children: [ alignBox, arrowOverSymbolNode ],
      excludeInvisibleChildrenFromBounds: false,
      cursor: 'move',
      spacing: 5,
      tagName: 'button'
    }, providedOptions );

    super( options );

    // Make the vector easier to grab.
    this.mouseArea = this.localBounds.dilatedXY( providedOptions.mouseAreaDilation.x, providedOptions.mouseAreaDilation.y );
    this.touchArea = this.localBounds.dilatedXY( providedOptions.touchAreaDilation.x, providedOptions.touchAreaDilation.y );

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

    // When a vector from this slot is added to activeVectors, add the listener that handles animating it back to the slot.
    vectorSet.activeVectors.addItemAddedListener( vector => {
      if ( vectors.includes( vector ) ) {

        const animateVectorBackListener = ( animateBack: boolean ) => {
          if ( animateBack ) {

            // Get the model position of the icon node.
            const iconPosition = modelViewTransformProperty.value.viewToModelBounds( sceneNode.boundsOf( iconNode ) ).center;

            // Animate the vector to its icon in the panel.
            vector.animateToPoint( iconPosition, iconModelComponents, () => {
              vectorSet.activeVectors.remove( vector );
              vector.reset();
            } );
          }
        };
        vector.animateBackProperty.link( animateVectorBackListener ); // unlink required when vector is removed

        // Clean up when the vector is removed from activeVectors.
        const vectorRemovedListener = ( removedVector: Vector ) => {
          if ( removedVector === vector ) {
            vector.animateBackProperty.value = false;
            vector.animateBackProperty.unlink( animateVectorBackListener );
            vectorSet.activeVectors.removeItemRemovedListener( vectorRemovedListener );
          }
        };
        vectorSet.activeVectors.addItemRemovedListener( vectorRemovedListener );
      }
    } );
  }
}

vectorAddition.register( 'VectorToolboxSlot', VectorToolboxSlot );
