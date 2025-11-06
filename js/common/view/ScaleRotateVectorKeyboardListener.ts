// Copyright 2025, University of Colorado Boulder

/**
 * ScaleRotateVectorKeyboardListener scales and rotates a vector on the graph, using the keyboard.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import vectorAddition from '../../vectorAddition.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Vector from '../model/Vector.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class ScaleRotateVectorKeyboardListener extends KeyboardListener<OneKeyStroke[]> {

  // Keystrokes and metadata
  public static readonly HOTKEY_DATA = new HotkeyData( {
    keys: [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown', 'w', 'a', 's', 'd' ],
    repoName: vectorAddition.name,
    keyboardHelpDialogLabelStringProperty: VectorAdditionStrings.keyboardHelpDialog.scaleRotateVectorStringProperty
  } );

  public constructor( vector: Vector ) {
    super( {
      tandem: Tandem.OPT_OUT, // View is created dynamically and is not PhET-iO instrumented.
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ ScaleRotateVectorKeyboardListener.HOTKEY_DATA ] ),
      fireOnHold: true,
      fire: ( event, keysPressed ) => {
        phet.log && phet.log( `ScaleRotateVectorKeyboardListener: keysPressed=${keysPressed}` );
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
        vector.moveTipToPositionWithInvariants( vector.tip.plusXY( dx, dy ) );
      }
    } );
  }
}

vectorAddition.register( 'ScaleRotateVectorKeyboardListener', ScaleRotateVectorKeyboardListener );