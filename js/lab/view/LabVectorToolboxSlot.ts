// Copyright 2019-2025, University of Colorado Boulder

//TODO https://github.com/phetsims/vector-addition/issues/258 Duplication with ExploreVectorToolboxSlot.
/**
 * LabVectorToolboxSlot is a slot in the vector toolbox for the 'Lab' screen. In the Labs screen, each slot
 * corresponds to a vector set, and multiple vectors for that vector set can be dragged to and from the slot.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
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
import Tandem from '../../../../tandem/js/Tandem.js';
import LabVectorSet from '../model/LabVectorSet.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

const ICON_WIDTH = 35; // Effective width of the vector icon.
const ICON_MAGNITUDE = 57; // Magnitude of the vector icon.
const ICON_POINTER_DILATION = new Vector2( 10, 10 );

export default class LabVectorToolboxSlot extends InteractiveHighlighting( HBox ) {

  public constructor( vectorSet: LabVectorSet,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      initialXYComponents: Vector2,
                      sceneNode: VectorAdditionSceneNode,
                      tandem: Tandem ) {

    super( {
      isDisposable: false,
      spacing: 5,
      accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.vectorSetButton.accessibleNameStringProperty, {
        symbol: vectorSet.accessibleSymbolProperty
      } ),
      accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.vectorSetButton.accessibleHelpTextStringProperty, {
        symbol: vectorSet.accessibleSymbolProperty
      } ),
      tagName: 'button',
      tandem: tandem
    } );

    // convenience reference
    const modelViewTransform = modelViewTransformProperty.value;

    //----------------------------------------------------------------------------------------
    // Create the icon
    //----------------------------------------------------------------------------------------

    // Get the components in view coordinates.
    const iconViewComponents = modelViewTransform.modelToViewDelta( initialXYComponents );

    // Create the icon.
    const iconNode = VectorAdditionIconFactory.createVectorToolboxIcon( iconViewComponents,
      vectorSet.vectorColorPalette, ICON_MAGNITUDE );

    // Make the iconNode easier to grab
    iconNode.mouseArea = iconNode.localBounds.dilatedXY( ICON_POINTER_DILATION.x, ICON_POINTER_DILATION.y );
    iconNode.touchArea = iconNode.localBounds.dilatedXY( ICON_POINTER_DILATION.x, ICON_POINTER_DILATION.y );

    // Create a fixed-size box for the icon. The icon is placed in an AlignBox to ensure the icon
    // has the same effective width regardless of the initial xy-components. This ensures that
    // the label of the slot is in the same place regardless of the icon size.
    this.addChild( new AlignBox( iconNode, {
      alignBounds: new Bounds2( 0, 0, ICON_WIDTH, iconNode.height )
    } ) );

    // Add the label to the slot, always visible.
    this.addChild( new ArrowOverSymbolNode( vectorSet.symbolProperty ) );

    //----------------------------------------------------------------------------------------
    // Dragging a vector out of the slot.
    //----------------------------------------------------------------------------------------

    // Get the components in model coordinates of the icon. Used to animate the vector to the icon components.
    const iconComponents = modelViewTransform.viewToModelDelta( iconViewComponents
      .normalized().timesScalar( ICON_MAGNITUDE ) );

    this.addInputListener( SoundDragListener.createForwardingListener( event => {

      // Find where the icon was clicked relative to the scene node, in view coordinates.
      const vectorCenterView = sceneNode.globalToLocalPoint( event.pointer.point );

      // Convert the view coordinates of where the icon was clicked into model coordinates.
      const vectorCenterModel = modelViewTransformProperty.value.viewToModelPosition( vectorCenterView );

      // Calculate where the tail position is relative to the scene node.
      const vectorTailPosition = vectorCenterModel.minus( initialXYComponents.timesScalar( 0.5 ) );

      // Get the first available vector in the toolbox slot.
      const vector = vectorSet.getFirstAvailableVector()!;
      affirm( vector, 'Expected vector to be defined.' );
      vector.reset();
      vector.tailPositionProperty.value = vectorTailPosition;

      // Add to activeVectors, so that it is included in the sum calculation when dropped on the graph.
      vectorSet.activeVectors.push( vector );

      // Tell sceneNode to create the view for the vector.
      sceneNode.registerVector( vector, vectorSet, event );
    } ) );

    //----------------------------------------------------------------------------------------
    // Manage the things that happen when a vector is added to or removed from activeVectors.
    //----------------------------------------------------------------------------------------

    // Hide the icon and disable focus when all vectors have left the toolbox.
    vectorSet.activeVectors.lengthProperty.link( () => {
      const slotIsEmpty = ( vectorSet.activeVectors.lengthProperty.value === vectorSet.allVectors.length );
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

vectorAddition.register( 'LabVectorToolboxSlot', LabVectorToolboxSlot );