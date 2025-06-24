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
import { EquationType } from '../model/EquationType.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';

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

        // RectangularRadioButtonGroupOptions
        isDisposable: false,
        xMargin: 8,
        scale: 0.75,
        accessibleName: VectorAdditionStrings.a11y.equationTypeRadioButtonGroup.accessibleNameStringProperty,
        accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.equationTypeRadioButtonGroup.accessibleHelpTextStringProperty, {
          symbol1: vectorSymbolProperties[ 0 ],
          symbol2: vectorSymbolProperties[ 1 ],
          symbol3: vectorSymbolProperties[ 2 ]
        } )
      }, providedOptions );

    const items: RectangularRadioButtonGroupItem<EquationType>[] = [
      {
        value: 'addition',
        createNode: () => new AlignBox( VectorAdditionIconFactory.createEquationTypeIcon( 'addition', vectorSymbolProperties ), {
          group: alignGroup
        } ),
        tandemName: 'additionRadioButton',
        options: {
          accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.additionRadioButton.accessibleNameStringProperty, {
            symbol1: vectorSymbolProperties[ 0 ],
            symbol2: vectorSymbolProperties[ 1 ],
            symbol3: vectorSymbolProperties[ 2 ]
          } )
        }
      },
      {
        value: 'subtraction',
        createNode: () => new AlignBox( VectorAdditionIconFactory.createEquationTypeIcon( 'subtraction', vectorSymbolProperties ), {
          group: alignGroup
        } ),
        tandemName: 'subtractionRadioButton',
        options: {
          accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.subtractionRadioButton.accessibleNameStringProperty, {
            symbol1: vectorSymbolProperties[ 0 ],
            symbol2: vectorSymbolProperties[ 1 ],
            symbol3: vectorSymbolProperties[ 2 ]
          } )
        }
      },
      {
        value: 'negation',
        createNode: () => new AlignBox( VectorAdditionIconFactory.createEquationTypeIcon( 'negation', vectorSymbolProperties ), {
          group: alignGroup
        } ),
        tandemName: 'negationRadioButton',
        options: {
          accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.negationRadioButton.accessibleNameStringProperty, {
            symbol1: vectorSymbolProperties[ 0 ],
            symbol2: vectorSymbolProperties[ 1 ],
            symbol3: vectorSymbolProperties[ 2 ]
          } )
        }
      }
    ];

    super( equationTypeProperty, items, options );
  }
}

vectorAddition.register( 'EquationTypeRadioButtonGroup', EquationTypeRadioButtonGroup );