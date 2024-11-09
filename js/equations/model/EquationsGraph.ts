// Copyright 2019-2024, University of Colorado Boulder

/**
 * Model for a single graph on the 'Equations' screen, which has 2 graphs (Polar and Cartesian).
 *
 * Characteristics of an EquationsGraph (which extends Graph) are:
 *  - have exactly 1 VectorSet
 *  - has a Property to select the equation type (addition/subtraction/negation) per graph
 *
 * @author Brandon Li
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import Graph from '../../common/model/Graph.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsVectorSet from './EquationsVectorSet.js';
import EquationTypes from './EquationTypes.js';
import ComponentVectorStyles from '../../common/model/ComponentVectorStyles.js';
import Property from '../../../../axon/js/Property.js';

// constants

// graph bounds for EquationsGraphs
const EQUATIONS_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

// Bottom left corner, in view coordinates.
const BOTTOM_LEFT = new Vector2( Graph.DEFAULT_BOTTOM_LEFT.x, Graph.DEFAULT_BOTTOM_LEFT.y + 40 );

// Starting equation type
const STARTING_EQUATION_TYPE = EquationTypes.ADDITION;

export default class EquationsGraph extends Graph {

  public readonly equationTypeProperty: EnumerationProperty<EquationTypes>;
  public readonly vectorSet: EquationsVectorSet;

  public constructor( coordinateSnapMode: CoordinateSnapModes,
                      componentStyleProperty: EnumerationProperty<ComponentVectorStyles>,
                      sumVisibleProperty: Property<boolean>,
                      vectorColorPalette: VectorColorPalette ) {

    super( EQUATIONS_GRAPH_BOUNDS, coordinateSnapMode, {
      bottomLeft: BOTTOM_LEFT
    } );

    this.equationTypeProperty = new EnumerationProperty( STARTING_EQUATION_TYPE );

    this.vectorSet = new EquationsVectorSet( this, componentStyleProperty, sumVisibleProperty, vectorColorPalette, coordinateSnapMode );

    this.vectorSets.push( this.vectorSet );
  }

  public override reset(): void {
    super.reset();
    this.equationTypeProperty.reset();
  }
}

vectorAddition.register( 'EquationsGraph', EquationsGraph );