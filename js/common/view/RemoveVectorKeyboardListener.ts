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
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import VectorNode from './VectorNode.js';

export default class RemoveVectorKeyboardListener extends KeyboardListener<OneKeyStroke[]> {

  // Keystrokes and metadata
  public static readonly HOTKEY_DATA = new HotkeyData( {
    keys: [ 'delete', 'backspace' ],
    repoName: vectorAddition.name,
    keyboardHelpDialogLabelStringProperty: VectorAdditionStrings.keyboardHelpDialog.removeVectorFromGraphStringProperty
  } );

  public constructor( vector: Vector, vectorNode: VectorNode ) {
    super( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ RemoveVectorKeyboardListener.HOTKEY_DATA ] ),
      fire: ( event, keysPressed ) => {
        phet.log && phet.log( `keysPressed=${keysPressed}` );
        vectorNode.addAccessibleContextResponse( StringUtils.fillIn( VectorAdditionStrings.a11y.vectorRemovedFromGraphAreaStringProperty, {
          symbol: vector.accessibleSymbolProperty.value
        } ) );
        vector.returnToToolbox();
      }
    } );
  }
}

vectorAddition.register( 'RemoveVectorKeyboardListener', RemoveVectorKeyboardListener );