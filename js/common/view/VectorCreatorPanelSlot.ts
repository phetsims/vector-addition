// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorCreatorPanelSlot is a single 'slot' on the VectorCreatorPanel.
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

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import vectorAddition from '../../vectorAddition.js';
import Vector from '../model/Vector.js';
import VectorSet from '../model/VectorSet.js';
import ArrowOverSymbolNode from './ArrowOverSymbolNode.js';
import VectorAdditionSceneNode from './VectorAdditionSceneNode.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

// The fixed-width of the parent of the icon. The Icon is placed in an alignBox to ensure the Icon
// contains the same local width regardless of the initial vector components. This ensures that
// the label of the slot is in the same place regardless of the icon size.
const ARROW_ICON_CONTAINER_WIDTH = 35;

type SelfOptions = {
  symbolProperty?: TReadOnlyProperty<string> | null; // the symbol to pass to created vectors
  numberOfVectors?: number;  // the number of vectors that can exist that were created by this slot
  iconArrowMagnitude?: number; // the magnitude of the icon in view coordinates
  iconVectorComponents?: Vector2 | null; // used for vector icon, defaults to initialVectorComponents

  // pointer area dilation for icons, identical for mouseArea and touchArea,
  // see https://github.com/phetsims/vector-addition/issues/250
  iconPointerAreaXDilation?: number;
  iconPointerAreaYDilation?: number;
};

type VectorCreatorPanelSlotOptions = SelfOptions & PickRequired<HBox, 'tandem'>;

export default class VectorCreatorPanelSlot extends InteractiveHighlighting( HBox ) {

  /**
   * @param scene - the scene for the VectorSect
   * @param vectorSet - the VectorSet that the slot adds Vectors to
   * @param sceneNode - the VectorAdditionSceneNode that this slot appears in
   * @param initialVectorComponents - the initial vector components to pass to created vectors
   * @param providedOptions
   */
  public constructor( scene: VectorAdditionScene,
                      vectorSet: VectorSet,
                      sceneNode: VectorAdditionSceneNode,
                      initialVectorComponents: Vector2,
                      providedOptions: VectorCreatorPanelSlotOptions ) {

    const options = optionize<VectorCreatorPanelSlotOptions, SelfOptions, HBoxOptions>()( {

      // SelfOptions
      symbolProperty: null,
      numberOfVectors: 1,
      iconArrowMagnitude: 30,
      iconVectorComponents: null,
      iconPointerAreaXDilation: 10,
      iconPointerAreaYDilation: 10,

      // HBoxOptions
      isDisposable: false,
      spacing: 5,
      tagName: 'button'
    }, providedOptions );

    super( options );

    // convenience reference
    const modelViewTransform = scene.graph.modelViewTransformProperty.value;

    //----------------------------------------------------------------------------------------
    // Create the icon
    //----------------------------------------------------------------------------------------

    // Get the components in view coordinates.
    const iconViewComponents = modelViewTransform.viewToModelDelta( options.iconVectorComponents || initialVectorComponents );

    // Create the icon.
    const iconNode = VectorAdditionIconFactory.createVectorCreatorPanelIcon( iconViewComponents,
      vectorSet.vectorColorPalette, options.iconArrowMagnitude );

    // Make the iconNode easier to grab
    iconNode.mouseArea = iconNode.localBounds.dilatedXY( options.iconPointerAreaXDilation, options.iconPointerAreaYDilation );
    iconNode.touchArea = iconNode.localBounds.dilatedXY( options.iconPointerAreaXDilation, options.iconPointerAreaYDilation );

    // Get the components in model coordinates of the icon. Used to animate the vector to the icon components.
    const iconComponents = modelViewTransform.viewToModelDelta( iconViewComponents
      .normalized().timesScalar( options.iconArrowMagnitude ) );

    // Create a fixed-size box for the icon. The Icon is placed in an alignBox to ensure the Icon
    // contains the same local width regardless of the initial vector components. This ensures that
    // the label of the slot is in the same place regardless of the icon size.
    this.addChild( new AlignBox( iconNode, {
      alignBounds: new Bounds2( 0, 0, ARROW_ICON_CONTAINER_WIDTH, iconNode.height )
    } ) );

    //----------------------------------------------------------------------------------------
    // Create the label of the slot
    //----------------------------------------------------------------------------------------

    if ( options.symbolProperty ) {
      this.addChild( new ArrowOverSymbolNode( options.symbolProperty ) );
    }

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

      // Create the Vector.
      const vector = new Vector( vectorTailPosition, initialVectorComponents, scene, vectorSet, options.symbolProperty );

      vectorSet.vectors.push( vector );

      //----------------------------------------------------------------------------------------
      // Step 2: A call to the Scene Node is made, passing the created Vector to create the subsequent views
      //----------------------------------------------------------------------------------------

      sceneNode.registerVector( vector, vectorSet, event );

      // Hide the icon when we've reached the numberOfVectors limit
      iconNode.visible = ( vectorSet.vectors.lengthProperty.value < options.numberOfVectors );

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
            vectorSet.vectors.remove( vector );
            vector.dispose();
          } );
        }
      };
      vector.animateBackProperty.link( animateVectorBackListener ); // unlink required when vector is removed

      // Observe when the vector is removed and clean up.
      const removeVectorListener = ( removedVector: Vector ) => {
        if ( removedVector === vector ) {
          iconNode.visible = true;
          vector.animateBackProperty.unlink( animateVectorBackListener );
          vectorSet.vectors.removeItemRemovedListener( removeVectorListener );
        }
      };
      vectorSet.vectors.addItemRemovedListener( removeVectorListener );
    } ) );
  }
}

vectorAddition.register( 'VectorCreatorPanelSlot', VectorCreatorPanelSlot );