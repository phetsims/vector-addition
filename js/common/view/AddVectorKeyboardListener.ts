// Copyright 2025, University of Colorado Boulder

/**
 * AddVectorKeyboardListener moves a vector from the toolbox to the graph, using the keyboard.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionSceneNode from './VectorAdditionSceneNode.js';
import VectorSet from '../model/VectorSet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector from '../model/Vector.js';

export default class AddVectorKeyboardListener extends KeyboardListener<OneKeyStroke[]> {

  // Keystrokes and metadata
  public static readonly HOTKEY_DATA = new HotkeyData( {
    keys: [ 'space', 'enter' ],
    repoName: vectorAddition.name,
    keyboardHelpDialogLabelStringProperty: VectorAdditionStrings.keyboardHelpDialog.addVectorToGraphStringProperty
  } );

  public constructor( getNextVector: () => Vector | null, vectorSet: VectorSet, sceneNode: VectorAdditionSceneNode ) {
    super( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ AddVectorKeyboardListener.HOTKEY_DATA ] ),
      fire: ( event, keysPressed ) => {
        phet.log && phet.log( `keysPressed=${keysPressed}` );

        // Get the next vector from the toolbox.
        const vector = getNextVector();

        if ( vector ) {
          vector.reset();

          // The initial position of every vector is at the origin.
          // See https://github.com/phetsims/vector-addition/issues/329#issuecomment-3469430200.
          vector.tailPositionProperty.value = Vector2.ZERO;

          // Put the vector on the graph and select it.
          vector.isOnGraphProperty.value = true;
          vector.select();

          // Add the vector to activeVectors, so it contributes to the resultant vector.
          vectorSet.activeVectors.push( vector );

          // Notify the sceneNode to create the view for the vector.
          sceneNode.registerVector( vector, vectorSet );
        }
      }
    } );
  }
}

vectorAddition.register( 'AddVectorKeyboardListener', AddVectorKeyboardListener );