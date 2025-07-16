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
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;

type LabVectorSetOptions = SelfOptions & StrictOmit<VectorSetOptions, 'sumTandemSymbol'>;

export default class LabVectorSet extends VectorSet {

  public readonly symbolProperty: TReadOnlyProperty<string>;

  /**
   * @param scene - the scene the VectorSet belongs to
   * @param symbolProperty - the symbol for the vectors in the set
   * @param componentVectorStyleProperty - component style for all vectors
   * @param vectorColorPalette - color palette for vectors in this set
   * @param tandemSymbol - symbol for the vector set used in tandem names
   * @param providedOptions
   */
  public constructor( scene: VectorAdditionScene,
                      symbolProperty: TReadOnlyProperty<string>,
                      tandemSymbol: string,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      vectorColorPalette: VectorColorPalette,
                      providedOptions: LabVectorSetOptions ) {

    const options = optionize<LabVectorSetOptions, SelfOptions, VectorSetOptions>()( {

      // VectorSetOptions
      // Sum vectors are labeled with 's' and the vector set symbol subscript.
      sumSymbolProperty: new DerivedProperty(
        [ VectorAdditionSymbols.sStringProperty, symbolProperty ],
        ( sString, vectorSetSymbol ) => `${sString}<sub>${vectorSetSymbol}</sub>` ),

      //  Symbol for the sum vector used in tandem names.
      sumTandemSymbol: `s${tandemSymbol}`
    }, providedOptions );

    super( scene, componentVectorStyleProperty, vectorColorPalette, options );

    this.symbolProperty = symbolProperty;
  }
}

vectorAddition.register( 'LabVectorSet', LabVectorSet );