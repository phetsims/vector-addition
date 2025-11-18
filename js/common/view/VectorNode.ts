// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorNode is the view for the vectors that are dragged onto the graph.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import { combineOptions, EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import { PressListenerEvent } from '../../../../scenery/js/listeners/PressListener.js';
import Color from '../../../../scenery/js/util/Color.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import { MoveVectorDragListener } from './MoveVectorDragListener.js';
import MoveVectorKeyboardListener from './MoveVectorKeyboardListener.js';
import RemoveVectorKeyboardListener from './RemoveVectorKeyboardListener.js';
import RootVectorNode, { RootVectorArrowNodeOptions, RootVectorNodeOptions } from './RootVectorNode.js';
import ScaleRotateVectorDragListener from './ScaleRotateVectorDragListener.js';
import ScaleRotateVectorKeyboardListener from './ScaleRotateVectorKeyboardListener.js';
import SelectVectorKeyboardListener from './SelectVectorKeyboardListener.js';
import VectorAngleNode from './VectorAngleNode.js';
import VectorTipNode from './VectorTipNode.js';
import ReadVectorValuesKeyboardShortcut from './ReadVectorValuesKeyboardShortcut.js';

// options for the vector shadow
const SHADOW_OPTIONS = combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
  fill: Color.BLACK,
  opacity: 0.28
} );

// offsets for vector shadow in view coordinates
const SHADOW_X_OFFSET = 3.2;
const SHADOW_Y_OFFSET = 2.1;

type SelfOptions = EmptySelfOptions;
export type VectorNodeOptions = SelfOptions & RootVectorNodeOptions;

export default class VectorNode extends InteractiveHighlighting( RootVectorNode ) {

  // The associated vector model element.
  public readonly vector: Vector;

  // Drag listener for moving the vector with the pointer, for drag forwarding.
  private readonly moveVectorDragListener: DragListener;

  // We need to use a separate utterance queue for the doAccessibleObjectResponse method because it was interrupting
  // important context responses ('Vector added to graph area', 'Vector removed from graph area') that occur way over
  // in VectorSetNode. It seems backwards to have to use a separate queue for the thing doing the interrupting, but
  // that's currently the recommended pattern.
  private readonly objectResponseUtterance = new Utterance();

  // Disposes of things that are specific to this class.
  private readonly disposeVectorNode: () => void;

  public constructor( vector: Vector,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      selectedVectorProperty: Property<Vector | null>,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      anglesVisibleProperty: TReadOnlyProperty<boolean>,
                      graphBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions?: VectorNodeOptions ) {

    const options = optionize4<VectorNodeOptions, SelfOptions, RootVectorNodeOptions>()(
      {}, AccessibleDraggableOptions, {

        // RootVectorNodeOptions
        cursor: 'move',
        arrowOptions: combineOptions<RootVectorArrowNodeOptions>(
          {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
            fill: vector.vectorColorPalette.vectorFillProperty,
            stroke: vector.vectorColorPalette.vectorStrokeProperty
          } ),
        arrowHasInteractiveHighlight: true,
        accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.vectorNode.body.accessibleNameStringProperty, {
          symbol: vector.accessibleSymbolProperty
        } ),
        accessibleHelpText: VectorAdditionStrings.a11y.vectorNode.body.accessibleHelpTextStringProperty
      }, providedOptions );

    // To improve readability
    const headWidth = options.arrowOptions.headWidth!;
    affirm( headWidth !== undefined, 'Expected headWidth to be defined.' );
    const headHeight = options.arrowOptions.headHeight!;
    affirm( headWidth !== undefined, 'Expected headHeight to be defined.' );
    const fractionalHeadHeight = options.arrowOptions.fractionalHeadHeight!;
    affirm( fractionalHeadHeight !== undefined, 'Expected fractionalHeadHeight to be defined.' );

