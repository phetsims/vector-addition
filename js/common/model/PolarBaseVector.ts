// Copyright 2019-2025, University of Colorado Boulder

/**
 * PolarBaseVector is the subclass of BaseVector used with CoordinateSnapMode 'polar'.
 * It creates NumberProperties for the angle and magnitude that are controlled by NumberPickers, and
 * adjusts its xyComponentsProperty based on the values of those Properties.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import BaseVector, { BaseVectorOptions } from './BaseVector.js';
import VectorSet from './VectorSet.js';
import { toDegrees } from '../../../../dot/js/util/toDegrees.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import Graph from './Graph.js';
import Property from '../../../../axon/js/Property.js';
import Vector from './Vector.js';

type SelfOptions = EmptySelfOptions;

type PolarBaseVectorOptions = SelfOptions & BaseVectorOptions;

export default class PolarBaseVector extends BaseVector {

  public readonly magnitudeProperty: NumberProperty;
  public readonly angleProperty: NumberProperty;

  public constructor( tailPosition: Vector2,
                      xyComponents: Vector2,
                      vectorSet: VectorSet,
                      graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      providedOptions: PolarBaseVectorOptions ) {

    const options = providedOptions;
    affirm( options.coordinateSnapMode === 'polar', `invalid coordinateSnapMode: ${options.coordinateSnapMode}` );

    super( tailPosition, xyComponents, vectorSet, graph, selectedVectorProperty, options );

    this.magnitudeProperty = new NumberProperty( this.magnitude, {
      numberType: 'Integer',
      range: VectorAdditionConstants.MAGNITUDE_RANGE,
      tandem: options.tandem.createTandem( 'magnitudeProperty' )
    } );

    const initialAngle = this.angle!;
    affirm( initialAngle !== null, 'expected this.angle to be non-null' );
    this.angleProperty = new NumberProperty( toFixedNumber( toDegrees( initialAngle ), 0 ), {
      numberType: 'Integer',
      range: VectorAdditionConstants.SIGNED_ANGLE_RANGE,
      units: '\u00B0', // degrees
      tandem: options.tandem.createTandem( 'angleProperty' )
    } );

    // Observe when the angle or magnitude changes, and update the components to match.
    Multilink.multilink(
      [ this.magnitudeProperty, this.angleProperty ],
      ( magnitude, angle ) => {
        this.xyComponentsProperty.value = Vector2.createPolar( magnitude, toRadians( angle ) );
      } );
  }

  public override reset(): void {
    this.magnitudeProperty.reset();
    this.angleProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'PolarBaseVector', PolarBaseVector );