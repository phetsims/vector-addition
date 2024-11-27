// Copyright 2019-2024, University of Colorado Boulder

/**
 * VectorAdditionModel is the base class for the top-level model of every screen.
 *
 * @author Martin Veillette
 */

import Disposable from '../../../../axon/js/Disposable.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import ComponentVectorStyles from './ComponentVectorStyles.js';

export default class VectorAdditionModel implements TModel {

  // the representation (style) used to display component vectors
  public readonly componentStyleProperty: EnumerationProperty<ComponentVectorStyles>;

  protected constructor( tandem: Tandem ) {
    this.componentStyleProperty = new EnumerationProperty( ComponentVectorStyles.INVISIBLE );
  }

  public reset(): void {
    this.componentStyleProperty.reset();
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }
}

vectorAddition.register( 'VectorAdditionModel', VectorAdditionModel );