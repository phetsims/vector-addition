// Copyright 2019-2025, University of Colorado Boulder

/**
 * ComponentVectorStyleRadioButtonGroup is a group of radio buttons, arranged in a grid, for selecting component vector
 * style. It does not use RectangularRadioButtonGroup, because that class does not support a grid layout.
 * See https://github.com/phetsims/sun/issues/513 for context.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RectangularRadioButton, { RectangularRadioButtonOptions } from '../../../../sun/js/buttons/RectangularRadioButton.js';
import vectorAddition from '../../vectorAddition.js';
import { ComponentVectorStyle, ComponentVectorStyleValues } from '../model/ComponentVectorStyle.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import GridBox from './GridBox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';

export default class ComponentVectorStyleRadioButtonGroup extends Node {

  public constructor( componentVectorStyleProperty: StringUnionProperty<ComponentVectorStyle>, tandem: Tandem ) {

    // Create the radio buttons. Note that order of enum values determines order of buttons.
    const buttons: RectangularRadioButton<ComponentVectorStyle>[] = [];
    ComponentVectorStyleValues.forEach( componentVectorStyle => {
      buttons.push( new RectangularRadioButton( componentVectorStyleProperty, componentVectorStyle,
        combineOptions<RectangularRadioButtonOptions>( {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS.radioButtonOptions, {
          content: VectorAdditionIconFactory.createComponentStyleRadioButtonIcon( componentVectorStyle ),
          tandem: tandem.createTandem( `${componentVectorStyle}RadioButton` )
        } ) ) );
    } );

    // Arrange the buttons in a grid
    const gridBox = new GridBox( buttons, {
      columns: 2
    } );

    super( {
      children: [ gridBox ],
      isDisposable: false,
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'ComponentVectorStyleRadioButtonGroup', ComponentVectorStyleRadioButtonGroup );