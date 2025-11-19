// Copyright 2025, University of Colorado Boulder

/**
 * Explore1DHorizontalScene is the horizontal scene in the 'Explore 1D' screen, with vectors 'a', 'b', and 'c'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import ExploreScene from '../../common/model/ExploreScene.js';
import { ExploreVectorDescription } from '../../common/model/ExploreVectorSet.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

// Properties common to all vectors in this scene.
const TAIL_POSITION = Vector2.ZERO;

// TODO: CM: Question: Due to the difficulty of inspection to make sure this is never accidentally mutated, and the fact
// that it is shared to multiple clients, should we make this an ImmutableVector2? see https://github.com/phetsims/vector-addition/issues/376
const XY_COMPONENTS = new Vector2( 5, 0 ); // horizontal vector

// Describes the non-resultant vectors in the vector set for the horizontal scene.
const HORIZONTAL_VECTOR_DESCRIPTIONS: ExploreVectorDescription[] = [

  // a
  {
    symbolProperty: VectorAdditionSymbols.aStringProperty,
    tandemNameSymbol: 'a',
    tailPosition: TAIL_POSITION,
    xyComponents: XY_COMPONENTS
  },

  // b
  {
    symbolProperty: VectorAdditionSymbols.bStringProperty,
    tandemNameSymbol: 'b',
    tailPosition: TAIL_POSITION,
    xyComponents: XY_COMPONENTS
  },

  // c
  {
    symbolProperty: VectorAdditionSymbols.cStringProperty,
    tandemNameSymbol: 'c',
    tailPosition: TAIL_POSITION,
    xyComponents: XY_COMPONENTS
  }
];

export default class Explore1DHorizontalScene extends ExploreScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      graphBounds: Bounds2,
                      tandem: Tandem ) {

    super(
      VectorAdditionStrings.a11y.horizontalSceneNameStringProperty,
      graphBounds,
      'horizontal',
      'cartesian',
      VectorAdditionColors.EXPLORE_1D_HORIZONTAL_COLOR_PALETTE,
      HORIZONTAL_VECTOR_DESCRIPTIONS,
      componentVectorStyleProperty,
      tandem
    );
  }
}

vectorAddition.register( 'Explore1DHorizontalScene', Explore1DHorizontalScene );