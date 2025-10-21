// Copyright 2019-2025, University of Colorado Boulder

/**
 * ExploreVectorToolboxSlot is a slot in the vector toolbox for the 'Explore 1D' and 'Explore 2D' screens.
 * In these screens, a slot manages 1 vector instance that is draggable to and from the toolbox.
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
import VectorSet from '../model/VectorSet.js';
import VectorAdditionSceneNode from './VectorAdditionSceneNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { GraphOrientation } from '../model/GraphOrientation.js';

// Magnitude of the vector icon.
const ICON_MAGNITUDE = 35;

export default class ExploreVectorToolboxSlot extends InteractiveHighlighting( HBox ) {

  public constructor( vector: Vector,
                      vectorSet: VectorSet,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      sceneNode: VectorAdditionSceneNode,
                      iconVectorComponents: Vector2,
                      graphOrientation: GraphOrientation,
                      tandem: Tandem ) {
    super( {
      isDisposable: false,
      spacing: 5,
      tagName: 'button',
      accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.vectorButton.accessibleNameStringProperty, {
        symbol: vector.accessibleSymbolProperty
      } ),
      accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.vectorButton.accessibleHelpTextStringProperty, {
        symbol: vector.accessibleSymbolProperty
      } ),
      tandem: tandem
    } );

    // convenience reference
    const modelViewTransform = modelViewTransformProperty.value;
    const xyComponents = vector.xyComponentsProperty.value;

    //----------------------------------------------------------------------------------------
    // Create the icon
    //----------------------------------------------------------------------------------------

    // Get the components in view coordinates.
    const iconViewComponents = modelViewTransform.modelToViewDelta( iconVectorComponents );

    // Create the icon.
    const iconNode = VectorAdditionIconFactory.createVectorToolboxIcon( iconViewComponents,
      vectorSet.vectorColorPalette, ICON_MAGNITUDE );

    // Make the iconNode easier to grab. Use identical dilation for mouseArea and touchArea.
    // See https://github.com/phetsims/vector-addition/issues/250
    const iconPointerAreaDilation = ( graphOrientation === 'horizontal' ) ? new Vector2( 10, 15 ) :
                                    ( graphOrientation === 'vertical' ) ? new Vector2( 20, 5 ) :
                                    new Vector2( 15, 10 );
    iconNode.mouseArea = iconNode.localBounds.dilatedXY( iconPointerAreaDilation.x, iconPointerAreaDilation.y );
    iconNode.touchArea = iconNode.localBounds.dilatedXY( iconPointerAreaDilation.x, iconPointerAreaDilation.y );

    // Create a fixed-size box for the icon. The icon is placed in an AlignBox to ensure the icon
    // has the same effective width regardless of the initial xy-components. This ensures that
    // the label of the slot is in the same place regardless of the icon size.
    this.addChild( new AlignBox( iconNode, {
      alignBounds: new Bounds2( 0, 0, ICON_MAGNITUDE, iconNode.height )
    } ) );

    // Add the label to the slot, always visible.
    this.addChild( new ArrowOverSymbolNode( vector.symbolProperty ) );

    //----------------------------------------------------------------------------------------
    // Dragging the vector out of the slot.
    //----------------------------------------------------------------------------------------

    // Get the components in model coordinates of the icon. Used to animate the vector to the icon components.
    const iconComponents = modelViewTransform.viewToModelDelta( iconViewComponents.normalized().timesScalar( ICON_MAGNITUDE ) );

    this.addInputListener( SoundDragListener.createForwardingListener( event => {

      // Find where the icon was clicked relative to the scene node, in view coordinates.
      const vectorCenterView = sceneNode.globalToLocalPoint( event.pointer.point );

      // Convert the view coordinates of where the icon was clicked into model coordinates.
      const vectorCenterModel = modelViewTransformProperty.value.viewToModelPosition( vectorCenterView );

      // Calculate where the tail position is relative to the scene node.
      vector.tailPositionProperty.value = vectorCenterModel.minus( xyComponents.timesScalar( 0.5 ) );

      // Add to activeVectors, so that it is included in the sum calculation when dropped on the graph.
      vectorSet.activeVectors.push( vector );

      // Tell sceneNode to create the view for the vector.
      sceneNode.registerVector( vector, vectorSet, event );
    } ) );

    //----------------------------------------------------------------------------------------
    // Manage the things that happen when the vector is added to or removed from activeVectors.
    //----------------------------------------------------------------------------------------

    // Hide the icon and disable focus when all vectors have left the toolbox.
    vectorSet.activeVectors.lengthProperty.link( () => {
      const slotIsEmpty = vectorSet.activeVectors.includes( vector );
      iconNode.visible = !slotIsEmpty;
      this.focusable = !slotIsEmpty;
    } );

    // When a vector is added to the activeVectors, add the listener that handles animating it back to the toolbox.
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
      vector.animateBackProperty.link( animateVectorBackListener ); // unlink required when vector is removed

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

vectorAddition.register( 'ExploreVectorToolboxSlot', ExploreVectorToolboxSlot );