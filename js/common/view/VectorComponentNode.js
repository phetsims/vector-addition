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
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorComponent = require( 'VECTOR_ADDITION/common/model/VectorComponent' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );


  // constants
  const VECTOR_GROUP_1_COMPONENT = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors.VECTOR_GROUP_1_COLORS.component,
    headWidth: 10.5,
    headHeight: 6,
    tailWidth: 4,
    lineWidth: 0
  } );
  const VECTOR_GROUP_2_COMPONENT = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors.VECTOR_GROUP_2_COLORS.component,
    headWidth: 10.5,
    headHeight: 6,
    tailWidth: 4,
    lineWidth: 0
  } );
  const ON_AXIS_LINES_LINE_DASH = [ 3, 10 ];

  class VectorComponentNode extends BaseVectorNode {

    /**
     * @constructor
     * @param {VectorComponent} vectorComponent - the vector model for the component
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property for the coordinate transform
     * between model coordinates and view coordinates
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property for the different component styles
     */
    constructor( vectorComponent, modelViewTransformProperty, componentStyleProperty, valuesVisibleProperty ) {

      // Type check arguments
      assert && assert( vectorComponent instanceof VectorComponent, `invalid vectorComponent: ${vectorComponent}` );

      // modelViewTransformProperty checked in BaseVectorNode
      assert && assert( componentStyleProperty instanceof EnumerationProperty,
        `invalid componentStyleProperty: ${componentStyleProperty}` );

      //----------------------------------------------------------------------------------------
      // Get the arrow options for the specific vector type

      let arrowOptions;
      switch( vectorComponent.vectorType ) {
        case VectorTypes.ONE: {
          arrowOptions = VECTOR_GROUP_1_COMPONENT;
          break;
        }
        case VectorTypes.TWO: {
          arrowOptions = VECTOR_GROUP_2_COMPONENT;
          break;
        }
        default: {
          throw new Error( `Vector Type : ${vectorComponent.vectorType} not handled` );
        }
      }
      super( vectorComponent, modelViewTransformProperty, valuesVisibleProperty, arrowOptions );

      //----------------------------------------------------------------------------------------
      // Create a path  that represents the dashed lines corresponding to the on_axis style.
      // The shape of the path will be updated later
      this.onAxisLinesPath = new Path( new Shape(), {
        stroke: 'black',
        lineDash: ON_AXIS_LINES_LINE_DASH
      } );

      this.addChild( this.onAxisLinesPath );

      //----------------------------------------------------------------------------------------

      this.vectorObserver.dispose();

      // @public {Multilink} - observe changes to the tail/tip
      this.vectorObserver = new Multilink(
        [ vectorComponent.tailPositionProperty,
          vectorComponent.tipPositionProperty,
          componentStyleProperty ],
        () => {
          this.updateVector( vectorComponent, modelViewTransformProperty.value, componentStyleProperty.value );
        } );

    }

    /**
     * Update the tail and tip position of the component. Since the component is a child of the vectorNode, we
     * must adjust the update (since (0, 0) is defined as the tail on vectorNode)
     * @param {VectorComponent} vectorComponent
     * @param {ModelViewTransform2} modelViewTransform
     * @param {ComponentStyles} componentStyle
     * @public
     * @override
     */
    updateVector( vectorComponent, modelViewTransform, componentStyle ) {
      const tailLocation = modelViewTransform.modelToViewDelta( vectorComponent.tail.minus( vectorComponent.parentVector.tail ) );
      const tipLocation = modelViewTransform.modelToViewDelta( vectorComponent.tip.minus( vectorComponent.parentVector.tail ) );

      // update the  arrows
      this.arrowNode.setTailAndTip( tailLocation.x, tailLocation.y, tipLocation.x, tipLocation.y );

      //----------------------------------------------------------------------------------------
      // Toggle visibility based on component Style

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
          // make the on axis dashed lines visible
          this.onAxisLinesPath.visible = true;

          this.onAxisLinesPath.setShape( this.getOnAxisLinesShape( vectorComponent, modelViewTransform ) );
          break;
        }
        default: {
          this.onAxisLinesPath.visible = false;
          this.visible = true;
        }
      }
    }

    /**
     * Create the shape from of lines that go from the components tail/tip to the parents tail/tip
     * @param {VectorComponent} vectorComponent
     * @param {ModelViewTransform2} modelViewTransform
     * @public
     * @returns {Shape}
     */
    getOnAxisLinesShape( vectorComponent, modelViewTransform ) {

      const tailLocation = modelViewTransform.modelToViewDelta( vectorComponent.tail.minus( vectorComponent.parentVector.tail ) );
      const tipLocation = modelViewTransform.modelToViewDelta( vectorComponent.tip.minus( vectorComponent.parentVector.tail ) );

      const parentTailLocation = modelViewTransform.modelToViewDelta( Vector2.ZERO );
      const parentTipLocation = modelViewTransform.modelToViewDelta( vectorComponent.parentVector.tip.minus( vectorComponent.parentVector.tail ) );

      // create new shape for the dashed lines that extend to the axis
      const onAxisLines = new Shape();

      // create the dashed lines shape
      onAxisLines.moveToPoint( tailLocation ).lineToPoint( parentTailLocation );
      onAxisLines.moveToPoint( tipLocation ).lineToPoint( parentTipLocation );

      return onAxisLines;

    }
  }

  return vectorAddition.register( 'VectorComponentNode', VectorComponentNode );
} );