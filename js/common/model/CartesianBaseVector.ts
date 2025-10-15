// Copyright 2019-2025, University of Colorado Boulder

/**
 * CartesianBaseVector is the subclass of BaseVector used with CoordinateSnapMode 'cartesian'.
 * It creates NumberProperties for the x and y components that are controlled by NumberPickers, and
 * adjusts its xyComponentsProperty based on the values of those Properties.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import BaseVector, { BaseVectorOptions } from './BaseVector.js';
import VectorSet from './VectorSet.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Graph from './Graph.js';
import Property from '../../../../axon/js/Property.js';
import Vector from './Vector.js';

type SelfOptions = EmptySelfOptions;

type CartesianBaseVectorOptions = SelfOptions & BaseVectorOptions;

export default class CartesianBaseVector extends BaseVector {

  // The x and y components of the vector
  public readonly xComponentProperty: NumberProperty;
  public readonly yComponentProperty: NumberProperty;

  public constructor( tailPosition: Vector2,
                      xyComponents: Vector2,
                      vectorSet: VectorSet,
                      graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      providedOptions: CartesianBaseVectorOptions ) {

    const options = providedOptions;
    affirm( options.coordinateSnapMode === 'cartesian', `invalid coordinateSnapMode: ${options.coordinateSnapMode}` );

    super( tailPosition, xyComponents, vectorSet, graph, selectedVectorProperty, options );

    this.xComponentProperty = new NumberProperty( this.xComponent, {
      numberType: 'Integer',
      range: VectorAdditionConstants.XY_COMPONENT_RANGE,
      tandem: options.tandem.createTandem( 'xComponentProperty' )
    } );

    this.yComponentProperty = new NumberProperty( this.yComponent, {
      numberType: 'Integer',
      range: VectorAdditionConstants.XY_COMPONENT_RANGE,
      tandem: options.tandem.createTandem( 'yComponentProperty' )
    } );

    // Observe when the component NumberProperties change and update the components to match.
    this.xComponentProperty.link( xComponent => {
      this.xyComponentsProperty.value = new Vector2( xComponent, this.yComponent );
    } );
    this.yComponentProperty.link( yComponent => {
      this.xyComponentsProperty.value = new Vector2( this.xComponent, yComponent );
    } );
  }

  public override reset(): void {
    this.xComponentProperty.reset();
    this.yComponentProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'CartesianBaseVector', CartesianBaseVector );