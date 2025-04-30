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
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';

export default class ComponentVectorStyleRadioButtonGroup extends RectangularRadioButtonGroup<ComponentVectorStyle> {

  public constructor( componentVectorStyleProperty: StringUnionProperty<ComponentVectorStyle>, tandem: Tandem ) {

    const items: RectangularRadioButtonGroupItem<ComponentVectorStyle>[] = ComponentVectorStyleValues.map( componentVectorStyle => {
      return {
        value: componentVectorStyle,
        createNode: () => VectorAdditionIconFactory.createComponentStyleRadioButtonIcon( componentVectorStyle ),
        tandemName: `${componentVectorStyle}RadioButton`
      };
    } );

    super( componentVectorStyleProperty, items, {
      isDisposable: false,

      // These options implement a 2x2 grid.
      orientation: 'horizontal',
      preferredWidth: 120,
      wrap: true,
      spacing: 6,
      lineSpacing: 6,
      
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'ComponentVectorStyleRadioButtonGroup', ComponentVectorStyleRadioButtonGroup );