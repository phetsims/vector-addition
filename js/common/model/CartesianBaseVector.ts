// Copyright 2019-2025, University of Colorado Boulder

/**
 * CartesianBaseVector is the subclass of BaseVector used with CoordinateSnapMode 'cartesian'.
 * It creates NumberProperties for the x and y components that are controlled by NumberPickers, and
 * adjusts its x and y components based on the values of those Properties.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import BaseVector from './BaseVector.js';
import VectorAdditionScene from './VectorAdditionScene.js';
import VectorSet from './VectorSet.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';

export default class CartesianBaseVector extends BaseVector {

  // The x and y components of the vector
  public readonly xComponentProperty: NumberProperty;
  public readonly yComponentProperty: NumberProperty;

  /**
   * @param initialTailPosition - starting tail position of the Base Vector
   * @param initialComponents - starting components of the Base Vector
   * @param scene - the scene the Base Vector belongs to
   * @param vectorSet - the set that the Base Vector belongs to
   * @param symbolProperty - the symbol for the Base Vector (e.g. 'a', 'b', 'c', ...)
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

    affirm( scene.coordinateSnapMode === 'cartesian', `invalid coordinateSnapMode: ${scene.coordinateSnapMode}` );

    super( initialTailPosition, initialComponents, scene, vectorSet, symbolProperty, tandemNameSymbol, {
      tandem: tandem
    } );

    this.xComponentProperty = new NumberProperty( this.xComponent, {
      numberType: 'Integer',
      range: VectorAdditionConstants.XY_COMPONENT_RANGE,
      tandem: tandem.createTandem( 'xComponentProperty' )
    } );

    this.yComponentProperty = new NumberProperty( this.yComponent, {
      numberType: 'Integer',
      range: VectorAdditionConstants.XY_COMPONENT_RANGE,
      tandem: tandem.createTandem( 'yComponentProperty' )
    } );

    // Observe when the component NumberProperties change and update the components to match.
    this.xComponentProperty.link( xComponent => { this.xComponent = xComponent; } );
    this.yComponentProperty.link( yComponent => { this.yComponent = yComponent; } );
  }

  public override reset(): void {
    this.xComponentProperty.reset();
    this.yComponentProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'CartesianBaseVector', CartesianBaseVector );