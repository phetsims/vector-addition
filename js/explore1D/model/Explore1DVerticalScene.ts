// Copyright 2025, University of Colorado Boulder

/**
 * Explore1DVerticalScene is the vertical scene in the 'Explore 1D' screen, with vectors 'd', 'e', and 'f'.
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
const XY_COMPONENTS = new Vector2( 0, 5 ); // vertical vector

// Describes the non-resultant vectors in the vector set for the horizontal scene.
const VERTICAL_VECTOR_DESCRIPTIONS: ExploreVectorDescription[] = [

  // d
  {
    symbolProperty: VectorAdditionSymbols.dStringProperty,
    tandemNameSymbol: 'd',
    tailPosition: TAIL_POSITION,
    xyComponents: XY_COMPONENTS
  },

  // e
  {
    symbolProperty: VectorAdditionSymbols.eStringProperty,
    tandemNameSymbol: 'e',
    tailPosition: TAIL_POSITION,
    xyComponents: XY_COMPONENTS
  },

  // f
  {
    symbolProperty: VectorAdditionSymbols.fStringProperty,
    tandemNameSymbol: 'f',
    tailPosition: TAIL_POSITION,
    xyComponents: XY_COMPONENTS
  }
];

export default class Explore1DVerticalScene extends ExploreScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      graphBounds: Bounds2,
                      tandem: Tandem ) {

    super(
      VectorAdditionStrings.a11y.verticalSceneNameStringProperty,
      graphBounds,
      'vertical',
      'cartesian',
      VectorAdditionColors.EXPLORE_1D_VERTICAL_COLOR_PALETTE,
      VERTICAL_VECTOR_DESCRIPTIONS,
      componentVectorStyleProperty,
      tandem
    );
  }
}

vectorAddition.register( 'Explore1DVerticalScene', Explore1DVerticalScene );