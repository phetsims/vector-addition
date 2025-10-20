// Copyright 2019-2025, University of Colorado Boulder

/**
 * View for the vectors that are dragged onto the graph.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import { PressListenerEvent } from '../../../../scenery/js/listeners/PressListener.js';
import Color from '../../../../scenery/js/util/Color.js';
import vectorAddition from '../../vectorAddition.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import RootVectorNode, { RootVectorArrowNodeOptions, RootVectorNodeOptions } from './RootVectorNode.js';
import VectorAngleNode from './VectorAngleNode.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { VectorTranslationDragListener } from './VectorTranslationDragListener.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VectorTipNode from './VectorTipNode.js';

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

export default class VectorNode extends RootVectorNode {

  public readonly vector: Vector;
  private readonly translationDragListener: DragListener;
  private readonly disposeVectorNode: () => void;

  public constructor( vector: Vector,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      selectedVectorProperty: Property<Vector | null>,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      anglesVisibleProperty: TReadOnlyProperty<boolean>,
                      graphBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions?: VectorNodeOptions ) {

    const options = optionize<VectorNodeOptions, SelfOptions, RootVectorNodeOptions>()( {

      // RootVectorNodeOptions
      arrowOptions: combineOptions<RootVectorArrowNodeOptions>(
        {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, AccessibleDraggableOptions, {
          cursor: 'move',
          fill: vector.vectorColorPalette.vectorFillProperty,
          stroke: vector.vectorColorPalette.vectorStrokeProperty,
          accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.vectorNode.body.accessibleNameStringProperty, {
            symbol: vector.accessibleSymbolProperty
          } ),
          accessibleHelpText: VectorAdditionStrings.a11y.vectorNode.body.accessibleHelpTextStringProperty
        } ),
      arrowHasInteractiveHighlight: true
    }, providedOptions );

    // To improve readability
    const headWidth = options.arrowOptions.headWidth!;
    affirm( headWidth !== undefined, 'Expected headWidth to be defined.' );
    const headHeight = options.arrowOptions.headHeight!;
    affirm( headWidth !== undefined, 'Expected headHeight to be defined.' );
    const fractionalHeadHeight = options.arrowOptions.fractionalHeadHeight!;
    affirm( fractionalHeadHeight !== undefined, 'Expected fractionalHeadHeight to be defined.' );
    const cursor = options.arrowOptions.cursor!;
    affirm( cursor, 'Expected cursor to be defined.' );

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

    this.translationDragListener = new VectorTranslationDragListener( vector, this, vectorShadowNode,
      modelViewTransformProperty, selectedVectorProperty, graphBoundsProperty, cursor );
    this.arrowNode.addInputListener( this.translationDragListener );

    // dispose of things related to vector translation
    const disposeTranslate = () => {
      this.arrowNode.removeInputListener( this.translationDragListener );
      this.translationDragListener.dispose();
    };

    // Optional scaling and rotation by dragging the vector tip.
    let disposeScaleRotate: () => void;
    if ( vector.isTipDraggable ) {

      const tipNode = new VectorTipNode( this, modelViewTransformProperty, selectedVectorProperty,
        headWidth, headHeight, fractionalHeadHeight );
      this.addChild( tipNode );

      // dispose of things that are related to optional scale/rotate
      disposeScaleRotate = () => {
        tipNode.dispose();
      };
    }

    //----------------------------------------------------------------------------------------
    // Appearance
    //----------------------------------------------------------------------------------------

    // Update the appearance of the vector's shadow. Must be disposed.
    const shadowMultilink = Multilink.multilink(
      [ vector.isOnGraphProperty, vector.xyComponentsProperty, this.vector.animateBackProperty ],
      ( isOnGraph, xyComponents, animateBack ) => {
        vectorShadowNode.visible = ( !animateBack && !isOnGraph );
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
        this.pickable = false;
        this.cursor = 'default';
      }
    };
    this.vector.animateBackProperty.lazyLink( animateBackListener );

    this.arrowNode.focusedProperty.lazyLink( focussed => {
      if ( focussed ) {
        this.doAccessibleObjectResponseTranslate();
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
      this.vector.animateBackProperty.unlink( animateBackListener );
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
    this.translationDragListener.press( event, this );
  }

  /**
   * Queues an accessible object response when the vector has been translated.
   */
  public doAccessibleObjectResponseTranslate(): void {
    this.addAccessibleObjectResponse( StringUtils.fillIn( VectorAdditionStrings.a11y.vectorNode.body.accessibleObjectResponseStringProperty, {
      tailX: this.vector.tailX,
      tailY: this.vector.tailY,
      tipX: this.vector.tipX,
      tipY: this.vector.tipY
    } ) );
  }
}

vectorAddition.register( 'VectorNode', VectorNode );