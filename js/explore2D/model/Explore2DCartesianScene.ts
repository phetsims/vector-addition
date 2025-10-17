// Copyright 2025, University of Colorado Boulder

/**
 * Explore2DCartesianScene is the Cartesian-coordinates scene in the 'Explore 2D' screen, with vectors 'a', 'b', and 'c'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import ExploreScene from '../../common/model/ExploreScene.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import { ExploreVectorDescription } from '../../common/model/ExploreVectorSet.js';

// Properties common to all vectors in this scene.
const TAIL_POSITION = Vector2.ZERO;

// Describes the non-resultant vectors in the vector set for the Cartesian scene.
const CARTESIAN_VECTOR_DESCRIPTIONS: ExploreVectorDescription[] = [

  // a
  {
    symbolProperty: VectorAdditionSymbols.aStringProperty,
    tandemNameSymbol: 'a',
    tailPosition: TAIL_POSITION,
    xyComponents: new Vector2( 6, 8 )
  },

  // b
  {
    symbolProperty: VectorAdditionSymbols.bStringProperty,
    tandemNameSymbol: 'b',
    tailPosition: TAIL_POSITION,
    xyComponents: new Vector2( 8, 6 )
  },

  // c
  {
    symbolProperty: VectorAdditionSymbols.cStringProperty,
    tandemNameSymbol: 'c',
    tailPosition: TAIL_POSITION,
    xyComponents: new Vector2( 0, -10 )
  }
];

export default class Explore2DCartesianScene extends ExploreScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {

    super(
      VectorAdditionStrings.a11y.cartesianSceneNameStringProperty,
      VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS,
      'twoDimensional',
      'cartesian',
      VectorAdditionColors.EXPLORE_2D_CARTESIAN_COLOR_PALETTE,
      CARTESIAN_VECTOR_DESCRIPTIONS,
      componentVectorStyleProperty,
      tandem
    );
  }
}

vectorAddition.register( 'Explore2DCartesianScene', Explore2DCartesianScene );