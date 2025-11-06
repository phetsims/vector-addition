// Copyright 2025, University of Colorado Boulder

/**
 * VectorsKeyboardHelpSection is the keyboard-help section that describes how to interact with vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import vectorAddition from '../../vectorAddition.js';
import MoveVectorKeyboardListener from './MoveVectorKeyboardListener.js';
import RemoveVectorKeyboardListener from './RemoveVectorKeyboardListener.js';
import SelectVectorKeyboardListener from './SelectVectorKeyboardListener.js';
import ScaleRotateVectorKeyboardListener from './ScaleRotateVectorKeyboardListener.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';

export default class VectorsKeyboardHelpSection extends KeyboardHelpSection {

  public constructor() {

    const rows = [

      // Remove from graph
      KeyboardHelpSectionRow.fromHotkeyData( RemoveVectorKeyboardListener.HOTKEY_DATA ),

      // Select
      KeyboardHelpSectionRow.fromHotkeyData( SelectVectorKeyboardListener.HOTKEY_DATA ),

      // Move
      KeyboardHelpSectionRow.fromHotkeyData( MoveVectorKeyboardListener.HOTKEY_DATA, {
        icon: KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon()
      } ),

      // Scale and rotate via tip
      KeyboardHelpSectionRow.fromHotkeyData( ScaleRotateVectorKeyboardListener.HOTKEY_DATA, {
        icon: KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon()
      } )
    ];

    super( VectorAdditionStrings.keyboardHelpDialog.vectorsStringProperty, rows, {
      textMaxWidth: 300,
      isDisposable: false
    } );
  }
}

vectorAddition.register( 'VectorsKeyboardHelpSection', VectorsKeyboardHelpSection );