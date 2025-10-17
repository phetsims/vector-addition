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
import ExploreScene from '../../common/model/ExploreScene.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import ExploreVectorSet from '../../common/model/ExploreVectorSet.js';
import Graph from '../../common/model/Graph.js';
import Property from '../../../../axon/js/Property.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';

export default class Explore2DCartesianScene extends ExploreScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {

    super(
      VectorAdditionStrings.a11y.cartesianSceneNameStringProperty,
      VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS,
      'twoDimensional',
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
function createAllVectors( vectorSet: ExploreVectorSet,
                           graph: Graph,
                           selectedVectorProperty: Property<Vector | null>,
                           componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                           coordinateSnapMode: CoordinateSnapMode,
                           parentTandem: Tandem ): Vector[] {

  const tailPosition = Vector2.ZERO;

  return [

    // a
    new Vector( tailPosition, new Vector2( 6, 8 ), vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, {
      symbolProperty: VectorAdditionSymbols.aStringProperty,
      coordinateSnapMode: coordinateSnapMode,
      vectorColorPalette: vectorSet.vectorColorPalette,
      tandem: parentTandem.createTandem( 'aVector' ),
      tandemNameSymbol: 'a'
    } ),

    // b
    new Vector( tailPosition, new Vector2( 8, 6 ), vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, {
      symbolProperty: VectorAdditionSymbols.bStringProperty,
      coordinateSnapMode: coordinateSnapMode,
      vectorColorPalette: vectorSet.vectorColorPalette,
      tandem: parentTandem.createTandem( 'bVector' ),
      tandemNameSymbol: 'b'
    } ),

    // c
    new Vector( tailPosition, new Vector2( 0, -10 ), vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, {
      symbolProperty: VectorAdditionSymbols.cStringProperty,
      coordinateSnapMode: coordinateSnapMode,
      vectorColorPalette: vectorSet.vectorColorPalette,
      tandem: parentTandem.createTandem( 'cVector' ),
      tandemNameSymbol: 'c'
    } )
  ];
}

vectorAddition.register( 'Explore2DCartesianScene', Explore2DCartesianScene );