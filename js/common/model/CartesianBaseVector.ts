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

export default class CartesianBaseVector extends BaseVector {

  /**
   * @param {Vector2} initialTailPosition - starting tail position of the Base Vector
   * @param {Vector2} initialComponents - starting components of the Base Vector
   * @param {EquationsGraph} graph - the graph the Base Vector belongs to
   * @param {EquationsVectorSet} vectorSet - the set that the Base Vector belongs to
   * @param {string|null} symbol - the symbol for the Base Vector (e.g. 'a', 'b', 'c', ...)
   */
  constructor( initialTailPosition, initialComponents, graph, vectorSet, symbol ) {

    assert && assert( graph.coordinateSnapMode === CoordinateSnapModes.CARTESIAN, `invalid coordinateSnapMode: ${graph.coordinateSnapMode}` );

    super( initialTailPosition, initialComponents, graph, vectorSet, symbol );

    // @public (read-only) Property to set the x component
    this.xComponentProperty = new NumberProperty( this.xComponent );

    // @public (read-only) Property to set the y component
    this.yComponentProperty = new NumberProperty( this.yComponent );

    // Observe when the component NumberProperties change and update the components to match.
    // unlink is unnecessary, exists for the lifetime of the sim.
    this.xComponentProperty.link( xComponent => { this.xComponent = xComponent; } );
    this.yComponentProperty.link( yComponent => { this.yComponent = yComponent; } );
  }

  /**
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.xComponentProperty.reset();
    this.yComponentProperty.reset();
  }
}

vectorAddition.register( 'CartesianBaseVector', CartesianBaseVector );