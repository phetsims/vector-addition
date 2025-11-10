// Copyright 2019-2025, University of Colorado Boulder

/**
 * ExploreVectorToolboxSlot is a slot in the vector toolbox for the 'Explore 1D' and 'Explore 2D' screens.
 * In these screens, a slot manages 1 vector instance that is draggable to and from the toolbox.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import { GraphOrientation } from '../model/GraphOrientation.js';
import Vector from '../model/Vector.js';
import VectorSet from '../model/VectorSet.js';
import VectorAdditionSceneNode from './VectorAdditionSceneNode.js';
import VectorToolboxSlot from './VectorToolboxSlot.js';

export default class ExploreVectorToolboxSlot extends VectorToolboxSlot {

  public constructor( sceneNode: VectorAdditionSceneNode,
                      vector: Vector,
                      vectorSet: VectorSet,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      graphBoundsProperty: TReadOnlyProperty<Bounds2>,
                      iconModelComponents: Vector2, // xy-components of the vector icon, in model coordinates
                      graphOrientation: GraphOrientation,
                      tandem: Tandem ) {

    // Make the vector easier to grab. Use identical dilation for mouseArea and touchArea.
    // See https://github.com/phetsims/vector-addition/issues/250
    const pointerAreaDilation = ( graphOrientation === 'horizontal' ) ? new Vector2( 10, 10 ) :
                                ( graphOrientation === 'vertical' ) ? new Vector2( 10, 5 ) :
                                new Vector2( 10, 10 );

    // Gets the next vector from the toolbox. Since there is only one vector in this slot, it's either that vector or null.
    const getNextVector = () => vectorSet.activeVectors.includes( vector ) ? null : vector;

    super(
      sceneNode,
      [ vector ],
      getNextVector,
      vectorSet,
      modelViewTransformProperty,
      graphBoundsProperty,
      iconModelComponents, {
        iconEffectiveWidth: 35,
        mouseAreaDilation: pointerAreaDilation,
        touchAreaDilation: pointerAreaDilation,
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