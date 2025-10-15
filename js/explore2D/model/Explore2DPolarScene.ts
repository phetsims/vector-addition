// Copyright 2025, University of Colorado Boulder

/**
 * Explore2DPolarScene is the polar-coordinates scene in the 'Explore 2D' screen, with vectors 'd', 'e', and 'f'.
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
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import ExploreScene from '../../common/model/ExploreScene.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';

export class Explore2DPolarScene extends ExploreScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {
    super(
      VectorAdditionStrings.a11y.polarSceneNameStringProperty,
      VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS,
      'twoDimensional',
      'polar',
      VectorAdditionColors.EXPLORE_2D_POLAR_COLOR_PALETTE,
      createAllVectors,
      componentVectorStyleProperty,
      tandem
    );
  }
}

/**
 * Creates vectors d, e, f.
 */
function createAllVectors( scene: VectorAdditionScene, vectorSet: VectorSet, parentTandem: Tandem ): Vector[] {

  const tailPosition = Vector2.ZERO;

  return [

    // d
    new Vector( tailPosition, Vector2.createPolar( 8, toRadians( 30 ) ), vectorSet, scene.graph, scene.selectedVectorProperty, {
      symbolProperty: VectorAdditionSymbols.dStringProperty,
      coordinateSnapMode: scene.coordinateSnapMode,
      tandem: parentTandem.createTandem( 'dVector' ),
      tandemNameSymbol: 'd'
    } ),

    // e
    new Vector( tailPosition, Vector2.createPolar( 8, toRadians( 60 ) ), vectorSet, scene.graph, scene.selectedVectorProperty, {
      symbolProperty: VectorAdditionSymbols.eStringProperty,
      coordinateSnapMode: scene.coordinateSnapMode,
      tandem: parentTandem.createTandem( 'eVector' ),
      tandemNameSymbol: 'e'
    } ),

    // f
    new Vector( tailPosition, Vector2.createPolar( 8, toRadians( -90 ) ), vectorSet, scene.graph, scene.selectedVectorProperty, {
      symbolProperty: VectorAdditionSymbols.fStringProperty,
      coordinateSnapMode: scene.coordinateSnapMode,
      tandem: parentTandem.createTandem( 'fVector' ),
      tandemNameSymbol: 'f'
    } )
  ];
}

vectorAddition.register( 'Explore2DPolarScene', Explore2DPolarScene );