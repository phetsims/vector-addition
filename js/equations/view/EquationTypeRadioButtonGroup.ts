// Copyright 2019-2025, University of Colorado Boulder

/**
 * View for the radio button group near the top of the scene that allows the user to select a equation type.
 *
 * See EquationType.js
 *
 * 'Is a' relationship with RectangularRadioButtonGroup but adds:
 *    - Radio button for 'addition' => 'a' + 'b' = 'c'
 *    - Radio button for 'subtraction' => 'a' - 'b' = 'c'
 *    - Radio button for 'negation' => 'a' + 'b' + 'c' = 0
 *
 * Icons created from the VectorAdditionIconFactory.
 *
 * EquationTypeRadioButtonGroup is never disposed and exists for the entire simulation.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../../vectorAddition.js';
import { EquationType, EquationTypeValues } from '../model/EquationType.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type EquationTypeRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class EquationTypeRadioButtonGroup extends RectangularRadioButtonGroup<EquationType> {

  public constructor( equationTypeProperty: StringUnionProperty<EquationType>,
                      vectorSymbolProperties: TReadOnlyProperty<string>[], // symbols on the buttons
                      alignGroup: AlignGroup,
                      providedOptions: EquationTypeRadioButtonGroupOptions ) {

    const options = optionize4<EquationTypeRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()(
      {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {
        xMargin: 8,
        scale: 0.75,
        isDisposable: false
      }, providedOptions );

    // Create the description of the buttons
    const items: RectangularRadioButtonGroupItem<EquationType>[] = [];
    EquationTypeValues.forEach( equationType => {
      items.push( {
        value: equationType,
        createNode: () => new AlignBox( VectorAdditionIconFactory.createEquationTypeIcon( equationType, vectorSymbolProperties ), {
          group: alignGroup
        } ),
        tandemName: `${equationType}RadioButton`
      } );
    } );

    super( equationTypeProperty, items, options );
  }
}

vectorAddition.register( 'EquationTypeRadioButtonGroup', EquationTypeRadioButtonGroup );