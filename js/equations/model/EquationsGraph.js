// Copyright 2019-2023, University of Colorado Boulder

/**
 * Model for a single graph on the 'Equations' screen, which has 2 graphs (Polar and Cartesian).
 *
 * Characteristics of an EquationsGraph (which extends Graph) are:
 *  - have exactly 1 VectorSet
 *  - has a Property to select the equation type (addition/subtraction/negation) per graph
 *
 * @author Brandon Li
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import Graph from '../../common/model/Graph.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsVectorSet from './EquationsVectorSet.js';
import EquationTypes from './EquationTypes.js';

// constants

// graph bounds for EquationsGraphs
const EQUATIONS_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

// Bottom left corner, in view coordinates.
const BOTTOM_LEFT = new Vector2( Graph.DEFAULT_BOTTOM_LEFT.x, Graph.DEFAULT_BOTTOM_LEFT.y + 40 );

// Starting equation type
const STARTING_EQUATION_TYPE = EquationTypes.ADDITION;

export default class EquationsGraph extends Graph {

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

    super( EQUATIONS_GRAPH_BOUNDS, coordinateSnapMode, {
      bottomLeft: BOTTOM_LEFT
    } );

    // @public (read-only) {EnumerationProperty.<EquationTypes>} equationTypeProperty
    this.equationTypeProperty = new EnumerationProperty( STARTING_EQUATION_TYPE );

    // @public (read-only) {EquationsVectorSet} vectorSet
    this.vectorSet = new EquationsVectorSet( this, componentStyleProperty, sumVisibleProperty, vectorColorPalette, coordinateSnapMode );

    this.vectorSets.push( this.vectorSet );
  }

  /**
   * Resets the graph.
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.equationTypeProperty.reset();
  }
}

vectorAddition.register( 'EquationsGraph', EquationsGraph );