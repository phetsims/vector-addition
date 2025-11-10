// Copyright 2025, University of Colorado Boulder

/**
 * ScaleRotateVectorKeyboardListener scales and rotates a vector on the graph, using the keyboard.
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
import VectorTipNode from './VectorTipNode.js';

export default class ScaleRotateVectorKeyboardListener extends KeyboardListener<OneKeyStroke[]> {

  // Keystrokes and metadata
  public static readonly HOTKEY_DATA = new HotkeyData( {
    keys: [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown', 'w', 'a', 's', 'd' ],
    repoName: vectorAddition.name,
    keyboardHelpDialogLabelStringProperty: VectorAdditionStrings.keyboardHelpDialog.scaleRotateVectorStringProperty,
    keyboardHelpDialogPDOMLabelStringProperty: VectorAdditionStrings.a11y.keyboardHelpDialog.vectors.scaleRotateDescriptionStringProperty
  } );

  public constructor( vector: Vector, tipNode: VectorTipNode ) {
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
        tipNode.doAccessibleObjectResponse();
      }
    } );
  }
}

vectorAddition.register( 'ScaleRotateVectorKeyboardListener', ScaleRotateVectorKeyboardListener );