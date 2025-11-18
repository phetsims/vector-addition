// Copyright 2019-2025, University of Colorado Boulder

/**
 * GraphOriginDragListener is the drag listener for moving the graph's origin. It handles pointer and keyboard input.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SoundRichDragListener, { SoundRichDragListenerOptions } from '../../../../scenery-phet/js/SoundRichDragListener.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import vectorAddition from '../../vectorAddition.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

type SelfOptions = EmptySelfOptions;

type GraphOriginDragListenerOptions = SelfOptions & PickRequired<SoundRichDragListenerOptions, 'tandem' | 'end'>;

export default class GraphOriginDragListener extends SoundRichDragListener {

  public constructor( positionProperty: Property<Vector2>,
                      dragBounds: Bounds2,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: GraphOriginDragListenerOptions ) {

    const dragDelta = modelViewTransform.modelToViewDeltaX( 1 );

    super( combineOptions<SoundRichDragListenerOptions>( {
      positionProperty: positionProperty,
      dragBoundsProperty: new Property( dragBounds ),
      keyboardDragListenerOptions: {

        // Use the same value for dragDelta and shiftDragDelta, since the graph origin moves in increments of
        // 1 model unit. See https://github.com/phetsims/vector-addition/issues/377.
        dragDelta: dragDelta,
        shiftDragDelta: dragDelta,
        moveOnHoldInterval: 100
      }
    }, providedOptions ) );
  }
}

vectorAddition.register( 'GraphOriginDragListener', GraphOriginDragListener );