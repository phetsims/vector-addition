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
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  componentVectorStylePropertyInstrumented?: boolean;
};

export type VectorAdditionModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class VectorAdditionModel implements TModel {

  // the representation (style) used to display component vectors
  public readonly componentVectorStyleProperty: StringUnionProperty<ComponentVectorStyle>;

  protected constructor( providedOptions: VectorAdditionModelOptions ) {

    const options = optionize<VectorAdditionModelOptions, SelfOptions>()( {
      componentVectorStylePropertyInstrumented: true
    }, providedOptions );

    this.componentVectorStyleProperty = new StringUnionProperty( 'invisible', {
      validValues: ComponentVectorStyleValues,
      tandem: options.componentVectorStylePropertyInstrumented ? options.tandem.createTandem( 'componentVectorStyleProperty' ) : Tandem.OPT_OUT
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