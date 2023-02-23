// Copyright 2019-2023, University of Colorado Boulder

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

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import Graph from '../../common/model/Graph.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';

export default class Explore2DGraph extends Graph {

  /**
   * @param {CoordinateSnapModes} coordinateSnapMode - coordinateSnapMode for the graph
   * @param {EnumerationProperty.<ComponentVectorStyles>} componentStyleProperty
   * @param {BooleanProperty} sumVisibleProperty
   * @param {VectorColorPalette} vectorColorPalette - color palette for vectors on the graph
   */
  constructor( coordinateSnapMode, componentStyleProperty, sumVisibleProperty, vectorColorPalette ) {

    assert && assert( CoordinateSnapModes.enumeration.includes( coordinateSnapMode ), `invalid coordinateSnapMode: ${coordinateSnapMode}` );
    assert && assert( componentStyleProperty instanceof EnumerationProperty, `invalid componentStyleProperty: ${componentStyleProperty}` );
    assert && assert( sumVisibleProperty instanceof BooleanProperty, `invalid sumVisibleProperty: ${sumVisibleProperty}` );
    assert && assert( vectorColorPalette instanceof VectorColorPalette, `invalid vectorColorPalette: ${vectorColorPalette}` );

    super( VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS, coordinateSnapMode );

    // @public (read-only) {VectorSet} vectorSet - Graphs on 'Explore 2D' have exactly one vector set
    this.vectorSet = new VectorSet( this, componentStyleProperty, sumVisibleProperty, vectorColorPalette );

    // Add the one and only vector set
    this.vectorSets.push( this.vectorSet );
  }
}

vectorAddition.register( 'Explore2DGraph', Explore2DGraph );