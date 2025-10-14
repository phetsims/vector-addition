// Copyright 2019-2025, University of Colorado Boulder

//TODO https://github.com/phetsims/vector-addition/issues/258 Lots of duplication with LabVectorToolboxSlot, but important differences!
/**
 * ExploreVectorToolboxSlot is a slot in the vector toolbox for the 'Explore 1D' and 'Explore 2D' screens.
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
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import VectorSet from '../model/VectorSet.js';
import VectorAdditionSceneNode from './VectorAdditionSceneNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2 from '../../../../dot/js/Vector2.js';

// Magnitude of the vector icon.
const ICON_MAGNITUDE = 35;

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
    const xyComponents = vector.xyComponentsProperty.value;

    //----------------------------------------------------------------------------------------
    // Create the icon
    //----------------------------------------------------------------------------------------

    // Get the components in view coordinates.
    const iconViewComponents = modelViewTransform.modelToViewDelta( iconVectorComponents || xyComponents );

    // Create the icon.
    const iconNode = VectorAdditionIconFactory.createVectorToolboxIcon( iconViewComponents,
      vectorSet.vectorColorPalette, ICON_MAGNITUDE );

    // Make the iconNode easier to grab. Use identical dilation for mouseArea and touchArea.
    // See https://github.com/phetsims/vector-addition/issues/250
    const iconPointerAreaDilation = ( scene.graph.orientation === 'horizontal' ) ? new Vector2( 10, 15 ) :
                                    ( scene.graph.orientation === 'vertical' ) ? new Vector2( 20, 5 ) :
                                    new Vector2( 15, 10 );
    iconNode.mouseArea = iconNode.localBounds.dilatedXY( iconPointerAreaDilation.x, iconPointerAreaDilation.y );
    iconNode.touchArea = iconNode.localBounds.dilatedXY( iconPointerAreaDilation.x, iconPointerAreaDilation.y );

    // Get the components in model coordinates of the icon. Used to animate the vector to the icon components.
    const iconComponents = modelViewTransform.viewToModelDelta( iconViewComponents.normalized().timesScalar( ICON_MAGNITUDE ) );

    // Create a fixed-size box for the icon. The icon is placed in an AlignBox to ensure the icon
    // has the same effective width regardless of the initial xy-components. This ensures that
    // the label of the slot is in the same place regardless of the icon size.
    this.addChild( new AlignBox( iconNode, {
      alignBounds: new Bounds2( 0, 0, ICON_MAGNITUDE, iconNode.height )
    } ) );

    //----------------------------------------------------------------------------------------
    // Create the label of the slot, which is always visible.
    //----------------------------------------------------------------------------------------

    this.addChild( new ArrowOverSymbolNode( vector.symbolProperty ) );

    //----------------------------------------------------------------------------------------
    // Dragging the vector out of the slot.
    //----------------------------------------------------------------------------------------

    iconNode.addInputListener( SoundDragListener.createForwardingListener( event => {

      //----------------------------------------------------------------------------------------
      // Step 1: When the icon is clicked, move the vector to vectorSet, so that it participates
      // in calculation of the sum.
      //----------------------------------------------------------------------------------------

      // Find where the icon was clicked relative to the scene node, in view coordinates.
      const vectorCenterView = sceneNode.globalToLocalPoint( event.pointer.point );

      // Convert the view coordinates of where the icon was clicked into model coordinates.
      const vectorCenterModel = scene.graph.modelViewTransformProperty.value.viewToModelPosition( vectorCenterView );

      // Calculate where the tail position is relative to the scene node.
      vector.tailPositionProperty.value = vectorCenterModel.minus( xyComponents.timesScalar( 0.5 ) );

      // Add to activeVectors, so that it is included in the sum calculation.
      vectorSet.activeVectors.push( vector );

      //----------------------------------------------------------------------------------------
      // Step 2: Tell sceneNode to create the view for the vector.
      //----------------------------------------------------------------------------------------

      sceneNode.registerVector( vector, vectorSet, event );

      // Hide the icon.
      iconNode.visible = false;
      this.focusable = false;

      //----------------------------------------------------------------------------------------
      // Step 3: When the vector is dropped outside the graph, animate back to the slot, and
      // remove the vector from vectorSet, signaling to sceneNode to dispose of the view.
      //----------------------------------------------------------------------------------------

      const animateVectorBackListener = ( animateBack: boolean ) => {
        if ( animateBack ) {

          // Get the model position of the icon node.
          const iconPosition = scene.graph.modelViewTransformProperty.value.viewToModelBounds( sceneNode.boundsOf( iconNode ) ).center;

          // Animate the vector to its icon in the panel, then remove it from activeVectors.
          vector.animateToPoint( iconPosition, iconComponents, () => {
            vectorSet.activeVectors.remove( vector );
            vector.reset();
            //TODO https://github.com/phetsims/vector-addition/issues/258 animateBackProperty is being set in animateBackProperty listener
            vector.animateBackProperty.value = false;
          } );
        }
      };
      vector.animateBackProperty.link( animateVectorBackListener ); // unlink required when vector is removed

      // Clean up when the vector is removed from activeVectors.
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

vectorAddition.register( 'ExploreVectorToolboxSlot', ExploreVectorToolboxSlot );