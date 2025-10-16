// Copyright 2025, University of Colorado Boulder

/**
 * EquationsCartesianScene is the Cartesian-coordinates scene in the 'Equations' screen, with vectors a, b, c.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EquationsScene from './EquationsScene.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import { EquationsVectorDescription } from './EquationsVectorSet.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import Vector2 from '../../../../dot/js/Vector2.js';

// Describes the non-resultant vectors for the Cartesian scene.
// See https://github.com/phetsims/vector-addition/issues/227
const CARTESIAN_VECTOR_DESCRIPTIONS: EquationsVectorDescription[] = [

  // a
  {
    symbolProperty: VectorAdditionSymbols.aStringProperty,
    tandemNameSymbol: 'a',
    xyComponents: new Vector2( 0, 5 ),
    vectorTailPosition: new Vector2( 5, 5 ),
    baseVectorTailPosition: new Vector2( 35, 15 )
  },

  // b
  {
    symbolProperty: VectorAdditionSymbols.bStringProperty,
    tandemNameSymbol: 'b',
    xyComponents: new Vector2( 5, 5 ),
    vectorTailPosition: new Vector2( 15, 5 ),
    baseVectorTailPosition: new Vector2( 35, 5 )
  }
];

export default class EquationsCartesianScene extends EquationsScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {
    super(
      VectorAdditionStrings.a11y.cartesianSceneNameStringProperty,
      'cartesian',
      componentVectorStyleProperty,
      VectorAdditionColors.EQUATIONS_CARTESIAN_COLOR_PALETTE,
      CARTESIAN_VECTOR_DESCRIPTIONS,
      VectorAdditionSymbols.cStringProperty,
      'c',
      tandem
    );
  }
}

vectorAddition.register( 'EquationsCartesianScene', EquationsCartesianScene );