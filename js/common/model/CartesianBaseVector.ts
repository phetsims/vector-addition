// Copyright 2019-2023, University of Colorado Boulder

/**
 * CartesianBaseVector is the subclass of BaseVector used with CoordinateSnapModes.CARTESIAN.
 * It creates NumberProperties for the x and y components that are controlled by NumberPickers, and
 * adjusts its x and y components based on the values of those Properties.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import vectorAddition from '../../vectorAddition.js';
import BaseVector from './BaseVector.js';
import CoordinateSnapModes from './CoordinateSnapModes.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Graph from './Graph.js';
import VectorSet from './VectorSet.js';

export default class CartesianBaseVector extends BaseVector {

  // The x and y components of the vector
  public readonly xComponentProperty: NumberProperty;
  public readonly yComponentProperty: NumberProperty;

  /**
   * @param initialTailPosition - starting tail position of the Base Vector
   * @param initialComponents - starting components of the Base Vector
   * @param graph - the graph the Base Vector belongs to
   * @param vectorSet - the set that the Base Vector belongs to
   * @param symbol - the symbol for the Base Vector (e.g. 'a', 'b', 'c', ...)
   */
  public constructor( initialTailPosition: Vector2, initialComponents: Vector2, graph: Graph,
                      vectorSet: VectorSet, symbol: string | null ) {

    assert && assert( graph.coordinateSnapMode === CoordinateSnapModes.CARTESIAN, `invalid coordinateSnapMode: ${graph.coordinateSnapMode}` );

    super( initialTailPosition, initialComponents, graph, vectorSet, symbol );

    this.xComponentProperty = new NumberProperty( this.xComponent );
    this.yComponentProperty = new NumberProperty( this.yComponent );

    // Observe when the component NumberProperties change and update the components to match.
    // unlink is unnecessary, exists for the lifetime of the sim.
    this.xComponentProperty.link( xComponent => { this.xComponent = xComponent; } );
    this.yComponentProperty.link( yComponent => { this.yComponent = yComponent; } );
  }

  public override reset(): void {
    super.reset();
    this.xComponentProperty.reset();
    this.yComponentProperty.reset();
  }
}

vectorAddition.register( 'CartesianBaseVector', CartesianBaseVector );