// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationTypeRadioButtonGroup is the radio button group that allows the user to select an equation type.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
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
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';

type SelfOptions = EmptySelfOptions;

type EquationTypeRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class EquationTypeRadioButtonGroup extends RectangularRadioButtonGroup<EquationType> {

  public constructor( equationTypeProperty: StringUnionProperty<EquationType>,
                      symbolProperties: TReadOnlyProperty<string>[], // symbols in the equations that appear on the buttons
                      alignGroup: AlignGroup,
                      providedOptions: EquationTypeRadioButtonGroupOptions ) {

    affirm( symbolProperties.length === 3 );

    // Shared by the PatternStringProperty instances for the group and all radio buttons.
    const patternStringPropertyOptions = {
      symbol1: RichText.getAccessibleStringProperty( symbolProperties[ 0 ] ),
      symbol2: RichText.getAccessibleStringProperty( symbolProperties[ 1 ] ),
      symbol3: RichText.getAccessibleStringProperty( symbolProperties[ 2 ] )
    };

    const options = optionize4<EquationTypeRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()(
      {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {

        // RectangularRadioButtonGroupOptions
        isDisposable: false,
        xMargin: 8,
        scale: 0.75,
        accessibleName: VectorAdditionStrings.a11y.equationTypeRadioButtonGroup.accessibleNameStringProperty,
        accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.equationTypeRadioButtonGroup.accessibleHelpTextStringProperty, patternStringPropertyOptions )
      }, providedOptions );

    const items: RectangularRadioButtonGroupItem<EquationType>[] = [

      // Cartesian scene: a + b = c
      // Polar scene: d + e = f
      {
        value: 'addition',
        createNode: () => new AlignBox( VectorAdditionIconFactory.createEquationTypeIcon( 'addition', symbolProperties ), {
          group: alignGroup
        } ),
        tandemName: 'additionRadioButton',
        options: {
          accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.additionRadioButton.accessibleNameStringProperty, patternStringPropertyOptions )
        }
      },

      // Cartesian scene: a - b = c
      // Polar scene: d - e = f
      {
        value: 'subtraction',
        createNode: () => new AlignBox( VectorAdditionIconFactory.createEquationTypeIcon( 'subtraction', symbolProperties ), {
          group: alignGroup
        } ),
        tandemName: 'subtractionRadioButton',
        options: {
          accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.subtractionRadioButton.accessibleNameStringProperty, patternStringPropertyOptions )
        }
      },

      // Cartesian scene: a + b + c = 0
      // Polar scene: d + e + f = 0
      {
        value: 'negation',
        createNode: () => new AlignBox( VectorAdditionIconFactory.createEquationTypeIcon( 'negation', symbolProperties ), {
          group: alignGroup
        } ),
        tandemName: 'negationRadioButton',
        options: {
          accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.negationRadioButton.accessibleNameStringProperty, patternStringPropertyOptions )
        }
      }
    ];

    super( equationTypeProperty, items, options );
  }
}

vectorAddition.register( 'EquationTypeRadioButtonGroup', EquationTypeRadioButtonGroup );