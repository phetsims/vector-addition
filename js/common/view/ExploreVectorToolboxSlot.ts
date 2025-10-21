// Copyright 2019-2025, University of Colorado Boulder

/**
 * ExploreVectorToolboxSlot is a slot in the vector toolbox for the 'Explore 1D' and 'Explore 2D' screens.
 * In these screens, a slot manages 1 vector instance that is draggable to and from the toolbox.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import vectorAddition from '../../vectorAddition.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
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
import VectorToolboxSlot from './VectorToolboxSlot.js';

// Magnitude of the vector icon.
const ICON_MAGNITUDE = 35;

export default class ExploreVectorToolboxSlot extends VectorToolboxSlot {

  public constructor( vector: Vector,
                      vectorSet: VectorSet,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      sceneNode: VectorAdditionSceneNode,
                      iconVectorComponents: Vector2,
                      graphOrientation: GraphOrientation,
                      tandem: Tandem ) {

    // Get the components in view coordinates.
    const iconViewComponents = modelViewTransformProperty.value.modelToViewDelta( iconVectorComponents );

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
    const alignBox = new AlignBox( iconNode, {
      alignBounds: new Bounds2( 0, 0, ICON_MAGNITUDE, iconNode.height )
    } );

    // Label for the slot, always visible.
    const arrowOverSymbolNode = new ArrowOverSymbolNode( vector.symbolProperty );

    // Get the components in model coordinates of the icon. Used to animate the vector to the icon components.
    const iconComponents = modelViewTransformProperty.value.viewToModelDelta( iconViewComponents
      .normalized().timesScalar( ICON_MAGNITUDE ) );

    super( vectorSet, modelViewTransformProperty, sceneNode, iconNode, iconComponents, {
      children: [ alignBox, arrowOverSymbolNode ],
      accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.vectorButton.accessibleNameStringProperty, {
        symbol: vector.accessibleSymbolProperty
      } ),
      accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.vectorButton.accessibleHelpTextStringProperty, {
        symbol: vector.accessibleSymbolProperty
      } ),
      tandem: tandem
    } );

    // convenience reference
    const xyComponents = vector.xyComponentsProperty.value;

    // Dragging the vector out of the slot.
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

    // Hide the icon and disable focus when all vectors have left the toolbox.
    vectorSet.activeVectors.lengthProperty.link( () => {
      const slotIsEmpty = vectorSet.activeVectors.includes( vector );
      iconNode.visible = !slotIsEmpty;
      this.focusable = !slotIsEmpty;
    } );
  }
}

vectorAddition.register( 'ExploreVectorToolboxSlot', ExploreVectorToolboxSlot );