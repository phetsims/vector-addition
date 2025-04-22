// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorAdditionModel is the base class for the top-level model of every screen.
 *
 * @author Martin Veillette
 */

import Disposable from '../../../../axon/js/Disposable.js';
import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import { ComponentVectorStyle, ComponentVectorStyleValues } from './ComponentVectorStyle.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';

export default class VectorAdditionModel implements TModel {

  // the representation (style) used to display component vectors
  public readonly componentVectorStyleProperty: StringUnionProperty<ComponentVectorStyle>;

  protected constructor( tandem: Tandem ) {

    this.componentVectorStyleProperty = new StringUnionProperty( 'invisible', {
      validValues: ComponentVectorStyleValues,
      tandem: tandem.createTandem( 'componentVectorStyleProperty' )
    } );
  }

  public reset(): void {
    this.componentVectorStyleProperty.reset();
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }
}

vectorAddition.register( 'VectorAdditionModel', VectorAdditionModel );