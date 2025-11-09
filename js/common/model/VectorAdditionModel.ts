// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorAdditionModel is the base class for the top-level model of every screen.
 *
 * @author Martin Veillette
 */

import Disposable from '../../../../axon/js/Disposable.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import { ComponentVectorStyle, ComponentVectorStyleValues } from './ComponentVectorStyle.js';
import VectorAdditionScene from './VectorAdditionScene.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions<S extends VectorAdditionScene> = {
  componentVectorStylePropertyInstrumented?: boolean;
  createScenes: ( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, scenesTandem: Tandem ) => S[];
};

export type VectorAdditionModelOptions<S extends VectorAdditionScene> = SelfOptions<S> & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class VectorAdditionModel<S extends VectorAdditionScene> implements TModel {

  // The scenes that are available in this screen.
  public readonly scenes: S[];

  // The selected scene
  public readonly sceneProperty: Property<S>;

  // The representation (style) used to display component vectors.
  // This is in the model because it affects the computation of the component vectors.
  public readonly componentVectorStyleProperty: StringUnionProperty<ComponentVectorStyle>;

  protected constructor( providedOptions: VectorAdditionModelOptions<S> ) {

    const options = optionize<VectorAdditionModelOptions<S>, SelfOptions<S>>()( {

      // SelfOptions
      componentVectorStylePropertyInstrumented: true
    }, providedOptions );

    this.componentVectorStyleProperty = new StringUnionProperty( 'invisible', {
      validValues: ComponentVectorStyleValues,
      tandem: options.componentVectorStylePropertyInstrumented ? options.tandem.createTandem( 'componentVectorStyleProperty' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'The representation (style) used to display component vectors.',
      phetioFeatured: true
    } );

    this.scenes = options.createScenes( this.componentVectorStyleProperty, options.tandem.createTandem( 'scenes' ) );

    this.sceneProperty = new Property( this.scenes[ 0 ], {
      validValues: this.scenes,
      tandem: options.tandem.createTandem( 'sceneProperty' ),
      phetioFeatured: true,
      phetioValueType: VectorAdditionScene.VectorAdditionSceneIO
    } );
  }

  public reset(): void {
    this.componentVectorStyleProperty.reset();
    this.scenes.forEach( scene => scene.reset() );
    this.sceneProperty.reset();
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }
}

vectorAddition.register( 'VectorAdditionModel', VectorAdditionModel );