    super( vector,
      modelViewTransformProperty,

      // Show vector value (magnitude) only when 'Values' is checked and the vector is on the graph.
      // See https://github.com/phetsims/vector-addition/issues/330.
      DerivedProperty.and( [ valuesVisibleProperty, vector.isOnGraphProperty ] ),
      selectedVectorProperty,
      options );

    this.vector = vector;

    //----------------------------------------------------------------------------------------
    // Create Nodes
    //----------------------------------------------------------------------------------------

    // Since the tail is (0, 0) for the view, the tip is the delta position of the tip
    const tipDeltaPosition = modelViewTransformProperty.value.modelToViewDelta( vector.xyComponents );

    // Create a Node representing the arc of an angle and the numerical display of the angle.
    // dispose is necessary because it observes anglesVisibleProperty.
    const angleNode = new VectorAngleNode( vector, anglesVisibleProperty, modelViewTransformProperty );

    // Create a shadow for the vector, visible when the vector is being dragged around off the graph.
    const vectorShadowNode = new ArrowNode( 0, 0, tipDeltaPosition.x, tipDeltaPosition.y, SHADOW_OPTIONS );

    // Reconfigure z-layering
    this.setChildren( [ vectorShadowNode, this.arrowNode, angleNode, this.labelNode ] );

    //----------------------------------------------------------------------------------------
    // Handle vector transformation
    //----------------------------------------------------------------------------------------

    // Pointer drag listener to move the vector.
    this.moveVectorDragListener = new MoveVectorDragListener( vector, this, vectorShadowNode,
      modelViewTransformProperty, selectedVectorProperty, graphBoundsProperty );
    this.addInputListener( this.moveVectorDragListener );

    // Keyboard listener to move the vector.
    const moveVectorKeyboardListener = new MoveVectorKeyboardListener( vector, this );
    this.addInputListener( moveVectorKeyboardListener );

    // keyboard listener to select the vector. Being selected is different from having focus.
    const selectVectorKeyboardListener = new SelectVectorKeyboardListener( vector );
    this.addInputListener( selectVectorKeyboardListener );

    // Keyboard listener to remove the vector from the graph and return it to the toolbox.
    let removeVectorKeyboardListener = null;
    if ( vector.isRemovableFromGraph ) {
      removeVectorKeyboardListener = new RemoveVectorKeyboardListener( vector );
      this.addInputListener( removeVectorKeyboardListener );
    }

    // Keyboard shortcut for reading the vector values.
    const readVectorValuesKeyboardShortcut = new ReadVectorValuesKeyboardShortcut( vector, this );
    this.addInputListener( readVectorValuesKeyboardShortcut );

    // Dispose of things related to vector translation.
    const disposeTranslate = () => {
      this.moveVectorDragListener.dispose();
      selectVectorKeyboardListener.dispose();
      removeVectorKeyboardListener && removeVectorKeyboardListener.dispose();
      readVectorValuesKeyboardShortcut.dispose();
    };

    // Optional scaling and rotation by dragging the vector tip.
    let tipNode: VectorTipNode;
    let disposeScaleRotate: () => void;
    if ( vector.isTipDraggable ) {

      tipNode = new VectorTipNode( this, modelViewTransformProperty, headWidth, headHeight, fractionalHeadHeight );
      this.addChild( tipNode );

      // Pointer drag listener to scale/rotate by dragging the vector's tip.
      const scaleRotateVectorDragListener = new ScaleRotateVectorDragListener( vector, tipNode, modelViewTransformProperty,
        selectedVectorProperty );
      tipNode.addInputListener( scaleRotateVectorDragListener );

      // Keyboard listener to scale/rotate by moving the vector's tip.
      const scaleRotateVectorKeyboardListener = new ScaleRotateVectorKeyboardListener( vector, tipNode );
      tipNode.addInputListener( scaleRotateVectorKeyboardListener );

      // Dispose of things that are related to scale/rotate.
      disposeScaleRotate = () => {
        tipNode.dispose();
        scaleRotateVectorDragListener.dispose();
        scaleRotateVectorKeyboardListener.dispose();
      };
    }

