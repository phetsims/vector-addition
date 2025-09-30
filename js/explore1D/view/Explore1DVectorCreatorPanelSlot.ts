// Copyright 2025, University of Colorado Boulder

//TODO https://github.com/phetsims/vector-addition/issues/258 Lots of duplication with VectorCreatorPanelSlot
/**
 * Explore1DVectorCreatorPanelSlot is a slot in the vector toolbox for the 'Explore 1D' screen.
 * In this toolbox, there is 1 instance of each vector, and those vectors exist for the lifetime
 * of the sim. Dragging a vector out of the toolbox added it to the vector set and created the
 * view. Dragging a vector back to the toolbox removes it from the vector set and disposes the view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import vectorAddition from '../../vectorAddition.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import ArrowOverSymbolNode from '../../common/view/ArrowOverSymbolNode.js';
import Vector from '../../common/model/Vector.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';

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

type Explore1DVectorCreatorPanelSlotOptions = SelfOptions & PickRequired<HBox, 'tandem'>;

export default class Explore1DVectorCreatorPanelSlot extends InteractiveHighlighting( HBox ) {

  /**
   * @param vector - the vector to be dragged in and out of the slot
   * @param scene - the scene for the VectorSect
   * @param vectorSet - the VectorSet that the vector is associated with
   * @param sceneNode - the VectorAdditionSceneNode that this slot appears in
   * @param initialVectorComponents - the initial vector components to set when vector is dragged out of the slot
   * @param providedOptions
   */
  public constructor( vector: Vector,
                      scene: VectorAdditionScene,
                      vectorSet: VectorSet,
                      sceneNode: VectorAdditionSceneNode,
                      initialVectorComponents: Vector2,
                      providedOptions: Explore1DVectorCreatorPanelSlotOptions ) {

    const options = optionize<Explore1DVectorCreatorPanelSlotOptions, SelfOptions, HBoxOptions>()( {

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

    const symbolProperty = vector.symbolProperty!;
    affirm( symbolProperty );
    this.addChild( new ArrowOverSymbolNode( symbolProperty ) );

    //----------------------------------------------------------------------------------------
    // Dragging the vector out of the slot.
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

      // Set the vector's initial position
      vector.vectorComponentsProperty.value = initialVectorComponents;
      vector.tailPositionProperty.value = vectorTailPosition;

      // Add the vector to the vector set, so that it is included in the sum calculation.
      vectorSet.vectors.push( vector );

      //----------------------------------------------------------------------------------------
      // Step 2: Tell sceneNode to create the view for the vector.
      //----------------------------------------------------------------------------------------

      sceneNode.registerVector( vector, vectorSet, event );

      // Hide the icon when we've reached the numberOfVectors limit
      iconNode.visible = ( vectorSet.vectors.lengthProperty.value < options.numberOfVectors );

      //----------------------------------------------------------------------------------------
      // Step 3: When the vector is dropped outside the graph, animate back to the slot, and
      // remove the vector from vectorSet, signaling to sceneNode to dispose of the view.
      //----------------------------------------------------------------------------------------

      const animateVectorBackListener = ( animateBack: boolean ) => {
        if ( animateBack ) {

          // Get the model position of the icon node.
          const iconPosition = scene.graph.modelViewTransformProperty.value.viewToModelBounds( sceneNode.boundsOf( iconNode ) ).center;

          // Animate the vector to its icon in the panel, then remove it from vectorSet.
          vector.animateToPoint( iconPosition, iconComponents, () => {
            vector.animateBackProperty.value = false;
            vectorSet.vectors.remove( vector );
            // Do not dispose of vector! Vectors in the Explore 1D screen exist for the lifetime of the sim.
          } );
        }
      };
      vector.animateBackProperty.link( animateVectorBackListener ); // unlink required when vector is removed

      // Clean up when the vector is removed from vectorSet.
      const vectorRemovedListener = ( removedVector: Vector ) => {
        if ( removedVector === vector ) {
          iconNode.visible = true;
          vector.animateBackProperty.unlink( animateVectorBackListener );
          vectorSet.vectors.removeItemRemovedListener( vectorRemovedListener );
        }
      };
      vectorSet.vectors.addItemRemovedListener( vectorRemovedListener );
    } ) );
  }
}

vectorAddition.register( 'Explore1DVectorCreatorPanelSlot', Explore1DVectorCreatorPanelSlot );