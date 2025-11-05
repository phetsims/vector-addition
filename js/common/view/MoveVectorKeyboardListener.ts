// Copyright 2025, University of Colorado Boulder

/**
 * MoveVectorKeyboardListener moves (translates) a vector on the graph, using the keyboard.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import vectorAddition from '../../vectorAddition.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Vector from '../model/Vector.js';

export default class MoveVectorKeyboardListener extends KeyboardListener<OneKeyStroke[]> {

  // Keystrokes and metadata
  public static readonly HOTKEY_DATA = new HotkeyData( {
    keys: [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown', 'w', 'a', 's', 'd' ],
    repoName: vectorAddition.name,
    keyboardHelpDialogLabelStringProperty: VectorAdditionStrings.keyboardHelpDialog.moveVectorStringProperty
  } );

  public constructor( vector: Vector ) {
    super( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ MoveVectorKeyboardListener.HOTKEY_DATA ] ),
      fire: ( event, keysPressed ) => {
        phet.log && phet.log( `keysPressed=${keysPressed}` );
        let dx = 0;
        let dy = 0;
        if ( keysPressed === 'arrowLeft' || keysPressed === 'a' ) {
          dx = -1;
        }
        else if ( keysPressed === 'arrowRight' || keysPressed === 'd' ) {
          dx = 1;
        }
        else if ( keysPressed === 'arrowUp' || keysPressed === 'w' ) {
          dy = 1;
        }
        else if ( keysPressed === 'arrowDown' || keysPressed === 's' ) {
          dy = -1;
        }
        vector.moveTailToPositionWithInvariants( vector.tail.plusXY( dx, dy ) );
      }
    } );
  }
}

vectorAddition.register( 'MoveVectorKeyboardListener', MoveVectorKeyboardListener );