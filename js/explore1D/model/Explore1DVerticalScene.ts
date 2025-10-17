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
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ExploreScene from '../../common/model/ExploreScene.js';
import Graph from '../../common/model/Graph.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import Property from '../../../../axon/js/Property.js';
import ExploreVectorSet from '../../common/model/ExploreVectorSet.js';

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
function createAllVectors( vectorSet: ExploreVectorSet,
                           graph: Graph,
                           selectedVectorProperty: Property<Vector | null>,
                           componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                           coordinateSnapMode: CoordinateSnapMode,
                           parentTandem: Tandem ): Vector[] {

  const tailPosition = Vector2.ZERO;
  const xyComponents = new Vector2( 0, 5 ); // vertical vector

  return [

    // d
    new Vector( tailPosition, xyComponents, vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, {
      symbolProperty: VectorAdditionSymbols.dStringProperty,
      coordinateSnapMode: coordinateSnapMode,
      vectorColorPalette: vectorSet.vectorColorPalette,
      tandem: parentTandem.createTandem( 'dVector' ),
      tandemNameSymbol: 'd'
    } ),

    // e
    new Vector( tailPosition, xyComponents, vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, {
      symbolProperty: VectorAdditionSymbols.eStringProperty,
      coordinateSnapMode: coordinateSnapMode,
      vectorColorPalette: vectorSet.vectorColorPalette,
      tandem: parentTandem.createTandem( 'eVector' ),
      tandemNameSymbol: 'e'
    } ),

    // f
    new Vector( tailPosition, xyComponents, vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, {
      symbolProperty: VectorAdditionSymbols.fStringProperty,
      coordinateSnapMode: coordinateSnapMode,
      vectorColorPalette: vectorSet.vectorColorPalette,
      tandem: parentTandem.createTandem( 'fVector' ),
      tandemNameSymbol: 'f'
    } )
  ];
}

vectorAddition.register( 'Explore1DVerticalScene', Explore1DVerticalScene );