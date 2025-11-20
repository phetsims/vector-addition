// Copyright 2025, University of Colorado Boulder

/**
 * SelectVectorKeyboardListener selects or deselects the vector that has focus, using the keyboard.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Vector from '../model/Vector.js';

export default class SelectVectorKeyboardListener extends KeyboardListener<OneKeyStroke[]> {

  // Keystrokes and metadata
  public static readonly HOTKEY_DATA = new HotkeyData( {
    keys: [ 'space' ], //TODO https://github.com/phetsims/vector-addition/issues/401 should this also support enter?
    repoName: vectorAddition.name,
    keyboardHelpDialogLabelStringProperty: VectorAdditionStrings.keyboardHelpDialog.selectOrDeselectStringProperty,
    keyboardHelpDialogPDOMLabelStringProperty: VectorAdditionStrings.a11y.keyboardHelpDialog.vectors.selectOrDeselectDescriptionStringProperty
  } );

  public constructor( vector: Vector ) {
    super( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ SelectVectorKeyboardListener.HOTKEY_DATA ] ),
      fire: ( event, keysPressed ) => {
        phet.log && phet.log( `SelectVectorKeyboardListener: keysPressed=${keysPressed}` );

        // Toggle selection.
        vector.setSelected( !vector.getSelected() );
      }
    } );
  }
}

vectorAddition.register( 'SelectVectorKeyboardListener', SelectVectorKeyboardListener );