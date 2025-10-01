// Copyright 2019-2025, University of Colorado Boulder

//TODO https://github.com/phetsims/vector-addition/issues/258 Lots of duplication with VectorToolboxSlot
/**
 * ExploreVectorToolboxSlot is a slot in the vector toolbox for the 'Explore 1D' screen.
 * In this toolbox, there is 1 instance of each vector, and those vectors exist for the lifetime
 * of the sim. Dragging a vector out of the toolbox added it to the vector set and created the
 * view. Dragging a vector back to the toolbox removes it from the vector set and disposes the view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import vectorAddition from '../../vectorAddition.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import ArrowOverSymbolNode from './ArrowOverSymbolNode.js';
import Vector from '../model/Vector.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import VectorSet from '../model/VectorSet.js';
import VectorAdditionSceneNode from './VectorAdditionSceneNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2 from '../../../../dot/js/Vector2.js';

const ICON_ARROW_MAGNITUDE = 35;

export default class ExploreVectorToolboxSlot extends InteractiveHighlighting( HBox ) {

  public constructor( vector: Vector,
                      scene: VectorAdditionScene,
                      vectorSet: VectorSet,
                      sceneNode: VectorAdditionSceneNode,
                      iconVectorComponents: Vector2 | null,
                      tandem: Tandem ) {
    super( {
      isDisposable: false,
      spacing: 5,
      tagName: 'button',
      tandem: tandem
    } );

    // convenience reference
    const modelViewTransform = scene.graph.modelViewTransformProperty.value;
    const vectorComponents = vector.vectorComponentsProperty.value;

    //----------------------------------------------------------------------------------------
    // Create the icon
    //----------------------------------------------------------------------------------------

    // Get the components in view coordinates.
    const iconViewComponents = modelViewTransform.viewToModelDelta( iconVectorComponents || vectorComponents );

    // Create the icon.
    const iconNode = VectorAdditionIconFactory.createVectorCreatorPanelIcon( iconViewComponents,
      vectorSet.vectorColorPalette, ICON_ARROW_MAGNITUDE );

    // Make the iconNode easier to grab. Use identical dilation for mouseArea and touchArea,
    // see https://github.com/phetsims/vector-addition/issues/250
    const isHorizontal = ( scene.graph.orientation === 'horizontal' );
    const iconPointerAreaXDilation = isHorizontal ? 10 : 20;
    const iconPointerAreaYDilation = isHorizontal ? 15 : 5;
    iconNode.mouseArea = iconNode.localBounds.dilatedXY( iconPointerAreaXDilation, iconPointerAreaYDilation );
    iconNode.touchArea = iconNode.localBounds.dilatedXY( iconPointerAreaXDilation, iconPointerAreaYDilation );

    // Get the components in model coordinates of the icon. Used to animate the vector to the icon components.
    const iconComponents = modelViewTransform.viewToModelDelta( iconViewComponents.normalized().timesScalar( ICON_ARROW_MAGNITUDE ) );

    // Create a fixed-size box for the icon. The Icon is placed in an alignBox to ensure the Icon
    // contains the same local width regardless of the initial vector components. This ensures that
    // the label of the slot is in the same place regardless of the icon size.
    this.addChild( new AlignBox( iconNode, {
      alignBounds: new Bounds2( 0, 0, ICON_ARROW_MAGNITUDE, iconNode.height )
    } ) );

    //----------------------------------------------------------------------------------------
    // Create the label of the slot, which is always visible.
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
      vector.tailPositionProperty.value = vectorCenterModel.minus( vectorComponents.timesScalar( 0.5 ) );

      // Add the vector to the vector set, so that it is included in the sum calculation.
      vectorSet.vectors.push( vector );

      //----------------------------------------------------------------------------------------
      // Step 2: Tell sceneNode to create the view for the vector.
      //----------------------------------------------------------------------------------------

      sceneNode.registerVector( vector, vectorSet, event );

      // Hide the icon.
      iconNode.visible = false;

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
            vectorSet.vectors.remove( vector );
            vector.reset();
            vector.animateBackProperty.value = false;
            iconNode.visible = true;
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

vectorAddition.register( 'ExploreVectorToolboxSlot', ExploreVectorToolboxSlot );