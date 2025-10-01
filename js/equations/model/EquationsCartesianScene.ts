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

export default class EquationsCartesianScene extends EquationsScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {
    super(
      VectorAdditionStrings.a11y.cartesianSceneNameStringProperty,
      'cartesian',
      VectorAdditionColors.EQUATIONS_CARTESIAN_COLOR_PALETTE,
      componentVectorStyleProperty,
      tandem
    );
  }
}

vectorAddition.register( 'EquationsCartesianScene', EquationsCartesianScene );