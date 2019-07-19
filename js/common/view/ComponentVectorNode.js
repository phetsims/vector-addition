// Copyright 2019, University of Colorado Boulder

/**
 * View for the component of a Vector
 *
 * Extends RootVectorNode but add the following functionality:
 *  - determines visibility by the component style
 *  - draws lines for the on axis component style
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


  class ComponentVectorNode extends RootVectorNode {
    /**
     * @param {ComponentVector} ComponentVector - the vector model for the component
     * @param {Graph} graph - the graph the vector belongs to
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {Object} [options]
     */
    constructor( vectorComponentModel, graph, componentStyleProperty, valuesVisibleProperty, options ) {

      assert && assert( vectorComponentModel instanceof ComponentVector,
        `invalid vectorComponentModel: ${vectorComponentModel}` );
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
        stroke: VectorAdditionColors.BLACK,
        lineDash: [ 3, 10 ]
      }, options.onAxisLinesOptions );

      options.arrowOptions = _.extend( {
        // functionality to add a distinct appearance
        fill: VectorAdditionColors[ vectorComponentModel.vectorColorGroup ].component,
        headWidth: 11,
        headHeight: 7.5,
        tailWidth: 4,
        opacity: 0.95
      }, options.arrowOptions );

      super( vectorComponentModel,
        graph.modelViewTransformProperty,
        valuesVisibleProperty,
        graph.activeVectorProperty,
        options.arrowOptions );

      //----------------------------------------------------------------------------------------
      // Create a path that represents the dashed lines corresponding to the on_axis style.
      // The shape of the path will be updated later.

      // @private {Path} onAxisLinesPath
      this.onAxisLinesPath = new Path( new Shape(), options.onAxisLinesOptions );

      this.addChild( this.onAxisLinesPath );

      //----------------------------------------------------------------------------------------
      // Create a multilink to observe:
      //  - componentStyleProperty - to determine visibility (i.e. components shouldn't be visible on INVISIBLE)
      //                             and to draw lines on the on axis componentStyle
      //  - isOnGraphProperty - components shouldn't be visible if the vector isn't on the graph
      //  - vectorComponentsProperty - to update the on axis lines drawings locations
      //
      // @private {Multilink}
      this.vectorComponentMultilink = Property.multilink( [ componentStyleProperty,
        vectorComponentModel.isOnGraphProperty,
        vectorComponentModel.vectorComponentsProperty ], ( componentStyle ) => {

        this.updateVectorComponent( vectorComponentModel, graph.modelViewTransformProperty.value, componentStyle );
      } );

    }

    /**
     * Disposes the vector component view
     * @override
     *
     * @public
     */
    dispose() {
      this.vectorComponentMultilink.dispose();
      super.dispose();
    }

    /**
     * Updates the vector component:
     *  - Draws on axis lines when componentStyle is ON_AXIS
     *  - Determines visibility (i.e. components shouldn't be visible on INVISIBLE)
     * @private
     *
     * @param {vectorComponentModel} vectorComponentModel
     * @param {ModelViewTransform2} modelViewTransform
     * @param {ComponentStyles} componentStyle
     */
    updateVectorComponent( vectorComponentModel, modelViewTransform, componentStyle ) {

      this.visible = vectorComponentModel.isOnGraphProperty.value
                     && componentStyle !== ComponentStyles.INVISIBLE;
      this.onAxisLinesPath.visible = componentStyle === ComponentStyles.ON_AXIS;


      // Update the on axis lines only if its the on axis style
      if ( this.onAxisLinesPath.visible ) {

        const tipLocation = modelViewTransform.modelToViewDelta(
          vectorComponentModel.tip.minus( vectorComponentModel.tail ) );

        const parentTailLocation = modelViewTransform.modelToViewDelta(
          vectorComponentModel.parentTail.minus( vectorComponentModel.tail ) );

        const parentTipLocation = modelViewTransform.modelToViewDelta(
          vectorComponentModel.parentTip.minus( vectorComponentModel.tail ) );

        // Create new shape for the dashed lines that extend to the axis
        const onAxisLines = new Shape();

        // Draw the dashed lines
        onAxisLines.moveToPoint( Vector2.ZERO ).lineToPoint( parentTailLocation );
        onAxisLines.moveToPoint( tipLocation ).lineToPoint( parentTipLocation );

        this.onAxisLinesPath.setShape( onAxisLines );

      }
    }

    /**
     * Updates the label positioning of the vector component. Vector components have a unique label positioning.
     * @override
     * @protected
     *
     * @param {vectorComponentModel} vectorComponentModel
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Boolean} valuesVisible
     */
    updateLabelPositioning( vectorComponentModel, modelViewTransform, valuesVisible ) {

      // Only show the visibility if the values are visible
      this.labelNode.visible = valuesVisible;

      if ( !this.labelNode.visible ) {
        // do nothing since the label isn't visible
        return;
      }

      // Flag to indicate the label offset translation. Declared below on and depends on the vector positioning.
      const labelOffset = new Vector2( 0, 0 );

      //----------------------------------------------------------------------------------------
      // Convenience variables

      const componentMidPoint = vectorComponentModel.midPoint;
      const parentMidPoint = vectorComponentModel.parentMidPoint;


      //----------------------------------------------------------------------------------------
      if ( vectorComponentModel.componentType === ComponentVector.COMPONENT_TYPES.X_COMPONENT ) {

        const labelHeight = modelViewTransform.viewToModelDeltaY( -this.labelNode.height / 2 );

        if ( vectorComponentModel.xComponent === 0 ) {
          return;
        }
        // If the component is below the parent, position the label below, otherwise position it above
        if ( componentMidPoint.y <= parentMidPoint.y ) {
          labelOffset.setXY( 0, -COMPONENT_LABEL_OFFSET - labelHeight );
        }
        else {
          labelOffset.setXY( 0, COMPONENT_LABEL_OFFSET + labelHeight );
        }
      }
      else if ( vectorComponentModel.componentType === ComponentVector.COMPONENT_TYPES.Y_COMPONENT ) {

        const width = modelViewTransform.viewToModelDeltaX( this.labelNode.width / 2 );

        if ( vectorComponentModel.yComponent === 0 ) {
          return;
        }

        // If the component is to the left of the parent, position the label to the left, otherwise to the right
        if ( componentMidPoint.x < parentMidPoint.x ) {
          labelOffset.setXY( -COMPONENT_LABEL_OFFSET - width, 0 );
        }

        else {
          labelOffset.setXY( COMPONENT_LABEL_OFFSET + width, 0 );
        }
      }

      // Get the middle of the vector with respect to the component tail as the origin
      const deltaMidPoint = vectorComponentModel.vectorComponents.timesScalar( 0.5 );

      this.labelNode.center = modelViewTransform.modelToViewDelta( deltaMidPoint.plus( labelOffset ) );
    }
  }

  return vectorAddition.register( 'ComponentVectorNode', ComponentVectorNode );
} );