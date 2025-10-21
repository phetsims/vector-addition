// Copyright 2019-2025, University of Colorado Boulder

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
import vectorAddition from '../../vectorAddition.js';
import ArrowOverSymbolNode from '../../common/view/ArrowOverSymbolNode.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LabVectorSet from '../model/LabVectorSet.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VectorToolboxSlot from '../../common/view/VectorToolboxSlot.js';

const ICON_WIDTH = 35; // Effective width of the vector icon.
const ICON_MAGNITUDE = 57; // Magnitude of the vector icon.
const ICON_POINTER_DILATION = new Vector2( 10, 10 );

export default class LabVectorToolboxSlot extends VectorToolboxSlot {

  public constructor( vectorSet: LabVectorSet,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      initialXYComponents: Vector2,
                      sceneNode: VectorAdditionSceneNode,
                      tandem: Tandem ) {

    // Get the components in view coordinates.
    const iconViewComponents = modelViewTransformProperty.value.modelToViewDelta( initialXYComponents );

    // Create the icon.
    const iconNode = VectorAdditionIconFactory.createVectorToolboxIcon( iconViewComponents,
      vectorSet.vectorColorPalette, ICON_MAGNITUDE );

    // Make the iconNode easier to grab
    iconNode.mouseArea = iconNode.localBounds.dilatedXY( ICON_POINTER_DILATION.x, ICON_POINTER_DILATION.y );
    iconNode.touchArea = iconNode.localBounds.dilatedXY( ICON_POINTER_DILATION.x, ICON_POINTER_DILATION.y );

    // Create a fixed-size box for the icon. The icon is placed in an AlignBox to ensure the icon
    // has the same effective width regardless of the initial xy-components. This ensures that
    // the label of the slot is in the same place regardless of the icon size.
    const alignBox = new AlignBox( iconNode, {
      alignBounds: new Bounds2( 0, 0, ICON_WIDTH, iconNode.height )
    } );

    // Label for the slot, always visible.
    const arrowOverSymbolNode = new ArrowOverSymbolNode( vectorSet.symbolProperty );

    const getNextVector = () => vectorSet.getFirstAvailableVector();

    super( vectorSet.allVectors, getNextVector, vectorSet, modelViewTransformProperty, sceneNode, iconNode, iconViewComponents, {
      children: [ alignBox, arrowOverSymbolNode ],
      accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.vectorSetButton.accessibleNameStringProperty, {
        symbol: vectorSet.accessibleSymbolProperty
      } ),
      accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.vectorSetButton.accessibleHelpTextStringProperty, {
        symbol: vectorSet.accessibleSymbolProperty
      } ),
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'LabVectorToolboxSlot', LabVectorToolboxSlot );