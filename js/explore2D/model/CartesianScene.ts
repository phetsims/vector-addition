// Copyright 2025, University of Colorado Boulder

/**
 * CartesianScene is the Cartesian-coordinates scene in the 'Explore 2D' screen, with vectors 'a', 'b', and 'c'.
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

export default class CartesianScene extends Explore2DScene {

  // abstract in the base class
  public override readonly vectors: Vector[];

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {

    super( VectorAdditionStrings.a11y.cartesianSceneNameStringProperty, 'cartesian', componentVectorStyleProperty,
      VectorAdditionColors.EXPLORE_2D_CARTESIAN_COLOR_PALETTE, tandem );

    const initialPosition = Vector2.ZERO;
    const parentTandem = this.vectorSet.tandem;

    this.vectors = [

      // a
      new Vector( initialPosition, new Vector2( 6, 8 ), this, this.vectorSet, VectorAdditionSymbols.aStringProperty, {
        isDisposable: false,
        tandem: parentTandem.createTandem( 'aVector' ),
        tandemNameSymbol: 'a'
      } ),

      // b
      new Vector( initialPosition, new Vector2( 8, 6 ), this, this.vectorSet, VectorAdditionSymbols.bStringProperty, {
        isDisposable: false,
        tandem: parentTandem.createTandem( 'bVector' ),
        tandemNameSymbol: 'b'
      } ),

      // c
      new Vector( initialPosition, new Vector2( 0, -10 ), this, this.vectorSet, VectorAdditionSymbols.cStringProperty, {
        isDisposable: false,
        tandem: parentTandem.createTandem( 'cVector' ),
        tandemNameSymbol: 'c'
      } )
    ];
  }
}

vectorAddition.register( 'CartesianScene', CartesianScene );