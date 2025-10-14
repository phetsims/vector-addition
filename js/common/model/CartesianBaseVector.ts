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
import VectorAdditionScene from './VectorAdditionScene.js';
import VectorSet from './VectorSet.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

type CartesianBaseVectorOptions = SelfOptions & BaseVectorOptions;

export default class CartesianBaseVector extends BaseVector {

  // The x and y components of the vector
  public readonly xComponentProperty: NumberProperty;
  public readonly yComponentProperty: NumberProperty;

  /**
   * @param tailPosition - initial tail position of the Base Vector
   * @param xyComponents - initial xy-components of the Base Vector
   * @param scene - the scene the Base Vector belongs to
   * @param vectorSet - the set that the Base Vector belongs to
   * @param providedOptions
   */
  public constructor( tailPosition: Vector2,
                      xyComponents: Vector2,
                      scene: VectorAdditionScene,
                      vectorSet: VectorSet,
                      providedOptions: CartesianBaseVectorOptions ) {

    affirm( scene.coordinateSnapMode === 'cartesian', `invalid coordinateSnapMode: ${scene.coordinateSnapMode}` );

    const options = providedOptions;

    super( tailPosition, xyComponents, scene, vectorSet, options );

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