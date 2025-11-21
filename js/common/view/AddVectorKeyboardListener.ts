// Copyright 2025, University of Colorado Boulder

/**
 * AddVectorKeyboardListener moves a vector from the toolbox to the graph, using the keyboard.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import vectorAddition from '../../vectorAddition.js';
import Vector from '../model/Vector.js';
import VectorSet from '../model/VectorSet.js';
import VectorAdditionSceneNode from './VectorAdditionSceneNode.js';

export default class AddVectorKeyboardListener extends KeyboardListener<OneKeyStroke[]> {

  public constructor( getNextVector: () => Vector | null,
                      vectorSet: VectorSet,
                      sceneNode: VectorAdditionSceneNode,
                      graphBoundsProperty: TReadOnlyProperty<Bounds2> ) {
    super( {

      // This is a listener for VectorToolboxSlot, which has tagName: 'button'. That causes problems with NVDA,
      // because 'button' does not switch to NVDA 'Focus' mode, and this listener is therefore ignored. So we
      // add the fireOnClick option to address this. See https://github.com/phetsims/vector-addition/issues/373.
      fireOnClick: true,
      fire: ( event, keysPressed ) => {
        phet.log && phet.log( `AddVectorKeyboardListener: keysPressed=${keysPressed}` );

        // Get the next vector from the toolbox.
        const vector = getNextVector();

        if ( vector ) {

          vector.reset();

          // The initial position of every vector is at the visual center of the graph.
          // See https://github.com/phetsims/vector-addition/issues/329#issuecomment-3469430200.
          vector.tailPositionProperty.value = graphBoundsProperty.value.center;

          // Put the vector on the graph and select it.
          vector.isOnGraphProperty.value = true;
          vector.setSelected( true );

          // Add the vector to activeVectors, so it contributes to the resultant vector.
          vectorSet.activeVectors.push( vector );

          // Notify the sceneNode to create an associated vector node and give it focus.
          sceneNode.registerVector( vector, vectorSet );
        }
      }
    } );
  }
}

vectorAddition.register( 'AddVectorKeyboardListener', AddVectorKeyboardListener );