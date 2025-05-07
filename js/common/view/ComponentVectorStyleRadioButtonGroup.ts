// Copyright 2019-2025, University of Colorado Boulder

/**
 * ComponentVectorStyleRadioButtonGroup is a group of radio buttons, arranged in a grid, for selecting component vector style.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import vectorAddition from '../../vectorAddition.js';
import { ComponentVectorStyle, ComponentVectorStyleValues } from '../model/ComponentVectorStyle.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

export default class ComponentVectorStyleRadioButtonGroup extends RectangularRadioButtonGroup<ComponentVectorStyle> {

  public constructor( componentVectorStyleProperty: StringUnionProperty<ComponentVectorStyle>, tandem: Tandem ) {

    const items: RectangularRadioButtonGroupItem<ComponentVectorStyle>[] = ComponentVectorStyleValues.map( componentVectorStyle => {
      return {
        value: componentVectorStyle,
        createNode: () => VectorAdditionIconFactory.createComponentStyleRadioButtonIcon( componentVectorStyle ),
        tandemName: `${componentVectorStyle}RadioButton`
      };
    } );

    const options = combineOptions<RectangularRadioButtonGroupOptions>( {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {
      isDisposable: false,

      // These options are a bit of a hack to implement a 2x2 grid.
      // Values were set empirically to make the vertical and horizontal spacing look the same.
      orientation: 'horizontal',
      preferredWidth: 134,
      wrap: true,
      spacing: 4,
      lineSpacing: 8,

      tandem: tandem
    } );

    super( componentVectorStyleProperty, items, options );
  }
}

vectorAddition.register( 'ComponentVectorStyleRadioButtonGroup', ComponentVectorStyleRadioButtonGroup );