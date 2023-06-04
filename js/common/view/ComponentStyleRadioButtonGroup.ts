// Copyright 2019-2023, University of Colorado Boulder

/**
 * ComponentStyleRadioButtonGroup is a group of radio buttons, arranged in a grid, for selecting component style.
 * It does not use RectangularRadioButtonGroup, because that class does not support a grid layout.
 * See https://github.com/phetsims/sun/issues/513 for context.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import RectangularRadioButton from '../../../../sun/js/buttons/RectangularRadioButton.js';
import vectorAddition from '../../vectorAddition.js';
import ComponentVectorStyles from '../model/ComponentVectorStyles.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import GridBox from './GridBox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';

export default class ComponentStyleRadioButtonGroup extends Node {

  public constructor( componentStyleProperty: EnumerationProperty<ComponentVectorStyles> ) {

    // Create the radio buttons. Note that order of enum values determines order of buttons.
    const buttons: RectangularRadioButton<ComponentVectorStyles>[] = [];
    ComponentVectorStyles.enumeration.values.forEach( componentStyle => {
      buttons.push( new RectangularRadioButton( componentStyleProperty, componentStyle,
        merge( {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {
          content: VectorAdditionIconFactory.createComponentStyleRadioButtonIcon( componentStyle )
        } ) ) );
    } );

    // Arrange the buttons in a grid
    const gridBox = new GridBox( buttons, {
      columns: 2
    } );

    super( {
      children: [ gridBox ]
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'ComponentStyleRadioButtonGroup is not intended to be disposed' );
    super.dispose();
  }
}

vectorAddition.register( 'ComponentStyleRadioButtonGroup', ComponentStyleRadioButtonGroup );