// Copyright 2025, University of Colorado Boulder

/**
 * MoveVectorKeyboardListener moves (translates) a vector on the graph, using the keyboard.
 * As a side effect, it also selects the vector.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Vector from '../model/Vector.js';
import VectorNode from './VectorNode.js';

export default class MoveVectorKeyboardListener extends KeyboardListener<OneKeyStroke[]> {

  // Keystrokes and metadata
  public static readonly HOTKEY_DATA = new HotkeyData( {
    keys: [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown', 'w', 'a', 's', 'd' ],
    repoName: vectorAddition.name,
    keyboardHelpDialogLabelStringProperty: VectorAdditionStrings.keyboardHelpDialog.moveVectorStringProperty,
    keyboardHelpDialogPDOMLabelStringProperty: VectorAdditionStrings.a11y.keyboardHelpDialog.vectors.moveDescriptionStringProperty
  } );

  public constructor( vector: Vector, vectorNode: VectorNode ) {
    super( {
      tandem: Tandem.OPT_OUT, // View is created dynamically and is not PhET-iO instrumented.
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ MoveVectorKeyboardListener.HOTKEY_DATA ] ),
      fireOnHold: true,
      fire: ( event, keysPressed ) => {
        phet.log && phet.log( `MoveVectorKeyboardListener: keysPressed=${keysPressed}` );

        // Moving a vector selects it.
        vector.setSelected( true );

        // Move the vector.
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

        // Describe the new position of the vector.
        vectorNode.doAccessibleObjectResponse();
      }
    } );
  }
}

vectorAddition.register( 'MoveVectorKeyboardListener', MoveVectorKeyboardListener );