// Copyright 2019-2023, University of Colorado Boulder

/**
 * View for a ComponentVector
 *
 * Extends RootVectorNode but add the following functionality:
 *  - determines visibility by the component style (i.e. should be invisible on ComponentVectorStyles.INVISIBLE)
 *  - draws lines for the PROJECTION component vector style
 *  - custom label positioning
 *  - distinct appearance
 *
 * @author Brandon Li
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { Path } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import ComponentVector from '../model/ComponentVector.js';
import ComponentVectorStyles from '../model/ComponentVectorStyles.js';
import ComponentVectorTypes from '../model/ComponentVectorTypes.js';
import Graph from '../model/Graph.js';
import VectorAdditionColors from '../VectorAdditionColors.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import RootVectorNode, { RootVectorNodeOptions } from './RootVectorNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Vector from '../model/Vector.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

// constants

// offset of the label
const COMPONENT_LABEL_OFFSET = VectorAdditionConstants.VECTOR_LABEL_OFFSET;

// Line dash for leader lines, displayed when component vectors are projected onto axes
const NON_ACTIVE_LEADER_LINES_DASH: number[] = [ 3, 10 ];
const ACTIVE_LEADER_LINES_DASH: number[] = [];

type SelfOptions = EmptySelfOptions;
export type ComponentVectorNodeOptions = SelfOptions & RootVectorNodeOptions;

export default class ComponentVectorNode extends RootVectorNode {

  // leader lines, displayed when component vectors are projected onto axes
  private readonly leaderLinesPath: Path;

  private readonly disposeComponentVectorNode: () => void;

  /**
   * @param componentVector - the component vector model the node represents
   * @param graph - the graph the component vector belongs to
   * @param componentStyleProperty
   * @param valuesVisibleProperty
   * @param [providedOptions]
   */
  public constructor( componentVector: ComponentVector,
                      graph: Graph,
                      componentStyleProperty: EnumerationProperty<ComponentVectorStyles>,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions?: ComponentVectorNodeOptions ) {

    const options = optionize<ComponentVectorNodeOptions, SelfOptions, RootVectorNodeOptions>()( {

      // RootVectorNodeOptions
      arrowType: 'dashed',
      arrowOptions: merge( {}, VectorAdditionConstants.COMPONENT_VECTOR_ARROW_OPTIONS, {
        fill: componentVector.vectorColorPalette.componentFill
      } )
    }, providedOptions );

    super( componentVector, graph.modelViewTransformProperty, valuesVisibleProperty, graph.activeVectorProperty, options );

    //----------------------------------------------------------------------------------------

    // Create a path that represents the dashed lines corresponding to the PROJECTION style.
    // The shape of the path will be updated later.

    this.leaderLinesPath = new Path( new Shape(), {
      lineWidth: 0.5,
      lineDash: NON_ACTIVE_LEADER_LINES_DASH
    } );
    this.addChild( this.leaderLinesPath );

    //----------------------------------------------------------------------------------------
    // Create a multilink to observe:
    //  - componentStyleProperty - to determine visibility (i.e. components shouldn't be visible on INVISIBLE)
    //                             and to draw lines on the PROJECTION componentStyle
    //  - isOnGraphProperty - components shouldn't be visible if the vector isn't on the graph
    //  - vectorComponentsProperty - to update the leader lines drawings positions
    //
    // dispose is required.
    const componentVectorMultilink = Multilink.multilink(
      [ componentStyleProperty, componentVector.isParentVectorActiveProperty,
        componentVector.isOnGraphProperty, componentVector.vectorComponentsProperty ],
      ( componentStyle, isParentActive ) => {

        this.updateComponentVector( componentVector,
          graph.modelViewTransformProperty.value,
          componentStyle,
          isParentActive );
      } );

    // Highlight the component vector's label when its parent vector is selected.
    // unlink is required on dispose.
    const activeVectorListener = ( activeVector: Vector | null ) => {
      this.labelNode.setHighlighted( activeVector === componentVector.parentVector );
    };
    graph.activeVectorProperty.link( activeVectorListener );

    this.disposeComponentVectorNode = () => {
      componentVectorMultilink.dispose();
      if ( graph.activeVectorProperty.hasListener( activeVectorListener ) ) {
        graph.activeVectorProperty.unlink( activeVectorListener );
      }
    };
  }

  public override dispose(): void {
    this.disposeComponentVectorNode();
    super.dispose();
  }

  /**
   * Updates the component vector node:
   *  - Draws leader lines when componentStyle is ON_AXIS
   *  - Determines visibility (i.e. components shouldn't be visible on INVISIBLE)
   */
  protected updateComponentVector( componentVector: ComponentVector, modelViewTransform: ModelViewTransform2,
                                   componentStyle: ComponentVectorStyles, isParentActive: boolean ): void {

    // Component vectors are visible when it isn't INVISIBLE, and it is on the graph.
    this.visible = componentVector.isOnGraphProperty.value &&
                   componentStyle !== ComponentVectorStyles.INVISIBLE;

    if ( componentStyle === ComponentVectorStyles.PROJECTION ) {
      this.labelNode.visible = ( componentVector.magnitude !== 0 );
    }
    else {

      // Hide the label if either of the parent vector's components is zero,
      // see https://github.com/phetsims/vector-addition/issues/264
      this.labelNode.visible = !componentVector.parentVector.hasZeroComponent();
    }

    // Leader lines are only visible when component vectors are projected onto axes
    this.leaderLinesPath.visible = ( componentStyle === ComponentVectorStyles.PROJECTION );

    // Update leader lines only if they are visible (with PROJECTION style)
    if ( this.leaderLinesPath.visible ) {

      // Since the leader lines are a child of this view, the origin of the view is at the tail of the component
      // vector. Get the tip position relative to the tail of the component vector (which is the components)
      const tipPosition = modelViewTransform.modelToViewDelta( componentVector.vectorComponents );

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

      if ( isParentActive ) {
        this.leaderLinesPath.stroke = VectorAdditionColors.LEADER_LINES_ACTIVE_STROKE;
        this.leaderLinesPath.lineDash = ACTIVE_LEADER_LINES_DASH;
      }
      else {
        this.leaderLinesPath.stroke = VectorAdditionColors.LEADER_LINES_NON_ACTIVE_STROKE;
        this.leaderLinesPath.lineDash = NON_ACTIVE_LEADER_LINES_DASH;
      }
    }
  }

  /**
   * Updates the label positioning of the vector component. Vector components have a unique label positioning.
   */
  protected override updateLabelPositioning( componentVector: ComponentVector, modelViewTransform: ModelViewTransform2,
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

    if ( componentVector.componentType === ComponentVectorTypes.X_COMPONENT ) {

      // Get the label height. Negative since the y axis is inverted in the view
      const labelHeight = modelViewTransform.viewToModelDeltaY( -this.labelNode.height );

      // If the component is below the parent, position the label below, otherwise position it above
      if ( componentMidPoint.y <= parentMidPoint.y ) {
        labelOffset.setXY( 0, -COMPONENT_LABEL_OFFSET - labelHeight / 2 );
      }
      else {
        labelOffset.setXY( 0, COMPONENT_LABEL_OFFSET + labelHeight / 2 );
      }
    }
    else if ( componentVector.componentType === ComponentVectorTypes.Y_COMPONENT ) {

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