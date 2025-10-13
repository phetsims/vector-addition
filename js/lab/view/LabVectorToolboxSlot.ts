// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabVectorToolboxSlot is a slot in the vector toolbox for the 'Explore 1D' and 'Explore 2D' screens.
 *
 * A slot creates a Vector when the icon is clicked.
 *
 * Slots can differ in:
 *  - Icon colors and sizes
 *  - Infinite slot versus only one vector per slot
 *  - Having symbols versus not having symbols
 *  - Icon components and initial vector components (e.g. on Explore 1D the initial vectors are horizontal/vertical
 *    while on Explore 2D the vectors are 45 degrees)
 *
 * Implementation of creation of Vectors:
 *  1. Once the icon is clicked, a Vector is made.
 *  2. A call to the VectorAdditionSceneNode is made, passing the created Vector. The Scene Node then creates the subsequent views
 *     for the Vector (VectorNode and VectorComponentNode), layering the views correctly and forwarding the event.
 *  3. Once the Vector indicates the Vector was dropped outside the VectorAdditionScene, the slot will then animate the Vector and
 *     dispose the vector, signaling to the VectorAdditionSceneNode to dispose of the views.
 *
 * @author Brandon Li
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import vectorAddition from '../../vectorAddition.js';
import Vector from '../../common/model/Vector.js';
import ArrowOverSymbolNode from '../../common/view/ArrowOverSymbolNode.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import LabScene from '../model/LabScene.js';
import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LabVectorSet from '../model/LabVectorSet.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';

const ICON_WIDTH = 35; // Effective width of the vector icon.
const ICON_MAGNITUDE = 57; // Magnitude of the vector icon.
const ICON_POINTER_DILATION = new Vector2( 10, 10 );

export default class LabVectorToolboxSlot extends InteractiveHighlighting( HBox ) {

