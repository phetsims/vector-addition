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
      // not from a hotkey? // TODO: CM: Question: Other cases identify a hotkey for this, which allows us to document for the keyboard help dialog, should we do so here as well? see https://github.com/phetsims/vector-addition/issues/376
      keys: [ 'space', 'enter' ],
      fire: ( event, keysPressed ) => {
        phet.log && phet.log( `AddVectorKeyboardListener: keysPressed=${keysPressed}` );

        // Get the next vector from the toolbox.
        const vector = getNextVector();

        if ( vector ) {

          // TODO: CM: Question: I cannot find where in the following code focus is actually set to the newly added vector. How does that happen? see https://github.com/phetsims/vector-addition/issues/376

          vector.reset();

          // The initial position of every vector is at the visual center of the graph.
          // See https://github.com/phetsims/vector-addition/issues/329#issuecomment-3469430200.
          vector.tailPositionProperty.value = graphBoundsProperty.value.center;

          // Put the vector on the graph and select it.
          vector.isOnGraphProperty.value = true;
          vector.setSelected( true );

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