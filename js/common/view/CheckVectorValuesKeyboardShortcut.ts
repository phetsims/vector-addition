// Copyright 2025, University of Colorado Boulder

/**
 * CheckVectorValuesKeyboardShortcut reads the vector values for the vector that has focus. The class name designates
 * this as a "shortcut" because the information can also be accessed via the "Vector Values" accordion box.
 * As a side effect, it also selects the vector.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import sharedSoundPlayers from '../../../../tambo/js/sharedSoundPlayers.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Vector from '../model/Vector.js';
import VectorNode from './VectorNode.js';
import { VectorValuesAccessibleParagraphProperty } from './VectorValuesAccessibleParagraphProperty.js';

export default class CheckVectorValuesKeyboardShortcut extends KeyboardListener<OneKeyStroke[]> {

  // Keystrokes and metadata
  public static readonly HOTKEY_DATA = new HotkeyData( {
    keys: [ 'alt+c' ],
    repoName: vectorAddition.name,
    keyboardHelpDialogLabelStringProperty: VectorAdditionStrings.keyboardHelpDialog.checkVectorValuesStringProperty
  } );

  public constructor( vector: Vector, vectorNode: VectorNode ) {

    // The same information that is displayed by the 'Vector Values' accordion box.
    const accessibleParagraphProperty = new VectorValuesAccessibleParagraphProperty( vector );

    super( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ CheckVectorValuesKeyboardShortcut.HOTKEY_DATA ] ),
      fire: ( event, keysPressed ) => {
        phet.log && phet.log( `VectorValuesKeyboardShortcut: keysPressed=${keysPressed}` );

        // Using this shortcut selects the vector.
        // See https://github.com/phetsims/vector-addition/issues/362#issuecomment-3517721350.
        vector.setSelected( true );

        // Describe what the Vector Values' accordion box is displaying.
        vectorNode.addAccessibleObjectResponse( accessibleParagraphProperty.value );

        sharedSoundPlayers.get( 'generalOpen' ).play();
      }
    } );

    this.disposeEmitter.addListener( () => {
      accessibleParagraphProperty.dispose();
    } );
  }
}

vectorAddition.register( 'CheckVectorValuesKeyboardShortcut', CheckVectorValuesKeyboardShortcut );