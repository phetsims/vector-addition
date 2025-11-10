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
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';

const DX = 1;
const DY = 1;
const DELTA_MAGNITUDE = 1;
const DELTA_ANGLE = toRadians( VectorAdditionConstants.POLAR_ANGLE_INTERVAL );

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

        // Scaling and rotating a vector selects it.
        vector.select();

        // Scale and rotate the vector.
        let dx = 0;
        let dy = 0;
        if ( vector.coordinateSnapMode === 'cartesian' ) {

          // For Cartesian scenes, snap to xy-coordinates.
          if ( keysPressed === 'arrowLeft' || keysPressed === 'a' ) {
            dx = -DX;
          }
          else if ( keysPressed === 'arrowRight' || keysPressed === 'd' ) {
            dx = DX;
          }
          else if ( keysPressed === 'arrowUp' || keysPressed === 'w' ) {
            dy = DY;
          }
          else if ( keysPressed === 'arrowDown' || keysPressed === 's' ) {
            dy = -DY;
          }
          vector.moveTipToPositionWithInvariants( vector.tip.plusXY( dx, dy ) );
        }
        else {

          // For polar scenes, snap to magnitude and angle (in degrees).
          let magnitude = vector.magnitude;
          let angle = vector.angle!; // in radians
          affirm( vector.angle !== null, 'angle should be defined' );

          if ( keysPressed === 'arrowLeft' || keysPressed === 'a' ) {
            if ( vector.angle !== null ) {
              angle = vector.angle - DELTA_ANGLE;
            }
          }
          else if ( keysPressed === 'arrowRight' || keysPressed === 'd' ) {
            if ( vector.angle !== null ) {
              angle = vector.angle + DELTA_ANGLE;
            }
          }
          else if ( keysPressed === 'arrowUp' || keysPressed === 'w' ) {
            magnitude = vector.magnitude + DELTA_MAGNITUDE;
          }
          else if ( keysPressed === 'arrowDown' || keysPressed === 's' ) {
            magnitude = vector.magnitude - DELTA_MAGNITUDE;
          }

          // Constrain magnitude to integer.
          magnitude = toFixedNumber( magnitude, 0 );

          // Do not allow magnitude to go to zero.
          if ( magnitude === 0 ) {
            magnitude = 1;
          }

          // Convert to Cartesian coordinates.
          const xyComponents = Vector2.createPolar( magnitude, angle );
          const tipPosition = new Vector2( vector.tail.x + xyComponents.x, vector.tail.y + xyComponents.y );
          vector.moveTipToPositionWithInvariants( tipPosition );
        }

        // Describe the new position of the vector tip.
        tipNode.doAccessibleObjectResponse();
      }
    } );
  }
}

vectorAddition.register( 'ScaleRotateVectorKeyboardListener', ScaleRotateVectorKeyboardListener );