  /**
   * @param scene - the scene for the VectorSect
   * @param vectorSet - the VectorSet that the slot adds Vectors to
   * @param allVectors - complete set of vectors related to vectorSet
   * @param sceneNode - the VectorAdditionSceneNode that this slot appears in
   * @param tandem
   */
  public constructor( scene: LabScene,
                      vectorSet: LabVectorSet,
                      allVectors: Vector[],
                      sceneNode: VectorAdditionSceneNode,
                      tandem: Tandem ) {

    super( {
      isDisposable: false,
      spacing: 5,
      tagName: 'button',
      tandem: tandem
    } );

    // convenience reference
    const modelViewTransform = scene.graph.modelViewTransformProperty.value;
    const initialVectorComponents = scene.initialVectorComponents;

    //----------------------------------------------------------------------------------------
    // Create the icon
    //----------------------------------------------------------------------------------------

    // Get the components in view coordinates.
    const iconViewComponents = modelViewTransform.modelToViewDelta( initialVectorComponents );

    // Create the icon.
    const iconNode = VectorAdditionIconFactory.createVectorCreatorPanelIcon( iconViewComponents,
      vectorSet.vectorColorPalette, ICON_MAGNITUDE );

    // Make the iconNode easier to grab
    iconNode.mouseArea = iconNode.localBounds.dilatedXY( ICON_POINTER_DILATION.x, ICON_POINTER_DILATION.y );
    iconNode.touchArea = iconNode.localBounds.dilatedXY( ICON_POINTER_DILATION.x, ICON_POINTER_DILATION.y );

    // Get the components in model coordinates of the icon. Used to animate the vector to the icon components.
    const iconComponents = modelViewTransform.viewToModelDelta( iconViewComponents
      .normalized().timesScalar( ICON_MAGNITUDE ) );

    // Create a fixed-size box for the icon. The icon is placed in an AlignBox to ensure the icon
    // has the same effective width regardless of the initial vector components. This ensures that
    // the label of the slot is in the same place regardless of the icon size.
    this.addChild( new AlignBox( iconNode, {
      alignBounds: new Bounds2( 0, 0, ICON_WIDTH, iconNode.height )
    } ) );

    //----------------------------------------------------------------------------------------
    // Create the label of the slot
    //----------------------------------------------------------------------------------------

    this.addChild( new ArrowOverSymbolNode( vectorSet.symbolProperty ) );

    //----------------------------------------------------------------------------------------
    // Creation of Vectors via pointer (See 'Implementation' documentation above)
    //----------------------------------------------------------------------------------------

    iconNode.addInputListener( SoundDragListener.createForwardingListener( event => {

      //----------------------------------------------------------------------------------------
      // Step 1: When the icon is clicked, create a new Vector
      //----------------------------------------------------------------------------------------

      // Find where the icon was clicked relative to the scene node, in view coordinates.
      const vectorCenterView = sceneNode.globalToLocalPoint( event.pointer.point );

      // Convert the view coordinates of where the icon was clicked into model coordinates.
      const vectorCenterModel = scene.graph.modelViewTransformProperty.value.viewToModelPosition( vectorCenterView );

      // Calculate where the tail position is relative to the scene node.
      const vectorTailPosition = vectorCenterModel.minus( initialVectorComponents.timesScalar( 0.5 ) );

      // Get the first available vector in the toolbox slot.
      const vector = getFirstAvailableVector( allVectors, vectorSet.activeVectors )!;
      affirm( vector );
      vector.reset();
      vector.tailPositionProperty.value = vectorTailPosition;

      // Add to activeVectors, so that it is included in the sum calculation.
      vectorSet.activeVectors.push( vector );

      //----------------------------------------------------------------------------------------
      // Step 2: A call to the Scene Node is made, passing the created Vector to create the subsequent views
      //----------------------------------------------------------------------------------------

      sceneNode.registerVector( vector, vectorSet, event );

      // Hide the icon when we've reached the numberOfVectors limit
      const slotIsEmpty = ( vectorSet.activeVectors.lengthProperty.value === allVectors.length );
      iconNode.visible = !slotIsEmpty;
      this.focusable = !slotIsEmpty;

      //----------------------------------------------------------------------------------------
      // Step 3: Once the Vector indicates the Vector was dropped outside the VectorAdditionScene, animate and
      // dispose the Vector, signaling to the VectorAdditionSceneNode to dispose of the views.
      //----------------------------------------------------------------------------------------

      const animateVectorBackListener = ( animateBack: boolean ) => {
        if ( animateBack ) {

          // Get the model position of the icon node.
          const iconPosition = scene.graph.modelViewTransformProperty.value.viewToModelBounds( sceneNode.boundsOf( iconNode ) ).center;

          // Animate the vector to its icon in the panel.
          vector.animateToPoint( iconPosition, iconComponents, () => {
            vectorSet.activeVectors.remove( vector );
            vector.reset();
            //TODO https://github.com/phetsims/vector-addition/issues/258 Why is this needed? Without it, fails the 2nd time that a vector is activated.
            vector.animateBackProperty.value = false;
          } );
        }
      };
      vector.animateBackProperty.link( animateVectorBackListener ); // unlink required when vector is removed

      // Clean up when the vector is removed.
      const vectorRemovedListener = ( removedVector: Vector ) => {
        if ( removedVector === vector ) {
          iconNode.visible = true;
          this.focusable = true;
          vector.animateBackProperty.unlink( animateVectorBackListener );
          vectorSet.activeVectors.removeItemRemovedListener( vectorRemovedListener );
        }
      };
      vectorSet.activeVectors.addItemRemovedListener( vectorRemovedListener );
    } ) );
  }
}

/**
 * Gets the first available vector that is not active.
 */
function getFirstAvailableVector( allVectors: Vector[], activeVectors: ObservableArray<Vector> ): Vector | null {
  let availableVector: Vector | null = null;
  for ( let i = 0; i < allVectors.length && availableVector === null; i++ ) {
    const vector = allVectors[ i ];
    if ( !activeVectors.includes( vector ) ) {
      availableVector = vector;
    }
  }
  return availableVector;
}

vectorAddition.register( 'LabVectorToolboxSlot', LabVectorToolboxSlot );