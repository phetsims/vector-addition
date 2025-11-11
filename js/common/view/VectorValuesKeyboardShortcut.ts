// Copyright 2025, University of Colorado Boulder

/**
 * VectorValuesKeyboardShortcut reads the vector values for the vector that has focus.
 * This is the same information displayed in the "Vector Values" accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Vector from '../model/Vector.js';
import { VectorValuesAccessibleParagraphProperty } from './VectorValuesAccessibleParagraphProperty.js';
import VectorNode from './VectorNode.js';

export default class VectorValuesKeyboardShortcut extends KeyboardListener<OneKeyStroke[]> {

  // Keystrokes and metadata
  public static readonly HOTKEY_DATA = new HotkeyData( {
    keys: [ 'v' ],
    repoName: vectorAddition.name,
    keyboardHelpDialogLabelStringProperty: VectorAdditionStrings.keyboardHelpDialog.vectorValuesStringProperty,
    keyboardHelpDialogPDOMLabelStringProperty: VectorAdditionStrings.a11y.keyboardHelpDialog.vectors.vectorValuesDescriptionStringProperty
  } );

  public constructor( vector: Vector, vectorNode: VectorNode ) {

    // The same information that is displayed by the 'Vector Values' accordion box.
    const accessibleParagraphProperty = new VectorValuesAccessibleParagraphProperty( vector );

    super( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ VectorValuesKeyboardShortcut.HOTKEY_DATA ] ),
      fire: ( event, keysPressed ) => {
        phet.log && phet.log( `VectorValuesKeyboardShortcut: keysPressed=${keysPressed}` );

        // Using this shortcut selects the vector.
        // See https://github.com/phetsims/vector-addition/issues/362#issuecomment-3517721350.
        vector.setSelected( true );

        // Describe what the Vector Values' accordion box is displaying.
        vectorNode.addAccessibleObjectResponse( accessibleParagraphProperty.value );
      }
    } );
  }
}

vectorAddition.register( 'VectorValuesKeyboardShortcut', VectorValuesKeyboardShortcut );