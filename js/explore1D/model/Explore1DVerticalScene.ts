// Copyright 2025, University of Colorado Boulder

/**
 * Explore1DVerticalScene is the vertical scene in the 'Explore 1D' screen, with vectors 'd', 'e', and 'f'.
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
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';

export default class Explore1DVerticalScene extends Explore1DScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {

    super( VectorAdditionStrings.a11y.verticalSceneNameStringProperty, 'vertical', componentVectorStyleProperty,
      VectorAdditionColors.EXPLORE_1D_VERTICAL_COLOR_PALETTE, createVectors, tandem );
  }
}

/**
 * Creates vectors d, e, f.
 */
function createVectors( scene: VectorAdditionScene, vectorSet: VectorSet, parentTandem: Tandem ): Vector[] {

  const initialPosition = Vector2.ZERO;
  const initialComponents = new Vector2( 0, 5 ); // vertical vector
  
  return [

    // d
    new Vector( initialPosition, initialComponents, scene, vectorSet, VectorAdditionSymbols.dStringProperty, {
      isDisposable: false,
      tandem: parentTandem.createTandem( 'dVector' ),
      tandemNameSymbol: 'd'
    } ),

    // e
    new Vector( initialPosition, initialComponents, scene, vectorSet, VectorAdditionSymbols.eStringProperty, {
      isDisposable: false,
      tandem: parentTandem.createTandem( 'eVector' ),
      tandemNameSymbol: 'e'
    } ),

    // f
    new Vector( initialPosition, initialComponents, scene, vectorSet, VectorAdditionSymbols.fStringProperty, {
      isDisposable: false,
      tandem: parentTandem.createTandem( 'fVector' ),
      tandemNameSymbol: 'f'
    } )
  ];
}

vectorAddition.register( 'Explore1DVerticalScene', Explore1DVerticalScene );