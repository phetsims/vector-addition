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

export default class EquationsPolarScene extends EquationsScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {
    super(
      VectorAdditionStrings.a11y.polarSceneNameStringProperty,
      'polar',
      VectorAdditionColors.EQUATIONS_POLAR_COLOR_PALETTE,
      componentVectorStyleProperty,
      tandem
    );
  }
}

vectorAddition.register( 'EquationsPolarScene', EquationsPolarScene );