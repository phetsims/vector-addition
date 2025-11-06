// Copyright 2019-2025, University of Colorado Boulder

/**
 * View for a ComponentVector
 *
 * Extends RootVectorNode but add the following functionality:
 *  - determines visibility by the component style (i.e. should be invisible on ComponentVectorStyle.INVISIBLE)
 *  - draws lines for ComponentVectorStyle 'projection'
 *  - custom label positioning
 *  - distinct appearance
 *
 * @author Brandon Li
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import vectorAddition from '../../vectorAddition.js';
import ComponentVector from '../model/ComponentVector.js';
import { ComponentVectorStyle } from '../model/ComponentVectorStyle.js';
import Vector from '../model/Vector.js';
import VectorAdditionColors from '../VectorAdditionColors.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import RootVectorNode, { RootVectorArrowNodeOptions, RootVectorNodeOptions } from './RootVectorNode.js';

// offset of the label
const COMPONENT_LABEL_OFFSET = VectorAdditionConstants.VECTOR_LABEL_OFFSET;

// Line dash for leader lines, displayed when component vectors are projected onto axes
const SELECTED_LEADER_LINES_DASH: number[] = [];
const UNSELECTED_LEADER_LINES_DASH: number[] = [ 3, 10 ];

type SelfOptions = EmptySelfOptions;
export type ComponentVectorNodeOptions = SelfOptions & RootVectorNodeOptions;

export default class ComponentVectorNode extends RootVectorNode {

  // leader lines, displayed when component vectors are projected onto axes
  private readonly leaderLinesPath: Path;

  private readonly disposeComponentVectorNode: () => void;

  public constructor( componentVector: ComponentVector,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      selectedVectorProperty: Property<Vector | null>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions?: ComponentVectorNodeOptions ) {

    const options = optionize<ComponentVectorNodeOptions, SelfOptions, RootVectorNodeOptions>()( {

      // RootVectorNodeOptions
      arrowType: 'dashed',
      arrowOptions: combineOptions<RootVectorArrowNodeOptions>( {}, VectorAdditionConstants.COMPONENT_VECTOR_ARROW_OPTIONS, {
        fill: componentVector.vectorColorPalette.componentFillProperty
      } ),
      visibleProperty: new DerivedProperty( [ componentVectorStyleProperty, componentVector.isOnGraphProperty ],
        ( componentVectorStyle, isOnGraph ) => ( componentVectorStyle !== 'invisible' ) && isOnGraph )
    }, providedOptions );

    super( componentVector, modelViewTransformProperty, valuesVisibleProperty, selectedVectorProperty, options );

    //----------------------------------------------------------------------------------------

    // Create a path that represents the dashed lines corresponding to ComponentVectorStyle 'projection'.
    // The shape of the path will be updated later.
    this.leaderLinesPath = new Path( new Shape(), {
      lineWidth: 0.5,
      lineDash: UNSELECTED_LEADER_LINES_DASH
    } );
    this.addChild( this.leaderLinesPath );

    const componentVectorMultilink = Multilink.multilink( [
        selectedVectorProperty,
        modelViewTransformProperty,
        componentVectorStyleProperty,
        componentVector.isOnGraphProperty,
        componentVector.xyComponentsProperty
      ],
      ( selectedVector, modelViewTransform, componentVectorStyle, isOnGraph, xyComponents ) => {
        this.updateComponentVectorNode( componentVector, selectedVector, modelViewTransform, componentVectorStyle );
      } );

    // Highlight the component vector's label when its parent vector is selected.
    // unlink is required on dispose.
    const selectedVectorListener = ( selectedVector: Vector | null ) => {
      this.labelNode.setHighlighted( selectedVector === componentVector.parentVector );
    };
    selectedVectorProperty.link( selectedVectorListener );

    this.disposeComponentVectorNode = () => {
      componentVectorMultilink.dispose();
      if ( selectedVectorProperty.hasListener( selectedVectorListener ) ) {
        selectedVectorProperty.unlink( selectedVectorListener );
      }
    };
  }

  public override dispose(): void {
    this.disposeComponentVectorNode();
    super.dispose();
  }

  /**
   * Updates how the component vector is displayed.
   */
  private updateComponentVectorNode( componentVector: ComponentVector,
                                     selectedVector: Vector | null,
                                     modelViewTransform: ModelViewTransform2,
                                     componentVectorStyle: ComponentVectorStyle ): void {

    if ( componentVectorStyle === 'projection' ) {
      this.labelNode.visible = ( componentVector.magnitude !== 0 );
    }
    else {

      // Hide the label if either of the parent vector's components is zero,
      // see https://github.com/phetsims/vector-addition/issues/264
      this.labelNode.visible = !componentVector.parentVector.hasZeroComponent();
    }

    // Leader lines are only visible when component vectors are projected onto axes
    this.leaderLinesPath.visible = ( componentVectorStyle === 'projection' );

    // Update leader lines only if they are visible (with ComponentVectorStyle 'projection')
    if ( this.leaderLinesPath.visible ) {

      // Since the leader lines are a child of this view, the origin of the view is at the tail of the component
      // vector. Get the tip position relative to the tail of the component vector (which is the components)
      const tipPosition = modelViewTransform.modelToViewDelta( componentVector.xyComponents );

      // Get the parent tail position relative to the origin of the view (the tail of the component vector)
      const parentTailPosition = modelViewTransform.modelToViewDelta( componentVector.parentTail
        .minus( componentVector.tail ) );

      // Get the parent tip position relative to the origin of the view (the tail of the component vector)
      const parentTipPosition = modelViewTransform.modelToViewDelta( componentVector.parentTip
        .minus( componentVector.tail ) );

      // Create new shape for the leader lines
      this.leaderLinesPath.shape = new Shape()
        .moveToPoint( Vector2.ZERO )
        .lineToPoint( parentTailPosition )
        .moveToPoint( tipPosition )
        .lineToPoint( parentTipPosition );

      if ( selectedVector && componentVector.parentVector === selectedVector ) {

        // The parent vector is selected, so the leader lines should look selected.
        this.leaderLinesPath.stroke = VectorAdditionColors.leaderLinesSelectedStrokeProperty;
        this.leaderLinesPath.lineDash = SELECTED_LEADER_LINES_DASH;
      }
      else {

        // The parent vector is not selected, so the leader lines should not look selected.
        this.leaderLinesPath.stroke = VectorAdditionColors.leaderLinesUnselectedStrokeProperty;
        this.leaderLinesPath.lineDash = UNSELECTED_LEADER_LINES_DASH;
      }
    }
  }

  /**
   * Updates the label positioning of the vector component. Vector components have a unique label positioning.
   */
  protected override updateLabelPositioning( componentVector: ComponentVector,
                                             modelViewTransform: ModelViewTransform2,
                                             valuesVisible: boolean ): void {

    // If the magnitude of the componentVector is 0, then position the label node on the 'tail'
    if ( componentVector.magnitude === 0 ) {
      this.labelNode.center = Vector2.ZERO;
      return;
    }

    // Flag to indicate the label offset translation.
    const labelOffset = new Vector2( 0, 0 );

    // Convenience variables
    const componentMidPoint = componentVector.midPoint;
    const parentMidPoint = componentVector.parentMidPoint;

    if ( componentVector.componentType === 'xComponent' ) {

      // Get the label height. Negative since the y-axis is inverted in the view
      const labelHeight = modelViewTransform.viewToModelDeltaY( -this.labelNode.height );

      // If the component is below the parent, position the label below, otherwise position it above
      if ( componentMidPoint.y <= parentMidPoint.y ) {
        labelOffset.setXY( 0, -COMPONENT_LABEL_OFFSET - labelHeight / 2 );
      }
      else {
        labelOffset.setXY( 0, COMPONENT_LABEL_OFFSET + labelHeight / 2 );
      }
    }
    else if ( componentVector.componentType === 'yComponent' ) {

      const labelWidth = modelViewTransform.viewToModelDeltaX( this.labelNode.width );

      // If the component is to the left of the parent, position the label to the left, otherwise to the right
      if ( componentMidPoint.x < parentMidPoint.x ) {
        labelOffset.setXY( -COMPONENT_LABEL_OFFSET - labelWidth / 2, 0 );
      }
      else {
        labelOffset.setXY( COMPONENT_LABEL_OFFSET + labelWidth / 2, 0 );
      }
    }

    // Position the label
    this.labelNode.center = RootVectorNode.computeLabelCenter( componentVector, modelViewTransform, labelOffset );
  }
}

vectorAddition.register( 'ComponentVectorNode', ComponentVectorNode );