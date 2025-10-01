// Copyright 2025, University of Colorado Boulder

/**
 * PolarScene is the polar-coordinates scene in the 'Explore 2D' screen, with vectors 'd', 'e', and 'f'.
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
import { toRadians } from '../../../../dot/js/util/toRadians.js';

export class PolarScene extends Explore2DScene {

  // abstract in the base class
  public override readonly vectors: Vector[];

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {

    super( VectorAdditionStrings.a11y.polarSceneNameStringProperty, 'polar', componentVectorStyleProperty,
      VectorAdditionColors.EXPLORE_2D_POLAR_COLOR_PALETTE, tandem );

    const initialPosition = Vector2.ZERO;

    this.vectors = [

      // d
      new Vector( initialPosition, Vector2.createPolar( 8, toRadians( 30 ) ), this, this.vectorSet, VectorAdditionSymbols.dStringProperty, {
        isDisposable: false,
        tandem: tandem.createTandem( 'dVector' ),
        tandemNameSymbol: 'd'
      } ),

      // e
      new Vector( initialPosition, Vector2.createPolar( 8, toRadians( 60 ) ), this, this.vectorSet, VectorAdditionSymbols.eStringProperty, {
        isDisposable: false,
        tandem: tandem.createTandem( 'eVector' ),
        tandemNameSymbol: 'e'
      } ),

      // f
      new Vector( initialPosition, Vector2.createPolar( 8, toRadians( -90 ) ), this, this.vectorSet, VectorAdditionSymbols.fStringProperty, {
        isDisposable: false,
        tandem: tandem.createTandem( 'fVector' ),
        tandemNameSymbol: 'f'
      } )
    ];
  }
}

vectorAddition.register( 'PolarScene', PolarScene );