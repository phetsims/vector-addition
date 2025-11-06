// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabVectorToolboxSlot is a slot in the vector toolbox for the 'Lab' screen. In the Labs screen, each slot
 * corresponds to a vector set, and multiple vectors for that vector set can be dragged to and from the slot.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import { VectorToolboxSlot } from '../../common/view/VectorToolboxSlot.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import LabVectorSet from '../model/LabVectorSet.js';

// xy-components for the vector icons, in model coordinates.
const ICON_XY_COMPONENTS = new Vector2( 3.2, 2.5 );

// Use identical dilation for mouseArea and touchArea.
const POINTER_AREA_DILATION = new Vector2( 10, 10 );

export default class LabVectorToolboxSlot extends VectorToolboxSlot {

  public constructor( vectorSet: LabVectorSet,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      graphBoundsProperty: TReadOnlyProperty<Bounds2>,
                      sceneNode: VectorAdditionSceneNode,
                      tandem: Tandem ) {
    super(
      vectorSet.allVectors,
      () => vectorSet.getFirstAvailableVector(),
      vectorSet,
      modelViewTransformProperty,
      graphBoundsProperty,
      sceneNode,
      ICON_XY_COMPONENTS, {
        iconEffectiveWidth: 45,
        mouseAreaDilation: POINTER_AREA_DILATION,
        touchAreaDilation: POINTER_AREA_DILATION,
        symbolProperty: vectorSet.symbolProperty,
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