    //----------------------------------------------------------------------------------------
    // Appearance
    //----------------------------------------------------------------------------------------

    // Update the appearance of the vector's shadow. Must be disposed.
    const shadowMultilink = Multilink.multilink(
      [ vector.isOnGraphProperty, this.vector.animateToToolboxProperty, vector.xyComponentsProperty ],
      ( isOnGraph, animateToToolbox, xyComponents ) => {
        vectorShadowNode.visible = ( !isOnGraph && !animateToToolbox );
        vectorShadowNode.resetTransform();
        if ( !isOnGraph && vectorShadowNode.getBounds().isValid() ) {
          vectorShadowNode.left = this.arrowNode.left + SHADOW_X_OFFSET;
          vectorShadowNode.top = this.arrowNode.top + SHADOW_Y_OFFSET;
        }
        const tipDeltaPosition = modelViewTransformProperty.value.modelToViewDelta( xyComponents );
        vectorShadowNode.setTip( tipDeltaPosition.x, tipDeltaPosition.y );
      } );

    // Highlight the vector's label when it is selected. unlink is required on dispose.
    const selectedVectorListener = ( selectedVector: Vector | null ) => {
      this.labelNode.setHighlighted( selectedVector === vector );
    };
    selectedVectorProperty.link( selectedVectorListener );

    // Disable interaction when the vector is animating back to the toolbox, where it will be disposed.
    // unlink is required on dispose.
    const animateBackListener = ( animateBack: boolean ) => {
      if ( animateBack ) {
        this.interruptSubtreeInput();

        // Make the body non-interactive.
        this.cursor = null;
        this.pickable = false;
        this.focusable = false;

        // Make the tip non-interactive.
        tipNode.cursor = null;
        tipNode.pickable = false;
        tipNode.focusable = false;
      }
    };
    this.vector.animateToToolboxProperty.lazyLink( animateBackListener );

    this.focusedProperty.lazyLink( focused => {
      if ( focused && vector.isOnGraphProperty.value ) {
        this.doAccessibleObjectResponse();
      }
    } );

    this.disposeVectorNode = () => {

      // Dispose of nodes
      angleNode.dispose();

      // Dispose of transform handling
      disposeTranslate();
      disposeScaleRotate();

      // Dispose of appearance-related listeners
      shadowMultilink.dispose();
      selectedVectorProperty.unlink( selectedVectorListener );
      this.vector.animateToToolboxProperty.unlink( animateBackListener );
    };
  }

  public override dispose(): void {
    this.disposeVectorNode();
    super.dispose();
  }

  /**
   * Forwards an event to translationDragListener. Used for dragging vectors out of the toolbox.
   */
  public forwardEvent( event: PressListenerEvent ): void {
    this.moveVectorDragListener.press( event, this );
  }

  /**
   * Queues an accessible object response when the vector has been moved.
   */
  public doAccessibleObjectResponse(): void {
    this.objectResponseUtterance.alert = StringUtils.fillIn( VectorAdditionStrings.a11y.vectorNode.body.accessibleObjectResponseStringProperty, {
      tailX: toFixedNumber( this.vector.tailX, VectorAdditionConstants.VECTOR_TAIL_DESCRIPTION_DECIMAL_PLACES ),
      tailY: toFixedNumber( this.vector.tailY, VectorAdditionConstants.VECTOR_TAIL_DESCRIPTION_DECIMAL_PLACES ),
      tipX: toFixedNumber( this.vector.tipX, VectorAdditionConstants.VECTOR_TIP_DESCRIPTION_DECIMAL_PLACES ),
      tipY: toFixedNumber( this.vector.tipY, VectorAdditionConstants.VECTOR_TIP_DESCRIPTION_DECIMAL_PLACES )
    } );
    this.addAccessibleObjectResponse( this.objectResponseUtterance, { alertBehavior: 'queue' } );
  }
}

vectorAddition.register( 'VectorNode', VectorNode );