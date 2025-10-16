// Copyright 2025, University of Colorado Boulder

/**
 * EquationsPolarScene is the polar-coordinates scene in the 'Equations' screen, with vectors d, e, f.
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
import { toRadians } from '../../../../dot/js/util/toRadians.js';

// Describes the non-resultant vectors for the polar scene.
// See https://github.com/phetsims/vector-addition/issues/227
const POLAR_VECTOR_DESCRIPTIONS: EquationsVectorDescription[] = [

  // d
  {
    symbolProperty: VectorAdditionSymbols.dStringProperty,
    tandemNameSymbol: 'd',
    vectorTailPosition: new Vector2( 5, 5 ),
    baseVectorTailPosition: new Vector2( 35, 15 ),
    baseVectorXYComponents: Vector2.createPolar( 5, 0 )
  },

  // e
  {
    symbolProperty: VectorAdditionSymbols.eStringProperty,
    tandemNameSymbol: 'e',
    vectorTailPosition: new Vector2( 15, 5 ),
    baseVectorTailPosition: new Vector2( 35, 5 ),
    baseVectorXYComponents: Vector2.createPolar( 8, toRadians( 45 ) )
  }
];

export default class EquationsPolarScene extends EquationsScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {
    super(
      VectorAdditionStrings.a11y.polarSceneNameStringProperty,
      'polar',
      componentVectorStyleProperty,
      VectorAdditionColors.EQUATIONS_POLAR_COLOR_PALETTE,
      POLAR_VECTOR_DESCRIPTIONS,
      VectorAdditionSymbols.fStringProperty,
      'f',
      tandem
    );
  }
}

vectorAddition.register( 'EquationsPolarScene', EquationsPolarScene );