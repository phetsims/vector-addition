// Copyright 2025, University of Colorado Boulder

/**
 * LabPolarScene is the polar scene in the 'Lab' screen, with vector sets 'p' and 'q'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import LabScene from './LabScene.js';

export default class LabPolarScene extends LabScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {
    super(
      VectorAdditionStrings.a11y.polarSceneNameStringProperty,
      'polar',
      Vector2.createPolar( 8, toRadians( 45 ) ),
      VectorAdditionSymbols.pStringProperty,
      VectorAdditionSymbols.qStringProperty,
      'p',
      'q',
      VectorAdditionColors.LAB_POLAR_COLOR_PALETTE_1,
      VectorAdditionColors.LAB_POLAR_COLOR_PALETTE_2,
      componentVectorStyleProperty,
      tandem
    );
  }
}

vectorAddition.register( 'LabPolarScene', LabPolarScene );