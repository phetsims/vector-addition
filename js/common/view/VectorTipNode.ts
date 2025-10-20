// Copyright 2025, University of Colorado Boulder

/**
 * VectorTipNode is the draggable tip of a vector. Dragging the tip scales and rotates the vector.
 * This class was factored out of VectorNode when it became too large.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import vectorAddition from '../../vectorAddition.js';
import Path, { PathOptions } from '../../../../scenery/js/nodes/Path.js';
import Shape from '../../../../kite/js/Shape.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import Vector from '../model/Vector.js';
import VectorScaleRotateDragListener from './VectorScaleRotateDragListener.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Property from '../../../../axon/js/Property.js';
import VectorNode from './VectorNode.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

// xy-dilation of vector tip pointer areas
const MOUSE_AREA_DILATION = 6;
const TOUCH_AREA_DILATION = 8;

export default class VectorTipNode extends Path {

  private readonly vector: Vector;
  private readonly disposeVectorTipNode: () => void;

  public constructor( vectorNode: VectorNode,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      selectedVectorProperty: Property<Vector | null>,
                      tipWidth: number,
                      tipHeight: number,
                      fractionalTipHeight: number ) {

    const vector = vectorNode.vector;

    const tipShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( -tipHeight, -tipWidth / 2 )
      .lineTo( -tipHeight, tipWidth / 2 )
      .close();

    const options = combineOptions<PathOptions>( {
      stroke: phet.chipper.queryParameters.dev ? 'red' : null,
      cursor: 'pointer',
      accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.vectorNode.tip.accessibleNameStringProperty, {
        symbol: vector.accessibleSymbolProperty
      } ),
      accessibleHelpText: VectorAdditionStrings.a11y.vectorNode.tip.accessibleHelpTextStringProperty
    }, AccessibleDraggableOptions );

    super( tipShape, options );

    this.vector = vector;

    // The vector can be scaled and rotated by dragging its tip.  Must be disposed.
    const scaleRotateDragListener = new VectorScaleRotateDragListener( vector, this, modelViewTransformProperty,
      selectedVectorProperty );
    this.addInputListener( scaleRotateDragListener );

    //----------------------------------------------------------------------------------------
    // Transform the tip and its pointer areas when the xy-components change.
    //----------------------------------------------------------------------------------------

    // Pointer area shapes for the tip, in 3 different sizes.
    // A pair of these is used, based on the magnitude of the vector and whether its tip is scale.
    // See below and https://github.com/phetsims/vector-addition/issues/240#issuecomment-544682818
    const largeMouseAreaShape = tipShape.getOffsetShape( MOUSE_AREA_DILATION );
    const largeTouchAreaShape = tipShape.getOffsetShape( TOUCH_AREA_DILATION );
    const mediumMouseAreaShape = createDilatedTip( tipWidth, tipHeight, MOUSE_AREA_DILATION );
    const mediumTouchAreaShape = createDilatedTip( tipWidth, tipHeight, TOUCH_AREA_DILATION );
    const SMALL_HEAD_SCALE = 0.65; // determined empirically
    const smallMouseAreaShape = createDilatedTip( tipWidth, SMALL_HEAD_SCALE * tipHeight, MOUSE_AREA_DILATION );
    const smallTouchAreaShape = createDilatedTip( tipWidth, SMALL_HEAD_SCALE * tipHeight, TOUCH_AREA_DILATION );

    const SHORT_MAGNITUDE = 3;

    // When the vector changes, transform the tip and adjust its pointer areas.
    const xyComponentsListener = ( xyComponents: Vector2 ) => {

      // Adjust pointer areas. See https://github.com/phetsims/vector-addition/issues/240#issuecomment-544682818
      if ( xyComponents.magnitude <= SHORT_MAGNITUDE ) {

        // We have a 'short' vector, so adjust the tip's pointer areas so that the tail can still be grabbed.
        const viewComponents = modelViewTransformProperty.value.modelToViewDelta( vector.xyComponents );
        const viewMagnitude = viewComponents.magnitude;
        const maxTipHeight = fractionalTipHeight * viewMagnitude;

        if ( tipHeight > maxTipHeight ) {

          // tip is scaled (see ArrowNode fractionalTipHeight), use small pointer areas
          this.mouseArea = smallMouseAreaShape;
          this.touchArea = smallTouchAreaShape;
        }
        else {

          // tip is not scaled, use medium pointer areas
          this.mouseArea = mediumMouseAreaShape;
          this.touchArea = mediumTouchAreaShape;
        }
      }
      else {

        // We have a 'long' vector, so use the large pointer areas.
        this.mouseArea = largeMouseAreaShape;
        this.touchArea = largeTouchAreaShape;
      }

      // Transform the invisible tip to match the position and angle of the actual vector.
      this.translation = modelViewTransformProperty.value.modelToViewDelta( vector.xyComponents );
      this.rotation = -xyComponents.angle;
    };
    vector.xyComponentsProperty.link( xyComponentsListener ); // Must be unlinked in dispose.

    this.disposeVectorTipNode = () => {
      this.removeInputListener( scaleRotateDragListener );
      scaleRotateDragListener.dispose();
      vector.xyComponentsProperty.unlink( xyComponentsListener );
    };
  }

  public override dispose(): void {
    this.disposeVectorTipNode();
    super.dispose();
  }

  /**
   * Queues an accessible object response when the vector has been scaled or rotated.
   */
  public doAccessibleObjectResponse(): void {
    this.addAccessibleObjectResponse( StringUtils.fillIn( VectorAdditionStrings.a11y.vectorNode.tip.accessibleObjectResponseStringProperty, {
      tipX: this.vector.tipX,
      tipY: this.vector.tipY
    } ) );
  }
}

/**
 * Creates a dilated shape for the vector's tip.  The tip is pointing to the right.
 */
function createDilatedTip( tipWidth: number, tipHeight: number, dilation: number ): Shape {

  // Starting from the upper left and moving clockwise
  return new Shape()
    .moveTo( -tipHeight, -tipHeight / 2 - dilation )
    .lineTo( 0, -dilation )
    .lineTo( dilation, 0 )
    .lineTo( 0, dilation )
    .lineTo( -tipHeight, tipWidth / 2 + dilation )
    .close();
}

vectorAddition.register( 'VectorTipNode', VectorTipNode );