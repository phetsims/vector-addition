// Copyright 2019-2025, University of Colorado Boulder

/**
 * ComponentsRadioButtonGroup is a group of radio buttons, arranged in a grid, for selecting component vector style.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import vectorAddition from '../../vectorAddition.js';
import { ComponentVectorStyle } from '../model/ComponentVectorStyle.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class ComponentsRadioButtonGroup extends RectangularRadioButtonGroup<ComponentVectorStyle> {

  public constructor( componentVectorStyleProperty: StringUnionProperty<ComponentVectorStyle>, tandem: Tandem ) {

    const items: RectangularRadioButtonGroupItem<ComponentVectorStyle>[] = [
      {
        value: 'invisible',
        createNode: () => VectorAdditionIconFactory.createComponentStyleRadioButtonIcon( 'invisible' ),
        tandemName: 'invisibleRadioButton',
        options: {
          accessibleName: VectorAdditionStrings.a11y.invisibleRadioButton.accessibleNameStringProperty,
          accessibleHelpText: VectorAdditionStrings.a11y.invisibleRadioButton.accessibleHelpTextStringProperty
        }
      },
      {
        value: 'triangle',
        createNode: () => VectorAdditionIconFactory.createComponentStyleRadioButtonIcon( 'triangle' ),
        tandemName: 'triangleRadioButton',
        options: {
          accessibleName: VectorAdditionStrings.a11y.triangleRadioButton.accessibleNameStringProperty,
          accessibleHelpText: VectorAdditionStrings.a11y.triangleRadioButton.accessibleHelpTextStringProperty
        }
      },
      {
        value: 'parallelogram',
        createNode: () => VectorAdditionIconFactory.createComponentStyleRadioButtonIcon( 'parallelogram' ),
        tandemName: 'parallelogramRadioButton',
        options: {
          accessibleName: VectorAdditionStrings.a11y.parallelogramRadioButton.accessibleNameStringProperty,
          accessibleHelpText: VectorAdditionStrings.a11y.parallelogramRadioButton.accessibleHelpTextStringProperty
        }
      },
      {
        value: 'projection',
        createNode: () => VectorAdditionIconFactory.createComponentStyleRadioButtonIcon( 'projection' ),
        tandemName: 'projectionRadioButton',
        options: {
          accessibleName: VectorAdditionStrings.a11y.projectionRadioButton.accessibleNameStringProperty,
          accessibleHelpText: VectorAdditionStrings.a11y.projectionRadioButton.accessibleHelpTextStringProperty
        }
      }
    ];

    const options = combineOptions<RectangularRadioButtonGroupOptions>( {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {
      isDisposable: false,
      accessibleName: VectorAdditionStrings.a11y.componentsRadioButtonGroup.accessibleNameStringProperty,
      accessibleHelpText: VectorAdditionStrings.a11y.componentsRadioButtonGroup.accessibleHelpTextStringProperty,
      tandem: tandem,

      // These options are a bit of a hack to implement a 2x2 grid.
      // Values were set empirically to make the vertical and horizontal spacing look the same.
      // See https://github.com/phetsims/vector-addition/issues/299.
      orientation: 'horizontal',
      preferredWidth: 134,
      wrap: true,
      spacing: 4,
      lineSpacing: 8
    } );

    super( componentVectorStyleProperty, items, options );
  }
}

vectorAddition.register( 'ComponentsRadioButtonGroup', ComponentsRadioButtonGroup );