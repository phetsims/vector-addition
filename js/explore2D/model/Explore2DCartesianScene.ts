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
import Vector from '../../common/model/Vector.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import ExploreScene from '../../common/model/ExploreScene.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';

export default class Explore2DCartesianScene extends ExploreScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {

    super(
      VectorAdditionStrings.a11y.cartesianSceneNameStringProperty,
      VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS,
      'twoDimensional',
      'cartesian',
      VectorAdditionColors.EXPLORE_2D_CARTESIAN_COLOR_PALETTE,
      createAllVectors,
      componentVectorStyleProperty,
      tandem
    );
  }
}

/**
 * Creates vectors a, b, c.
 */
function createAllVectors( scene: VectorAdditionScene, vectorSet: VectorSet, parentTandem: Tandem ): Vector[] {

  const tailPosition = Vector2.ZERO;

  return [

    // a
    new Vector( tailPosition, new Vector2( 6, 8 ), vectorSet, scene.graph, scene.selectedVectorProperty, scene.coordinateSnapMode, {
      symbolProperty: VectorAdditionSymbols.aStringProperty,
      tandem: parentTandem.createTandem( 'aVector' ),
      tandemNameSymbol: 'a'
    } ),

    // b
    new Vector( tailPosition, new Vector2( 8, 6 ), vectorSet, scene.graph, scene.selectedVectorProperty, scene.coordinateSnapMode, {
      symbolProperty: VectorAdditionSymbols.bStringProperty,
      tandem: parentTandem.createTandem( 'bVector' ),
      tandemNameSymbol: 'b'
    } ),

    // c
    new Vector( tailPosition, new Vector2( 0, -10 ), vectorSet, scene.graph, scene.selectedVectorProperty, scene.coordinateSnapMode, {
      symbolProperty: VectorAdditionSymbols.cStringProperty,
      tandem: parentTandem.createTandem( 'cVector' ),
      tandemNameSymbol: 'c'
    } )
  ];
}

vectorAddition.register( 'Explore2DCartesianScene', Explore2DCartesianScene );