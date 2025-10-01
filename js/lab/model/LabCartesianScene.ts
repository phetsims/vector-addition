// Copyright 2025, University of Colorado Boulder

/**
 * LabCartesianScene is the Cartesian-coordinates scene in the 'Lab' screen, with vector sets 'u' and 'v'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import LabScene from './LabScene.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class LabCartesianScene extends LabScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {
    super(
      VectorAdditionStrings.a11y.cartesianSceneNameStringProperty,
      'cartesian',
      new Vector2( 8, 6 ),
      VectorAdditionSymbols.vStringProperty,
      VectorAdditionSymbols.uStringProperty,
      'u',
      'v',
      VectorAdditionColors.LAB_CARTESIAN_COLOR_PALETTE_1,
      VectorAdditionColors.LAB_CARTESIAN_COLOR_PALETTE_2,
      componentVectorStyleProperty,
      tandem
    );
  }
}

vectorAddition.register( 'LabCartesianScene', LabCartesianScene );