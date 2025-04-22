// Copyright 2019-2025, University of Colorado Boulder

/**
 * ComponentStyleRadioButtonGroup is a group of radio buttons, arranged in a grid, for selecting component style.
 * It does not use RectangularRadioButtonGroup, because that class does not support a grid layout.
 * See https://github.com/phetsims/sun/issues/513 for context.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RectangularRadioButton, { RectangularRadioButtonOptions } from '../../../../sun/js/buttons/RectangularRadioButton.js';
import vectorAddition from '../../vectorAddition.js';
import ComponentVectorStyle from '../model/ComponentVectorStyle.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import GridBox from './GridBox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class ComponentStyleRadioButtonGroup extends Node {

  public constructor( componentStyleProperty: EnumerationProperty<ComponentVectorStyle>, tandem: Tandem ) {

    // Create the radio buttons. Note that order of enum values determines order of buttons.
    const buttons: RectangularRadioButton<ComponentVectorStyle>[] = [];
    ComponentVectorStyle.enumeration.values.forEach( componentStyle => {
      buttons.push( new RectangularRadioButton( componentStyleProperty, componentStyle,
        combineOptions<RectangularRadioButtonOptions>( {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS.radioButtonOptions, {
          content: VectorAdditionIconFactory.createComponentStyleRadioButtonIcon( componentStyle ),
          tandem: tandem.createTandem( `${componentStyle}RadioButton` )
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

vectorAddition.register( 'ComponentStyleRadioButtonGroup', ComponentStyleRadioButtonGroup );