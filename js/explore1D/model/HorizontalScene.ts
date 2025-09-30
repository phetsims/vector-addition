// Copyright 2025, University of Colorado Boulder

/**
 * HorizontalScene is the horizontal scene in the 'Explore 1D' screen, with vectors 'a', 'b', and 'c'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Explore1DScene from './Explore1DScene.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import Vector from '../../common/model/Vector.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';

export default class HorizontalScene extends Explore1DScene {

  // abstract in the base class
  public override readonly vectors: Vector[];

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {

    super( VectorAdditionStrings.a11y.horizontalSceneNameStringProperty, 'horizontal', componentVectorStyleProperty,
      VectorAdditionColors.EXPLORE_1D_HORIZONTAL_COLOR_PALETTE, tandem );

    const initialPosition = Vector2.ZERO;
    const initialVectorComponents = new Vector2( 5, 0 ); // horizontal vector

    this.vectors = [

      // a
      new Vector( initialPosition, initialVectorComponents, this, this.vectorSet, VectorAdditionSymbols.aStringProperty, {
        isDisposable: false,
        tandem: tandem.createTandem( 'aVector' ),
        tandemNameSymbol: 'a'
      } ),

      // b
      new Vector( initialPosition, initialVectorComponents, this, this.vectorSet, VectorAdditionSymbols.bStringProperty, {
        isDisposable: false,
        tandem: tandem.createTandem( 'bVector' ),
        tandemNameSymbol: 'b'
      } ),

      // c
      new Vector( initialPosition, initialVectorComponents, this, this.vectorSet, VectorAdditionSymbols.cStringProperty, {
        isDisposable: false,
        tandem: tandem.createTandem( 'cVector' ),
        tandemNameSymbol: 'c'
      } )
    ];
  }
}

vectorAddition.register( 'HorizontalScene', HorizontalScene );