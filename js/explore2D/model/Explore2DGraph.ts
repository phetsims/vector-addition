// Copyright 2019-2025, University of Colorado Boulder

/**
 * Model for a single graph on the 'Explore 2D' screen. 'Explore 2D' has a total of 2 graphs (polar and Cartesian).
 *
 * Characteristics of a Explore 2D Graph (which extends Graph) are:
 *  - Explore 2D graphs have exactly 1 vector sets each
 *  - Has its own sum visible property respectively
 *  - Two-dimensional
 *  - Has a color palette for the vectors on the graph
 *
 * @author Brandon Li
 */

import Property from '../../../../axon/js/Property.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import Graph from '../../common/model/Graph.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class Explore2DGraph extends Graph {

  // Graphs on 'Explore 2D' have exactly one vector set
  public readonly vectorSet: VectorSet;

  public constructor( coordinateSnapMode: CoordinateSnapMode,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sumVisibleProperty: Property<boolean>,
                      vectorColorPalette: VectorColorPalette,
                      tandem: Tandem ) {

    super( VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS, coordinateSnapMode, {
      tandem: tandem
    } );

    this.vectorSet = new VectorSet( this, componentVectorStyleProperty, sumVisibleProperty, vectorColorPalette );

    // Add the one and only vector set
    this.vectorSets.push( this.vectorSet );
  }
}

vectorAddition.register( 'Explore2DGraph', Explore2DGraph );