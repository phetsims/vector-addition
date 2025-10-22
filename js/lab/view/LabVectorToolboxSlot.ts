// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabVectorToolboxSlot is a slot in the vector toolbox for the 'Lab' screen. In the Labs screen, each slot
 * corresponds to a vector set, and multiple vectors for that vector set can be dragged to and from the slot.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LabVectorSet from '../model/LabVectorSet.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VectorToolboxSlot from '../../common/view/VectorToolboxSlot.js';

const ICON_POINTER_DILATION = new Vector2( 10, 10 );

export default class LabVectorToolboxSlot extends VectorToolboxSlot {

  public constructor( vectorSet: LabVectorSet,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      iconModelComponents: Vector2,
                      sceneNode: VectorAdditionSceneNode,
                      tandem: Tandem ) {
    super(
      vectorSet.allVectors,
      () => vectorSet.getFirstAvailableVector(),
      vectorSet,
      modelViewTransformProperty,
      sceneNode,
      iconModelComponents, {
        iconEffectiveWidth: 45,
        iconMouseDilation: ICON_POINTER_DILATION,
        iconTouchDilation: ICON_POINTER_DILATION,
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