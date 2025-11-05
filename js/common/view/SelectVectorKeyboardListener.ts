// Copyright 2025, University of Colorado Boulder

/**
 * SelectVectorKeyboardListener makes the vector the selected vector, using the keyboard.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Vector from '../model/Vector.js';

export default class SelectVectorKeyboardListener extends KeyboardListener<OneKeyStroke[]> {

  // Keystrokes and metadata
  public static readonly HOTKEY_DATA = new HotkeyData( {
    keys: [ 'space' ],
    repoName: vectorAddition.name,
    keyboardHelpDialogLabelStringProperty: VectorAdditionStrings.keyboardHelpDialog.selectVectorStringProperty
  } );

  public constructor( vector: Vector ) {
    super( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ SelectVectorKeyboardListener.HOTKEY_DATA ] ),
      fire: ( event, keysPressed ) => {
        phet.log && phet.log( `SelectVectorKeyboardListener: keysPressed=${keysPressed}` );
        vector.select();
      }
    } );
  }
}

vectorAddition.register( 'SelectVectorKeyboardListener', SelectVectorKeyboardListener );