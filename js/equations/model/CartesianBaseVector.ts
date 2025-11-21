// Copyright 2019-2025, University of Colorado Boulder

/**
 * CartesianBaseVector is the subclass of BaseVector used with CoordinateSnapMode 'cartesian'.
 * It creates NumberProperties for the x and y components that are controlled by NumberPickers, and
 * adjusts its xyComponentsProperty based on the values of those Properties.
 *
 * In the Equations screen, xComponentProperty and yComponentProperty are the "ground truth" for the vector's
 * x and y components. xyComponentsProperty cannot be changed via the UI. Changes are made to x and y components
 * individually using NumberPickers.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import Graph from '../../common/model/Graph.js';
import Vector from '../../common/model/Vector.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import BaseVector, { BaseVectorOptions } from './BaseVector.js';

type SelfOptions = EmptySelfOptions;

type CartesianBaseVectorOptions = SelfOptions & BaseVectorOptions;

export default class CartesianBaseVector extends BaseVector {

  // Base vector's x-component, which can be changed in the Equations screen's Cartesian scene via a NumberPicker.
  public readonly xComponentProperty: NumberProperty;

  // Base vctor's y-component, which can be changed in the Equations screen's Cartesian scene via a NumberPicker.
  public readonly yComponentProperty: NumberProperty;

  public constructor( tailPosition: Vector2,
                      xyComponents: Vector2,
                      vectorSet: VectorSet,
                      graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      providedOptions: CartesianBaseVectorOptions ) {

    const options = providedOptions;
    affirm( options.coordinateSnapMode === 'cartesian', `invalid coordinateSnapMode: ${options.coordinateSnapMode}` );

    super( tailPosition, xyComponents, vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, options );

    this.xComponentProperty = new NumberProperty( this.xComponent, {
      numberType: 'Integer',
      range: VectorAdditionConstants.XY_COMPONENT_RANGE,
      tandem: options.tandem.createTandem( 'xComponentProperty' ),
      phetioFeatured: true
    } );

    this.yComponentProperty = new NumberProperty( this.yComponent, {
      numberType: 'Integer',
      range: VectorAdditionConstants.XY_COMPONENT_RANGE,
      tandem: options.tandem.createTandem( 'yComponentProperty' ),
      phetioFeatured: true
    } );

    // When the x-component or y-component changes, update xyComponentsProperty.
    // In the Equations screen, xyComponentsProperty cannot be changed via the UI, so we do not need to listen to it
    // to update xComponentProperty and yComponentProperty.
    Multilink.multilink(
      [ this.xComponentProperty, this.yComponentProperty ],
      ( xComponent, yComponent ) => {
        if ( !isSettingPhetioStateProperty.value ) {
          this.xyComponentsProperty.value = new Vector2( xComponent, yComponent );
        }
      } );
  }

  public override reset(): void {
    this.xComponentProperty.reset();
    this.yComponentProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'CartesianBaseVector', CartesianBaseVector );