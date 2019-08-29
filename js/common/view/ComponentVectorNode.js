// Copyright 2019, University of Colorado Boulder

/**
 * View for a ComponentVector
 *
 * Extends RootVectorNode but add the following functionality:
 *  - determines visibility by the component style (i.e. should be invisible on ComponentStyles.INVISIBLE)
 *  - draws lines for the on-axis component style
 *  - custom label positioning
 *  - distinct appearance
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const ComponentVector = require( 'VECTOR_ADDITION/common/model/ComponentVector' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const RootVectorNode = require( 'VECTOR_ADDITION/common/view/RootVectorNode' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // constants

  // offset of the label
  const COMPONENT_LABEL_OFFSET = VectorAdditionConstants.VECTOR_LABEL_OFFSET;

  const NON_ACTIVE_LINE_DASH = [ 3, 10 ];
  const ACTIVE_LINE_DASH = [];

  class ComponentVectorNode extends RootVectorNode {

    /**
     * @param {ComponentVector} componentVector - the component vector model the node represents
     * @param {Graph} graph - the graph the component vector belongs to
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {Object} [options]
     */
    constructor( componentVector, graph, componentStyleProperty, valuesVisibleProperty, options ) {

      assert && assert( componentVector instanceof ComponentVector,
        `invalid componentVector: ${componentVector}` );
      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( {
        onAxisLinesOptions: null, // {Object} - options passed to the dashed lines shape. See the defaults below.
        arrowOptions: null // {Object} - passed to the super class to stylize the arrowOptions. See the defaults below.
      }, options );

      options.onAxisLinesOptions = _.extend( {
        lineDash: NON_ACTIVE_LINE_DASH
      }, options.onAxisLinesOptions );

      options.arrowOptions = _.extend( {}, VectorAdditionConstants.COMPONENT_VECTOR_OPTIONS, {
        fill: componentVector.vectorColorPalette.componentFill,
        stroke: componentVector.vectorColorPalette.componentStroke
      }, options.arrowOptions );

      super( componentVector,
        graph.modelViewTransformProperty,
        valuesVisibleProperty,
        graph.activeVectorProperty,
        options.arrowOptions );

      //----------------------------------------------------------------------------------------

      // Create a path that represents the dashed lines corresponding to the on-axis style.
      // The shape of the path will be updated later.

      // @private {Path} onAxisLinesPath
      this.onAxisLinesPath = new Path( new Shape(), options.onAxisLinesOptions );

      this.addChild( this.onAxisLinesPath );

      //----------------------------------------------------------------------------------------
      // Create a multilink to observe:
      //  - componentStyleProperty - to determine visibility (i.e. components shouldn't be visible on INVISIBLE)
      //                             and to draw lines on the on-axis componentStyle
      //  - isOnGraphProperty - components shouldn't be visible if the vector isn't on the graph
      //  - vectorComponentsProperty - to update the on-axis lines drawings locations
      //
      // @private {Multilink} componentVectorMultilink
      this.componentVectorMultilink = Property.multilink( [ componentStyleProperty,
        componentVector.isParentVectorActiveProperty,
        componentVector.isOnGraphProperty,
        componentVector.vectorComponentsProperty ], ( componentStyle, isParentActive ) => {

        this.updateComponentVector( componentVector,
          graph.modelViewTransformProperty.value,
          componentStyle,
          isParentActive );
      } );
    }

    /**
     * Disposes the vector component node
     * @override
     *
     * @public
     */
    dispose() {
      this.onAxisLinesPath.dispose();
      Property.unmultilink( this.componentVectorMultilink );
      super.dispose();
    }

    /**
     * Updates the component vector node:
     *  - Draws on-axis lines when componentStyle is ON_AXIS
     *  - Determines visibility (i.e. components shouldn't be visible on INVISIBLE)
     * @protected
     *
     * @param {componentVector} componentVector
     * @param {ModelViewTransform2} modelViewTransform
     * @param {ComponentStyles} componentStyle
     * @param {boolean} isParentActive
     */
    updateComponentVector( componentVector, modelViewTransform, componentStyle, isParentActive ) {

      isParentActive && this.moveToFront();

      // Component vectors are visible when it isn't INVISIBLE and it is on the graph.
      this.visible = componentVector.isOnGraphProperty.value
                     && componentStyle !== ComponentStyles.INVISIBLE;

      // On axis lines only visible if the component style is ON_AXIS
      this.onAxisLinesPath.visible = componentStyle === ComponentStyles.ON_AXIS;

      // Update the on-axis lines only if its the on-axis style
      if ( this.onAxisLinesPath.visible ) {

        // Since the on-axis lines are a child of this view, the origin of the view is at the tail of the component
        // vector. Get the tip location relative to the tail of the component vector (which is the components)
        const tipLocation = modelViewTransform.modelToViewDelta( componentVector.vectorComponents );

        // Get the parent tail location relative to the origin of the view (the tail of the component vector)
        const parentTailLocation = modelViewTransform.modelToViewDelta( componentVector.parentTail
          .minus( componentVector.tail ) );
        // Get the parent tip location relative to the origin of the view (the tail of the component vector)
        const parentTipLocation = modelViewTransform.modelToViewDelta( componentVector.parentTip
          .minus( componentVector.tail ) );

        // Create new shape for the dashed lines
        const onAxisLines = new Shape();

        // Draw the dashed lines
        onAxisLines.moveToPoint( Vector2.ZERO ).lineToPoint( parentTailLocation );
        onAxisLines.moveToPoint( tipLocation ).lineToPoint( parentTipLocation );

        this.onAxisLinesPath.setShape( onAxisLines.makeImmutable() );

        if ( isParentActive ) {
          this.onAxisLinesPath.stroke = VectorAdditionColors.ON_AXIS_LINES_ACTIVE_STROKE;
          this.onAxisLinesPath.lineDash = ACTIVE_LINE_DASH;
        }
        else {
          this.onAxisLinesPath.stroke = VectorAdditionColors.ON_AXIS_LINES_NON_ACTIVE_STROKE;
          this.onAxisLinesPath.lineDash = NON_ACTIVE_LINE_DASH;
        }
      }
    }

    /**
     * Updates the label positioning of the vector component. Vector components have a unique label positioning.
     * @override
     * @protected
     *
     * @param {componentVector} componentVector
     * @param {ModelViewTransform2} modelViewTransform
     */
    updateLabelPositioning( componentVector, modelViewTransform ) {

      if ( componentVector.magnitude === 0 ) {
        // If the magnitude of the componentVector is 0, then position the label node on the 'tail' and no-op
        this.labelNode.center = Vector2.ZERO;
        return;
      }

      // Flag to indicate the label offset translation.
      const labelOffset = new Vector2( 0, 0 );

      //----------------------------------------------------------------------------------------
      // Convenience variables
      const componentMidPoint = componentVector.midPoint;
      const parentMidPoint = componentVector.parentMidPoint;

      //----------------------------------------------------------------------------------------
      if ( componentVector.componentType === ComponentVector.COMPONENT_TYPES.X_COMPONENT ) {

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
      else if ( componentVector.componentType === ComponentVector.COMPONENT_TYPES.Y_COMPONENT ) {

        const labelWidth = modelViewTransform.viewToModelDeltaX( this.labelNode.width );

        // If the component is to the left of the parent, position the label to the left, otherwise to the right
        if ( componentMidPoint.x < parentMidPoint.x ) {
          labelOffset.setXY( -COMPONENT_LABEL_OFFSET - labelWidth / 2, 0 );
        }
        else {
          labelOffset.setXY( COMPONENT_LABEL_OFFSET + labelWidth / 2, 0 );
        }
      }

      // Get the middle of the vector with respect to the component tail as the origin
      const deltaMidPoint = componentVector.vectorComponents.timesScalar( 0.5 );

      this.labelNode.center = modelViewTransform.modelToViewDelta( deltaMidPoint.plus( labelOffset ) );
    }
  }

  return vectorAddition.register( 'ComponentVectorNode', ComponentVectorNode );
} );