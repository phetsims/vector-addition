// Copyright 2019-2025, University of Colorado Boulder

/**
 * ExploreVectorToolboxSlot is a slot in the vector toolbox for the 'Explore 1D' and 'Explore 2D' screens.
 * In these screens, a slot manages 1 vector instance that is draggable to and from the toolbox.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import vectorAddition from '../../vectorAddition.js';
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

export default class ExploreVectorToolboxSlot extends VectorToolboxSlot {

  public constructor( vector: Vector,
                      vectorSet: VectorSet,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      sceneNode: VectorAdditionSceneNode,
                      iconModelComponents: Vector2,
                      graphOrientation: GraphOrientation,
                      tandem: Tandem ) {

    // Make the iconNode easier to grab. Use identical dilation for mouseArea and touchArea.
    // See https://github.com/phetsims/vector-addition/issues/250
    const iconPointerAreaDilation = ( graphOrientation === 'horizontal' ) ? new Vector2( 10, 15 ) :
                                    ( graphOrientation === 'vertical' ) ? new Vector2( 20, 5 ) :
                                    new Vector2( 15, 10 );
    super(
      [ vector ],
      () => vector,
      vectorSet,
      modelViewTransformProperty,
      sceneNode,
      iconModelComponents, {
        iconEffectiveWidth: 35,
        iconMouseDilation: iconPointerAreaDilation,
        iconTouchDilation: iconPointerAreaDilation,
        symbolProperty: vector.symbolProperty,
        accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.vectorButton.accessibleNameStringProperty, {
          symbol: vector.accessibleSymbolProperty
        } ),
        accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.vectorButton.accessibleHelpTextStringProperty, {
          symbol: vector.accessibleSymbolProperty
        } ),
        tandem: tandem
      } );
  }
}

vectorAddition.register( 'ExploreVectorToolboxSlot', ExploreVectorToolboxSlot );