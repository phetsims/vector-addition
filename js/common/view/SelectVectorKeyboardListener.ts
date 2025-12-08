// Copyright 2025, University of Colorado Boulder

/**
 * SelectVectorKeyboardListener selects or deselects the vector that has focus, using the keyboard.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import sharedSoundPlayers from '../../../../tambo/js/sharedSoundPlayers.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Vector from '../model/Vector.js';

const SELECTED_SOUND = sharedSoundPlayers.get( 'checkboxChecked' );
const DESELECTED_SOUND = sharedSoundPlayers.get( 'checkboxUnchecked' );

export default class SelectVectorKeyboardListener extends KeyboardListener<OneKeyStroke[]> {

  // Keystrokes and metadata
  public static readonly HOTKEY_DATA = new HotkeyData( {
    keys: [ 'space', 'enter' ],
    repoName: vectorAddition.name,
    keyboardHelpDialogLabelStringProperty: VectorAdditionStrings.keyboardHelpDialog.selectOrDeselectStringProperty,
    keyboardHelpDialogPDOMLabelStringProperty:
      new PatternStringProperty( VectorAdditionStrings.a11y.keyboardHelpDialog.vectors.selectOrDeselectDescriptionStringProperty, {
        enterKey: TextKeyNode.getEnterKeyString() // platform-specific
      } )
  } );

  public constructor( vector: Vector ) {
    super( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ SelectVectorKeyboardListener.HOTKEY_DATA ] ),
      fire: ( event, keysPressed ) => {
        phet.log && phet.log( `SelectVectorKeyboardListener: keysPressed=${keysPressed}` );

        // Toggle selection.
        vector.setSelected( !vector.getSelected() );

        // Play sound
        vector.getSelected() ? SELECTED_SOUND.play() : DESELECTED_SOUND.play();
      }
    } );
  }
}

vectorAddition.register( 'SelectVectorKeyboardListener', SelectVectorKeyboardListener );