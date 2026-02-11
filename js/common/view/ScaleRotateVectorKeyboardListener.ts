// Copyright 2025, University of Colorado Boulder

/**
 * ScaleRotateVectorKeyboardListener scales and rotates a vector on the graph, using the keyboard.
 * As a side effect, it also selects the vector.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import sharedSoundPlayers from '../../../../tambo/js/sharedSoundPlayers.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import MoveVectorKeyboardListener from './MoveVectorKeyboardListener.js';
import VectorTipNode from './VectorTipNode.js';

// Deltas for polar coordinates.
const DELTA_MAGNITUDE = 1;
const DELTA_ANGLE = toRadians( VectorAdditionConstants.POLAR_ANGLE_INTERVAL );

export default class ScaleRotateVectorKeyboardListener extends KeyboardListener<OneKeyStroke[]> {

  // Keystrokes and metadata
  public static readonly HOTKEY_DATA = new HotkeyData( {
    keys: [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown', 'w', 'a', 's', 'd' ],
    repoName: vectorAddition.name,
    keyboardHelpDialogLabelStringProperty: VectorAdditionStrings.keyboardHelpDialog.scaleRotateVectorStringProperty
  } );

  public constructor( vector: Vector, tipNode: VectorTipNode ) {

    super( {
      tandem: Tandem.OPT_OUT, // View is created dynamically and is not PhET-iO instrumented.
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ ScaleRotateVectorKeyboardListener.HOTKEY_DATA ] ),
      fireOnHold: true,
      press: () => sharedSoundPlayers.get( 'grab' ).play(),
      release: () => sharedSoundPlayers.get( 'release' ).play(),
      fire: ( event, keysPressed ) => {
        phet.log && phet.log( `ScaleRotateVectorKeyboardListener: keysPressed=${keysPressed}` );

        // Select the vector.
        vector.setSelected( true );

        const previousTipPosition = vector.tip;

        // Compute the new tip position.
        const tipPosition = ( vector.coordinateSnapMode === 'cartesian' ) ?
                            computeTipPositionCartesian( vector, keysPressed ) :
                            computeTipPositionPolar( vector, keysPressed );

        // Move the tip to the new position.
        vector.moveTipToPositionWithInvariants( tipPosition );

        // Describe the new position of the vector tip.
        tipNode.doAccessibleObjectResponse( previousTipPosition );
      }
    } );
  }
}

/**
 * Computes the new tip position for Cartesian scenes, which snap to xy-components.
 */
function computeTipPositionCartesian( vector: Vector, keysPressed: OneKeyStroke ): Vector2 {
  affirm( vector.coordinateSnapMode === 'cartesian', 'wrong coordinateSnapMode' );

  // Compute delta for xy-components.
  const { dx, dy } = MoveVectorKeyboardListener.keysPressedToDeltaXY( keysPressed );
  const tipPosition = vector.tip.plusXY( dx, dy );

  // Skip over zero-magnitude vector.
  if ( tipPosition.equals( vector.tail ) ) {
    tipPosition.setXY( vector.tail.x + dx, vector.tail.y + dy );
  }

  // Return the new tip position.
  return tipPosition;
}

/**
 * Computes the new tip position for polar scenes, which snap to magnitude and angle in degrees.
 */
function computeTipPositionPolar( vector: Vector, keysPressed: OneKeyStroke ): Vector2 {
  affirm( vector.coordinateSnapMode === 'polar', 'wrong coordinateSnapMode' );

  let magnitude = vector.magnitude;
  let angle = vector.angle!; // in radians
  affirm( vector.angle !== null, 'angle should be defined' );

  if ( keysPressed === 'arrowLeft' || keysPressed === 'a' ) {
    if ( vector.angle !== null ) {
      angle -= DELTA_ANGLE;
    }
  }
  else if ( keysPressed === 'arrowRight' || keysPressed === 'd' ) {
    if ( vector.angle !== null ) {
      angle += DELTA_ANGLE;
    }
  }
  else if ( keysPressed === 'arrowUp' || keysPressed === 'w' ) {
    magnitude += DELTA_MAGNITUDE;
  }
  else if ( keysPressed === 'arrowDown' || keysPressed === 's' ) {
    magnitude -= DELTA_MAGNITUDE;
  }

  // Constrain magnitude to integer.
  magnitude = toFixedNumber( magnitude, 0 );

  // Do not allow magnitude to go to zero.
  if ( magnitude === 0 ) {
    magnitude = DELTA_MAGNITUDE;
  }

  // Convert to Cartesian coordinates.
  const xyComponents = Vector2.createPolar( magnitude, angle );

  // Return the new tip position.
  return new Vector2( vector.tail.x + xyComponents.x, vector.tail.y + xyComponents.y );
}

vectorAddition.register( 'ScaleRotateVectorKeyboardListener', ScaleRotateVectorKeyboardListener );