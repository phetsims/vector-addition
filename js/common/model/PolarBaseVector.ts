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
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import BaseVector from './BaseVector.js';
import VectorAdditionScene from './VectorAdditionScene.js';
import VectorSet from './VectorSet.js';
import { toDegrees } from '../../../../dot/js/util/toDegrees.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';

export default class PolarBaseVector extends BaseVector {

  public readonly magnitudeProperty: NumberProperty;
  public readonly angleProperty: NumberProperty;

  /**
   * @param initialTailPosition - starting tail position of the Base Vector
   * @param initialComponents - starting components of the Base Vector
   * @param scene - the scene the Base Vector belongs to
   * @param vectorSet - the set that the Base Vector belongs to
   * @param symbolProperty - the symbol for the Base Vector (i.e. 'a', 'b', 'c', ...)
   * @param tandemNameSymbol - symbol for the vector used in tandem names
   * @param tandem
   */
  public constructor( initialTailPosition: Vector2,
                      initialComponents: Vector2,
                      scene: VectorAdditionScene,
                      vectorSet: VectorSet,
                      symbolProperty: TReadOnlyProperty<string>,
                      tandemNameSymbol: string,
                      tandem: Tandem ) {

    affirm( scene.coordinateSnapMode === 'polar', `invalid coordinateSnapMode: ${scene.coordinateSnapMode}` );

    super( initialTailPosition, initialComponents, scene, vectorSet, symbolProperty, tandemNameSymbol, {
      isDisposable: false,
      tandem: tandem
    } );

    this.magnitudeProperty = new NumberProperty( this.magnitude, {
      numberType: 'Integer',
      range: VectorAdditionConstants.MAGNITUDE_RANGE,
      tandem: tandem.createTandem( 'magnitudeProperty' )
    } );

    const initialAngle = this.angle!;
    affirm( initialAngle !== null, 'expected this.angle to be non-null' );
    this.angleProperty = new NumberProperty( toDegrees( initialAngle ), {
      numberType: 'Integer',
      range: VectorAdditionConstants.SIGNED_ANGLE_RANGE,
      units: '\u00B0', // degrees
      tandem: tandem.createTandem( 'angleProperty' )
    } );

    // Observe when the angle or magnitude changes, and update the components to match.
    Multilink.multilink(
      [ this.magnitudeProperty, this.angleProperty ],
      ( magnitude, angle ) => {
        this.vectorComponents = Vector2.createPolar( magnitude, toRadians( angle ) );
      } );
  }

  public override reset(): void {
    this.magnitudeProperty.reset();
    this.angleProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'PolarBaseVector', PolarBaseVector );