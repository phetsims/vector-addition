// Copyright 2019-2024, University of Colorado Boulder

/**
 * View for the radio button group near the top of the scene that allows the user to select a equation type.
 *
 * See EquationTypes.js
 *
 * 'Is a' relationship with RectangularRadioButtonGroup but adds:
 *    - Radio button for 'ADDITION' => 'a' + 'b' = 'c'
 *    - Radio button for 'SUBTRACTION' => 'a' - 'b' = 'c'
 *    - Radio button for 'NEGATION' => 'a' + 'b' + 'c' = 0
 *
 * Icons created from the VectorAdditionIconFactory.
 *
 * EquationTypesRadioButtonGroup is never disposed and exists for the entire simulation.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import { AlignBox, AlignGroup, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../../vectorAddition.js';
import EquationTypes from '../model/EquationTypes.js';

type SelfOptions = EmptySelfOptions;

type EquationTypesRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions;

export default class EquationTypesRadioButtonGroup extends RectangularRadioButtonGroup<EquationTypes> {

  public constructor( equationTypeProperty: EnumerationProperty<EquationTypes>,
                      vectorSymbolProperties: TReadOnlyProperty<string>[], // symbols on the buttons
                      alignGroup: AlignGroup,
                      providedOptions?: EquationTypesRadioButtonGroupOptions ) {

    const options = optionize4<EquationTypesRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()(
      {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {
        xMargin: 12,
        scale: 0.75,
        isDisposable: false
      }, providedOptions );

    // Create the description of the buttons
    const items: RectangularRadioButtonGroupItem<EquationTypes>[] = [];
    EquationTypes.enumeration.values.forEach( equationType => {
      items.push( {
        value: equationType,
        createNode: () => new AlignBox( VectorAdditionIconFactory.createEquationTypeIcon( equationType, vectorSymbolProperties ), {
          group: alignGroup
        } )
      } );
    } );

    super( equationTypeProperty, items, options );
  }
}

vectorAddition.register( 'EquationTypesRadioButtonGroup', EquationTypesRadioButtonGroup );