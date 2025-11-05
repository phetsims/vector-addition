// Copyright 2025, University of Colorado Boulder

/**
 * RemoveVectorKeyboardListener moves a vector from the graph to the toolbox, using the keyboard.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Vector from '../model/Vector.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class RemoveVectorKeyboardListener extends KeyboardListener<OneKeyStroke[]> {

  // Keystrokes and metadata
  public static readonly HOTKEY_DATA = new HotkeyData( {
    keys: [ 'delete', 'backspace' ],
    repoName: vectorAddition.name,
    keyboardHelpDialogLabelStringProperty: VectorAdditionStrings.keyboardHelpDialog.removeVectorFromGraphStringProperty
  } );

  public constructor( vector: Vector ) {
    super( {
      tandem: Tandem.OPT_OUT, // View is created dynamically and is not PhET-iO instrumented.
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ RemoveVectorKeyboardListener.HOTKEY_DATA ] ),
      fire: ( event, keysPressed ) => {
        phet.log && phet.log( `keysPressed=${keysPressed}` );
        vector.returnToToolbox();
      }
    } );
  }
}

vectorAddition.register( 'RemoveVectorKeyboardListener', RemoveVectorKeyboardListener );