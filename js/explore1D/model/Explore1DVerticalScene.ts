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
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import Vector from '../../common/model/Vector.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ExploreScene from '../../common/model/ExploreScene.js';

export default class Explore1DVerticalScene extends ExploreScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      graphBounds: Bounds2,
                      tandem: Tandem ) {

    super(
      VectorAdditionStrings.a11y.verticalSceneNameStringProperty,
      graphBounds,
      'vertical',
      'cartesian',
      VectorAdditionColors.EXPLORE_1D_VERTICAL_COLOR_PALETTE,
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
  const initialComponents = new Vector2( 0, 5 ); // vertical vector

  return [

    // d
    new Vector( initialPosition, initialComponents, scene, vectorSet, VectorAdditionSymbols.dStringProperty, {
      tandem: parentTandem.createTandem( 'dVector' ),
      tandemNameSymbol: 'd'
    } ),

    // e
    new Vector( initialPosition, initialComponents, scene, vectorSet, VectorAdditionSymbols.eStringProperty, {
      tandem: parentTandem.createTandem( 'eVector' ),
      tandemNameSymbol: 'e'
    } ),

    // f
    new Vector( initialPosition, initialComponents, scene, vectorSet, VectorAdditionSymbols.fStringProperty, {
      tandem: parentTandem.createTandem( 'fVector' ),
      tandemNameSymbol: 'f'
    } )
  ];
}

vectorAddition.register( 'Explore1DVerticalScene', Explore1DVerticalScene );