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

  const initialPosition = Vector2.ZERO;

  return [

    // d
    new Vector( initialPosition, Vector2.createPolar( 8, toRadians( 30 ) ), scene, vectorSet, VectorAdditionSymbols.dStringProperty, {
      isDisposable: false,
      tandem: parentTandem.createTandem( 'dVector' ),
      tandemNameSymbol: 'd'
    } ),

    // e
    new Vector( initialPosition, Vector2.createPolar( 8, toRadians( 60 ) ), scene, vectorSet, VectorAdditionSymbols.eStringProperty, {
      isDisposable: false,
      tandem: parentTandem.createTandem( 'eVector' ),
      tandemNameSymbol: 'e'
    } ),

    // f
    new Vector( initialPosition, Vector2.createPolar( 8, toRadians( -90 ) ), scene, vectorSet, VectorAdditionSymbols.fStringProperty, {
      isDisposable: false,
      tandem: parentTandem.createTandem( 'fVector' ),
      tandemNameSymbol: 'f'
    } )
  ];
}

vectorAddition.register( 'Explore2DPolarScene', Explore2DPolarScene );