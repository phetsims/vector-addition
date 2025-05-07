// Copyright 2019-2025, University of Colorado Boulder

/**
 * PolarBaseVector is the subclass of BaseVector used with CoordinateSnapMode.POLAR.
 * It creates NumberProperties for the angle and magnitude that are controlled by NumberPickers, and
 * adjusts its x and y components based on the values of those Properties.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import BaseVector from '../../common/model/BaseVector.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import VectorSet from '../../common/model/VectorSet.js';
import { toDegrees } from '../../../../dot/js/util/toDegrees.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';

export default class PolarBaseVector extends BaseVector {

  public readonly magnitudeProperty: NumberProperty;
  public readonly angleDegreesProperty: NumberProperty;

  /**
   * @param initialTailPosition - starting tail position of the Base Vector
   * @param initialComponents - starting components of the Base Vector
   * @param scene - the scene the Base Vector belongs to
   * @param vectorSet - the set that the Base Vector belongs to
   * @param symbolProperty - the symbol for the Base Vector (i.e. 'a', 'b', 'c', ...)
   */
  public constructor( initialTailPosition: Vector2, initialComponents: Vector2, scene: VectorAdditionScene,
                      vectorSet: VectorSet, symbolProperty: TReadOnlyProperty<string> ) {

    assert && assert( scene.coordinateSnapMode === 'polar', `invalid coordinateSnapMode: ${scene.coordinateSnapMode}` );

    super( initialTailPosition, initialComponents, scene, vectorSet, symbolProperty );

    this.magnitudeProperty = new NumberProperty( this.magnitude );

    const initialAngle = this.angle!;
    assert && assert( initialAngle !== null, 'expected this.angle to be non-null' );
    this.angleDegreesProperty = new NumberProperty( toDegrees( initialAngle ) );

    // Observe when the angle or magnitude changes, and update the components to match.
    // unmultilink is unnecessary, exists for the lifetime of the sim.
    Multilink.multilink(
      [ this.magnitudeProperty, this.angleDegreesProperty ],
      ( magnitude, angleDegrees ) => {
        this.vectorComponents = Vector2.createPolar( magnitude, toRadians( angleDegrees ) );
      } );
  }

  public override reset(): void {
    super.reset();
    this.magnitudeProperty.reset();
    this.angleDegreesProperty.reset();
  }
}

vectorAddition.register( 'PolarBaseVector', PolarBaseVector );