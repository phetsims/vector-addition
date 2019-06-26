// Copyright 2019, University of Colorado Boulder

/**
 * View for a vector component.
 *
 * Listens to the a vectorComponentModel's tail/attributes properties to update the component location/size
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BaseVectorNode = require( 'VECTOR_ADDITION/common/view/BaseVectorNode' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Multilink = require( 'AXON/Multilink' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorComponent = require( 'VECTOR_ADDITION/common/model/VectorComponent' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

  // constants

  // Different appearances for vector components based on vectorGroup
  const VECTOR_GROUP_1_COMPONENT_OPTIONS = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors.VECTOR_GROUP_1_COLORS.component,
    headWidth: 10.5,
    headHeight: 6,
    tailWidth: 4,
    lineWidth: 0
  } );
  const VECTOR_GROUP_2_COMPONENT_OPTIONS = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors.VECTOR_GROUP_2_COLORS.component,
    headWidth: 10.5,
    headHeight: 6,
    tailWidth: 4,
    lineWidth: 0
  } );

  // Offset of the label
  // const COMPONENT_LABEL_OFFSET = VectorAdditionConstants.VECTOR_LABEL_OFFSET;
  
  // Passed to the shape for the on axis dashed lines
  const ON_AXIS_OPTIONS = {
    stroke: VectorAdditionColors.BLACK,
    lineDash:[ 3, 10 ]
  };

  class VectorComponentNode extends BaseVectorNode {

    /**
     * @constructor
     * @param {VectorComponent} vectorComponent - the vector model for the component
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property for the coordinate transform
     * between model coordinates and view coordinates
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property for the different component
     * styles
     * @param {BooleanProperty} valuesVisibleProperty
     */
    constructor( vectorComponent, modelViewTransformProperty, componentStyleProperty, valuesVisibleProperty ) {

      // Type check unique arguments
      assert && assert( vectorComponent instanceof VectorComponent, `invalid vectorComponent: ${vectorComponent}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );

      //----------------------------------------------------------------------------------------

      super(
        vectorComponent,
        modelViewTransformProperty,
        valuesVisibleProperty,
        vectorComponent.vectorGroup === VectorGroups.ONE ?
        VECTOR_GROUP_1_COMPONENT_OPTIONS :
        VECTOR_GROUP_2_COMPONENT_OPTIONS );

      //----------------------------------------------------------------------------------------
      // Create a path  that represents the dashed lines corresponding to the on_axis style.
      // The shape of the path will be updated later

      // @private
      this.onAxisLinesPath = new Path( new Shape(), ON_AXIS_OPTIONS );

      this.addChild( this.onAxisLinesPath );

      //----------------------------------------------------------------------------------------
      // Update the tail/tip location when the vector's tail/tip position changes and when the componentStyleProperty
      // changes

      // @private {Multilink}
      this.vectorObserver = new Multilink(
        [ valuesVisibleProperty,
          vectorComponent.tailPositionProperty,
          vectorComponent.tipPositionProperty,
          componentStyleProperty ],
        ( valuesVisible ) => {
          
          // Update the appearance of the vector
          this.updateVector( vectorComponent, modelViewTransformProperty.value, componentStyleProperty.value ); 
          
          // Update the appearance of the label
          this.updateLabelPositioning( vectorComponent, modelViewTransformProperty.value, valuesVisible );
        } );

    }
    /**
     * Updates the tail and tip position of the view. Called when the model changes tail/tip.
     * Does the same as super class but draws lines and toggles visibility based on componentStyleProperty
     * @param {VectorComponent} vectorComponent
     * @param {ModelViewTransform2} modelViewTransform
     * @param {ComponentStyles} componentStyle
     * @private
     */
    updateVector( vectorComponent, modelViewTransform, componentStyle ) {

      // Since this isn't a lazy link, and onAxisLinesPath doesn't exist in super class, we must handle the first call
      if ( !this.onAxisLinesPath ) {
        return;
      }

      switch( componentStyle ) {
        case ComponentStyles.INVISIBLE: {
          this.visible = false;
          this.onAxisLinesPath.visible = false;
          break;
        }
        case ComponentStyles.ON_AXIS: {
          this.visible = true;
          this.onAxisLinesPath.visible = true;

          this.onAxisLinesPath.setShape( this.getOnAxisLinesShape( vectorComponent, modelViewTransform ) );
          break;
        }
        default: {
          this.onAxisLinesPath.visible = false;
          this.visible = true;
        }
      }
      super.updateVector( vectorComponent, modelViewTransform );
    }

    /**
     * Creates the shape of lines that go from the components tail/tip to the parents tail/tip
     * @param {VectorComponent} vectorComponent
     * @param {ModelViewTransform2} modelViewTransform
     * @public
     * @returns {Shape}
     */
    getOnAxisLinesShape( vectorComponent, modelViewTransform ) {

      const tipLocation = modelViewTransform.modelToViewDelta(
        vectorComponent.tip.minus( vectorComponent.tail ) );

      const parentTailLocation = modelViewTransform.modelToViewDelta(
        vectorComponent.parentVector.tail.minus( vectorComponent.tail ) );
      
      const parentTipLocation = modelViewTransform.modelToViewDelta(
        vectorComponent.parentVector.tip.minus( vectorComponent.tail ) );

      // create new shape for the dashed lines that extend to the axis
      const onAxisLines = new Shape();

      // create the dashed lines shape
      onAxisLines.moveToPoint( Vector2.ZERO ).lineToPoint( parentTailLocation );
      onAxisLines.moveToPoint( tipLocation ).lineToPoint( parentTipLocation );

      return onAxisLines;
    }

    /**
     * Update the label positioning
     * @param {VectorComponent} vectorComponent
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Boolean} valuesVisible
     * @override
     * @private
     */
    updateLabelPositioning( vectorComponent, modelViewTransform, valuesVisible ) {

      if ( valuesVisible ) {
        this.labelNode.visible = true;
      }
      else {
        this.labelNode.visible = false;
        return;
      }
      const tailDeltaPosition = vectorComponent.tail.minus( vectorComponent.parentVector.tail );
      const tipDeltaPosition = vectorComponent.tip.minus( vectorComponent.parentVector.tip );

      const midPoint = tipDeltaPosition.minus( tailDeltaPosition ).timesScalar( 0.5 );
      // const offset = new Vector2( 0, 0 );
      // console.log( midPoint, vectorComponent.componentType )
      // if ( vectorComponent.componentType === VectorComponent.Types.X_COMPONENT ) {
      //   if ( vectorComponent.parentVector.yComponent > 0 ) { // position above
      //     offset.setXY( 0, COMPONENT_LABEL_OFFSET );
      //   }
      //   if ( vectorComponent.parentVector.yComponent < 0 ) { // position below
      //     offset.setXY( 0, -COMPONENT_LABEL_OFFSET );
      //   }
      // }
      // else if ( vectorComponent.componentType === VectorComponent.Types.Y_COMPONENT ) {
      //   if ( vectorComponent.parentVector.xComponent > 0 ) { // position to the left
      //     offset.setXY( -COMPONENT_LABEL_OFFSET, 0 );
      //   }
      //   if ( vectorComponent.parentVector.xComponent < 0 ) { // position to the left
      //     offset.setXY( +COMPONENT_LABEL_OFFSET, 0 );
      //   }
      // }

      this.labelNode.center = modelViewTransform.modelToViewPosition( midPoint );

    }
  }

  return vectorAddition.register( 'VectorComponentNode', VectorComponentNode );
} );