// Copyright 2019-2023, University of Colorado Boulder

/**
 * PolarBaseVector is the subclass of BaseVector used with CoordinateSnapModes.POLAR.
 * It creates NumberProperties for the angle and magnitude that are controlled by NumberPickers, and
 * adjusts its x and y components based on the values of those Properties.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import BaseVector from './BaseVector.js';
import CoordinateSnapModes from './CoordinateSnapModes.js';
import Graph from './Graph.js';
import VectorSet from './VectorSet.js';

export default class PolarBaseVector extends BaseVector {

  public readonly magnitudeProperty: NumberProperty;
  public readonly angleDegreesProperty: NumberProperty;

  /**
   * @param initialTailPosition - starting tail position of the Base Vector
   * @param initialComponents - starting components of the Base Vector
   * @param graph - the graph the Base Vector belongs to
   * @param vectorSet - the set that the Base Vector belongs to
   * @param symbol - the symbol for the Base Vector (i.e. 'a', 'b', 'c', ...)
   */
  public constructor( initialTailPosition: Vector2, initialComponents: Vector2, graph: Graph,
                      vectorSet: VectorSet, symbol: string | null ) {

    assert && assert( graph.coordinateSnapMode === CoordinateSnapModes.POLAR, `invalid coordinateSnapMode: ${graph.coordinateSnapMode}` );

    super( initialTailPosition, initialComponents, graph, vectorSet, symbol );

    this.magnitudeProperty = new NumberProperty( this.magnitude );

    const initialAngle = this.angle!;
    assert && assert( initialAngle !== null, 'expected this.angle to be non-null' );
    this.angleDegreesProperty = new NumberProperty( Utils.toDegrees( initialAngle ) );

    // Observe when the angle or magnitude changes, and update the components to match.
    // unmultilink is unnecessary, exists for the lifetime of the sim.
    Multilink.multilink(
      [ this.magnitudeProperty, this.angleDegreesProperty ],
      ( magnitude, angleDegrees ) => {
        this.vectorComponents = Vector2.createPolar( magnitude, Utils.toRadians( angleDegrees ) );
      } );
  }

  public override reset(): void {
    super.reset();
    this.magnitudeProperty.reset();
    this.angleDegreesProperty.reset();
  }
}

vectorAddition.register( 'PolarBaseVector', PolarBaseVector );