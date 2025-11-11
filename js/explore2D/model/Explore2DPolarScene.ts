// Copyright 2025, University of Colorado Boulder

/**
 * Explore2DPolarScene is the polar scene in the 'Explore 2D' screen, with vectors 'd', 'e', and 'f'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import ExploreScene from '../../common/model/ExploreScene.js';
import { ExploreVectorDescription } from '../../common/model/ExploreVectorSet.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

// Properties common to all vectors in this scene.
const TAIL_POSITION = Vector2.ZERO;

// Describes the non-resultant vectors in the vector set for the Cartesian scene.
const POLAR_VECTOR_DESCRIPTIONS: ExploreVectorDescription[] = [

  // d
  {
    symbolProperty: VectorAdditionSymbols.dStringProperty,
    tandemNameSymbol: 'd',
    tailPosition: TAIL_POSITION,
    xyComponents: Vector2.createPolar( 8, toRadians( 30 ) )
  },

  // e
  {
    symbolProperty: VectorAdditionSymbols.eStringProperty,
    tandemNameSymbol: 'e',
    tailPosition: TAIL_POSITION,
    xyComponents: Vector2.createPolar( 8, toRadians( 60 ) )
  },

  // f
  {
    symbolProperty: VectorAdditionSymbols.fStringProperty,
    tandemNameSymbol: 'f',
    tailPosition: TAIL_POSITION,
    xyComponents: Vector2.createPolar( 8, toRadians( -90 ) )
  }
];

export class Explore2DPolarScene extends ExploreScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {
    super(
      VectorAdditionStrings.a11y.polarSceneNameStringProperty,
      VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS,
      'twoDimensional',
      'polar',
      VectorAdditionColors.EXPLORE_2D_POLAR_COLOR_PALETTE,
      POLAR_VECTOR_DESCRIPTIONS,
      componentVectorStyleProperty,
      tandem
    );
  }
}

vectorAddition.register( 'Explore2DPolarScene', Explore2DPolarScene );