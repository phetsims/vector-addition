// Copyright 2019, University of Colorado Boulder

/**
 * View for a vector component.
 *
 * Listens to the a vectorComponentModel's tail/attributes properties to update the component location/size.
 * Determines visibility component style property and the isOnGraphProperty of the models parent vector.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BaseVectorNode = require( 'VECTOR_ADDITION/common/view/BaseVectorNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorComponentModel = require( 'VECTOR_ADDITION/common/model/VectorComponentModel' );

  // constants

  // offset of the label
  const COMPONENT_LABEL_OFFSET = VectorAdditionConstants.VECTOR_LABEL_OFFSET;

  class VectorComponentNode extends BaseVectorNode {
    /**
     * @constructor
     * @param {VectorComponentModel} VectorComponentModel - the vector model for the component
     * @param {Graph} graph - the graph the vector belongs to
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {Object} [options]
     */
    constructor( vectorComponentModel, graph, componentStyleProperty, valuesVisibleProperty, options ) {

      // Type check unique arguments
      assert && assert( vectorComponentModel instanceof VectorComponentModel, `invalid vectorComponentModel: ${vectorComponentModel}` );
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
        onAxisLinesOptions: null, // {Object} - options passed to the dashed lines shape. See the defaults below

        arrowOptions: null // {Object} - passed to the super class to stylize the arrowOptions. See the defaults below
      }, options );

      options.onAxisLinesOptions = _.extend( {
        stroke: VectorAdditionColors.BLACK,
        lineDash: [ 3, 10 ]
      }, options.onAxisLinesOptions );

      options.arrowOptions = _.extend( {
        fill: VectorAdditionColors[ vectorComponentModel.vectorGroup ].component,
        headWidth: 10.5,
        headHeight: 6,
        tailWidth: 4
      }, options.arrowOptions );

      super( vectorComponentModel, graph.modelViewTransformProperty, valuesVisibleProperty, graph.activeVectorProperty, options.arrowOptions );

      //----------------------------------------------------------------------------------------
      // Create a path  that represents the dashed lines corresponding to the on_axis style.
      // The shape of the path will be updated later.

      // @private
      this.onAxisLinesPath = new Path( new Shape(), options.onAxisLinesOptions );

      this.addChild( this.onAxisLinesPath );

      // Dispose of the super class observer, as it is necessary to add the component style property
      this.vectorObserver.dispose();

      //----------------------------------------------------------------------------------------
      // Update the tail/tip location when the vector's tail/tip position changes and when the componentStyleProperty
      // changes   
      // @protected {Multilink}
      this.vectorObserver = Property.multilink( [ valuesVisibleProperty,
        vectorComponentModel.tailPositionProperty,
        vectorComponentModel.tipPositionProperty,
        componentStyleProperty,
        vectorComponentModel.parentVector.isOnGraphProperty ], ( valuesVisible ) => {

        // Update the appearance of the vector only when it is visible
        this.updateVector( vectorComponentModel, graph.modelViewTransformProperty.value, componentStyleProperty.value );

        // Update the appearance of the label
        this.updateLabelPositioning( vectorComponentModel, graph.modelViewTransformProperty.value, valuesVisible );
      } );

    }

    /**
     * Updates the tail and tip position of the view. Called when the model changes tail/tip.
     * Does the same as super class but draws lines and toggles visibility based on componentStyleProperty and if the
     * vector is on the graph.
     * @param {vectorComponentModel} vectorComponentModel
     * @param {ModelViewTransform2} modelViewTransform
     * @param {ComponentStyles} componentStyle
     * @private
     */
    updateVector( vectorComponentModel, modelViewTransform, componentStyle ) {

      // Since this isn't a lazy link, and onAxisLinesPath doesn't exist in super class, we must handle the first call
      if ( !this.onAxisLinesPath ) {
        return;
      }
      if ( vectorComponentModel.parentVector.isOnGraphProperty.value === false ) {
        this.visible = false;
        this.onAxisLinesPath.visible = false;
      }
      else if ( componentStyle === ComponentStyles.INVISIBLE ) {
        this.visible = false;
        this.onAxisLinesPath.visible = false;
      }
      else if ( componentStyle === ComponentStyles.ON_AXIS ) {
        this.visible = true;
        this.onAxisLinesPath.visible = true;

        this.onAxisLinesPath.setShape( this.getOnAxisLinesShape( vectorComponentModel, modelViewTransform ) );
      }
      else {
        this.onAxisLinesPath.visible = false;
        this.visible = true;
      }

      super.updateVector( vectorComponentModel, modelViewTransform );
    }

    /**
     * Creates the shape of lines that go from the components tail/tip to the parents tail/tip
     * @param {vectorComponentModel} vectorComponentModel
     * @param {ModelViewTransform2} modelViewTransform
     * @public
     * @returns {Shape}
     */
    getOnAxisLinesShape( vectorComponentModel, modelViewTransform ) {

      const tipLocation = modelViewTransform.modelToViewDelta(
        vectorComponentModel.tip.minus( vectorComponentModel.tail ) );

      const parentTailLocation = modelViewTransform.modelToViewDelta(
        vectorComponentModel.parentVector.tail.minus( vectorComponentModel.tail ) );

      const parentTipLocation = modelViewTransform.modelToViewDelta(
        vectorComponentModel.parentVector.tip.minus( vectorComponentModel.tail ) );

      // Create new shape for the dashed lines that extend to the axis
      const onAxisLines = new Shape();

      // Draw the dashed lines
      onAxisLines.moveToPoint( Vector2.ZERO ).lineToPoint( parentTailLocation );
      onAxisLines.moveToPoint( tipLocation ).lineToPoint( parentTipLocation );

      return onAxisLines;
    }

    /**
     * @override
     * Updates the label positioning
     * @param {vectorComponentModel} vectorComponentModel
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Boolean} valuesVisible
     * @private
     */
    updateLabelPositioning( vectorComponentModel, modelViewTransform, valuesVisible ) {

      // Only show the visibility if the values are visible
      if ( valuesVisible ) {
        this.labelNode.visible = true;
      }
      else {
        this.labelNode.visible = false;
        return;
      }

      // Flags to indicate the angle translation. Declared below on and depends on the vector positioning.
      const offset = new Vector2( 0, 0 );

      //----------------------------------------------------------------------------------------
      // Convenience variables
      const componentMidPoint = vectorComponentModel.vectorComponents.timesScalar( 0.5 ).plus( vectorComponentModel.tail );
      const parentMidPoint = vectorComponentModel.parentVector.vectorComponents
        .timesScalar( 0.5 )
        .plus( vectorComponentModel.parentVector.tail );

      //----------------------------------------------------------------------------------------
      if ( vectorComponentModel.componentType === VectorComponentModel.COMPONENT_TYPES.X_COMPONENT ) { // If it's a x component
        
        // Add extra offset to consider the size of the label. The offset is the margin between the arrow and the label
        const labelSize = modelViewTransform.viewToModelDeltaY( -this.labelNode.height / 2 );

        if ( vectorComponentModel.xComponent === 0 ) {
          return;
        }
        // If the component is below the parent, position the label below, otherwise position it above
        if ( componentMidPoint.y <= parentMidPoint.y ) {
          offset.setXY( 0, -COMPONENT_LABEL_OFFSET - labelSize );
        }
        else {
          offset.setXY( 0, COMPONENT_LABEL_OFFSET + labelSize );
        }
      }
      else if ( vectorComponentModel.componentType === VectorComponentModel.COMPONENT_TYPES.Y_COMPONENT ) { // It it's a y component
        
        const labelSize = modelViewTransform.viewToModelDeltaX( this.labelNode.width / 2 );

        if ( vectorComponentModel.yComponent === 0 ) {
          return;
        }

        // If the component is to the left of the parent, position the label to the left, otherwise to the right
        if ( componentMidPoint.x < parentMidPoint.x ) {
          offset.setXY( -COMPONENT_LABEL_OFFSET - labelSize, 0 );
        }

        else {
          offset.setXY( COMPONENT_LABEL_OFFSET + labelSize, 0 );
        }
      }

      // Get the middle of the vector with respect to the component tail as the origin
      const deltaMidPoint = vectorComponentModel.vectorComponents.timesScalar( 0.5 );

      this.labelNode.center = modelViewTransform.modelToViewDelta( deltaMidPoint.plus( offset ) );
    }
  }

  return vectorAddition.register( 'VectorComponentNode', VectorComponentNode );
} );