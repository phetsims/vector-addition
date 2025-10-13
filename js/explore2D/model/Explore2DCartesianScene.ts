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
import Explore2DScene from './Explore2DScene.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';

export default class Explore2DCartesianScene extends Explore2DScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {

    super(
      VectorAdditionStrings.a11y.cartesianSceneNameStringProperty,
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

  const initialPosition = Vector2.ZERO;

  return [

    // a
    new Vector( initialPosition, new Vector2( 6, 8 ), scene, vectorSet, VectorAdditionSymbols.aStringProperty, {
      isDisposable: false,
      tandem: parentTandem.createTandem( 'aVector' ),
      tandemNameSymbol: 'a'
    } ),

    // b
    new Vector( initialPosition, new Vector2( 8, 6 ), scene, vectorSet, VectorAdditionSymbols.bStringProperty, {
      isDisposable: false,
      tandem: parentTandem.createTandem( 'bVector' ),
      tandemNameSymbol: 'b'
    } ),

    // c
    new Vector( initialPosition, new Vector2( 0, -10 ), scene, vectorSet, VectorAdditionSymbols.cStringProperty, {
      isDisposable: false,
      tandem: parentTandem.createTandem( 'cVector' ),
      tandemNameSymbol: 'c'
    } )
  ];
}

vectorAddition.register( 'Explore2DCartesianScene', Explore2DCartesianScene );