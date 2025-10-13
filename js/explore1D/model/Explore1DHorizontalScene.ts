// Copyright 2025, University of Colorado Boulder

/**
 * Explore1DHorizontalScene is the horizontal scene in the 'Explore 1D' screen, with vectors 'a', 'b', and 'c'.
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
import Bounds2 from '../../../../dot/js/Bounds2.js';

export default class Explore1DHorizontalScene extends ExploreScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      graphBounds: Bounds2,
                      tandem: Tandem ) {

    super(
      VectorAdditionStrings.a11y.horizontalSceneNameStringProperty,
      graphBounds,
      'horizontal',
      'cartesian',
      VectorAdditionColors.EXPLORE_1D_HORIZONTAL_COLOR_PALETTE,
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
  const initialComponents = new Vector2( 5, 0 ); // horizontal vector

  return [

    // a
    new Vector( initialPosition, initialComponents, scene, vectorSet, VectorAdditionSymbols.aStringProperty, {
      isDisposable: false,
      tandem: parentTandem.createTandem( 'aVector' ),
      tandemNameSymbol: 'a'
    } ),

    // b
    new Vector( initialPosition, initialComponents, scene, vectorSet, VectorAdditionSymbols.bStringProperty, {
      isDisposable: false,
      tandem: parentTandem.createTandem( 'bVector' ),
      tandemNameSymbol: 'b'
    } ),

    // c
    new Vector( initialPosition, initialComponents, scene, vectorSet, VectorAdditionSymbols.cStringProperty, {
      isDisposable: false,
      tandem: parentTandem.createTandem( 'cVector' ),
      tandemNameSymbol: 'c'
    } )
  ];
}

vectorAddition.register( 'Explore1DHorizontalScene', Explore1DHorizontalScene );