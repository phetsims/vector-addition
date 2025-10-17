// Copyright 2025, University of Colorado Boulder

/**
 * Explore2DPolarScene is the polar-coordinates scene in the 'Explore 2D' screen, with vectors 'd', 'e', and 'f'.
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
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import ExploreScene from '../../common/model/ExploreScene.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import ExploreVectorSet from '../../common/model/ExploreVectorSet.js';
import Graph from '../../common/model/Graph.js';
import Property from '../../../../axon/js/Property.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';

export class Explore2DPolarScene extends ExploreScene {

  public constructor( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, tandem: Tandem ) {
    super(
      VectorAdditionStrings.a11y.polarSceneNameStringProperty,
      VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS,
      'twoDimensional',
      'polar',
      VectorAdditionColors.EXPLORE_2D_POLAR_COLOR_PALETTE,
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

  return [

    // d
    new Vector( tailPosition, Vector2.createPolar( 8, toRadians( 30 ) ), vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, {
      symbolProperty: VectorAdditionSymbols.dStringProperty,
      coordinateSnapMode: coordinateSnapMode,
      vectorColorPalette: vectorSet.vectorColorPalette,
      tandem: parentTandem.createTandem( 'dVector' ),
      tandemNameSymbol: 'd'
    } ),

    // e
    new Vector( tailPosition, Vector2.createPolar( 8, toRadians( 60 ) ), vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, {
      symbolProperty: VectorAdditionSymbols.eStringProperty,
      coordinateSnapMode: coordinateSnapMode,
      vectorColorPalette: vectorSet.vectorColorPalette,
      tandem: parentTandem.createTandem( 'eVector' ),
      tandemNameSymbol: 'e'
    } ),

    // f
    new Vector( tailPosition, Vector2.createPolar( 8, toRadians( -90 ) ), vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, {
      symbolProperty: VectorAdditionSymbols.fStringProperty,
      coordinateSnapMode: coordinateSnapMode,
      vectorColorPalette: vectorSet.vectorColorPalette,
      tandem: parentTandem.createTandem( 'fVector' ),
      tandemNameSymbol: 'f'
    } )
  ];
}

vectorAddition.register( 'Explore2DPolarScene', Explore2DPolarScene );