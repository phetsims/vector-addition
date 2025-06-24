// Copyright 2025, University of Colorado Boulder

/**
 * LabVectorSet is a specialization of VectorSet for the 'Lab' screen. It adds a symbol for the vectors in the set.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorSet, { VectorSetOptions } from '../../common/model/VectorSet.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import Property from '../../../../axon/js/Property.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

type LabVectorSetOptions = SelfOptions & VectorSetOptions;

export default class LabVectorSet extends VectorSet {

  public readonly symbolProperty: TReadOnlyProperty<string>;

  /**
   * @param scene - the scene the VectorSet belongs to
   * @param symbolProperty - the symbol for the vectors in the set
   * @param componentVectorStyleProperty - component style for all vectors
   * @param sumVisibleProperty - controls whether the sum vector is visible
   * @param vectorColorPalette - color palette for vectors in this set
   * @param providedOptions
   */
  public constructor( scene: VectorAdditionScene,
                      symbolProperty: TReadOnlyProperty<string>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sumVisibleProperty: Property<boolean>,
                      vectorColorPalette: VectorColorPalette,
                      providedOptions: LabVectorSetOptions ) {

    super( scene, componentVectorStyleProperty, sumVisibleProperty, vectorColorPalette, providedOptions );

    this.symbolProperty = symbolProperty;
  }
}

vectorAddition.register( 'LabVectorSet', LabVectorSet );