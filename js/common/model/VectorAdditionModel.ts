// Copyright 2019-2023, University of Colorado Boulder

/**
 * VectorAdditionModel is the base class for the top-level model of every screen.
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import ComponentVectorStyles from './ComponentVectorStyles.js';
import TModel from '../../../../joist/js/TModel.js';

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
    assert && assert( false, 'VectorAdditionModel is not intended to be disposed' );
  }
}

vectorAddition.register( 'VectorAdditionModel', VectorAdditionModel );