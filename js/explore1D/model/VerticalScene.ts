// Copyright 2025, University of Colorado Boulder

/**
 * VerticalScene is the vertical scene in the 'Explore 1D' screen, with vectors 'd', 'e', and 'f'.
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

export default class VerticalScene extends Explore1DScene {

  // abstract in the base class
  public override readonly vectors: Vector[];

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {

    super( VectorAdditionStrings.a11y.verticalSceneNameStringProperty, 'vertical', componentVectorStyleProperty,
      VectorAdditionColors.EXPLORE_1D_VERTICAL_COLOR_PALETTE, tandem );

    const initialVectorComponents = new Vector2( 0, 5 ); // vertical vector

    this.vectors = [

      // d
      new Vector( Vector2.ZERO, initialVectorComponents, this, this.vectorSet, VectorAdditionSymbols.dStringProperty, {
        isDisposable: false,
        tandem: tandem.createTandem( 'dVector' ),
        tandemNameSymbol: 'd'
      } ),

      // e
      new Vector( Vector2.ZERO, initialVectorComponents, this, this.vectorSet, VectorAdditionSymbols.eStringProperty, {
        isDisposable: false,
        tandem: tandem.createTandem( 'eVector' ),
        tandemNameSymbol: 'e'
      } ),

      // f
      new Vector( Vector2.ZERO, initialVectorComponents, this, this.vectorSet, VectorAdditionSymbols.fStringProperty, {
        isDisposable: false,
        tandem: tandem.createTandem( 'fVector' ),
        tandemNameSymbol: 'f'
      } )
    ];
  }
}

vectorAddition.register( 'VerticalScene', VerticalScene );