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
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Multilink = require( 'AXON/Multilink' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorComponent = require( 'VECTOR_ADDITION/common/model/VectorComponent' );

  // constants
        
  // Offset of the label
  const COMPONENT_LABEL_OFFSET = VectorAdditionConstants.VECTOR_LABEL_OFFSET;
  
  class VectorComponentNode extends BaseVectorNode {
    /**
     * @constructor
     * @param {VectorComponent} vectorComponent - the vector model for the component
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {Object} [options]
     */
    constructor( vectorComponent, modelViewTransformProperty, componentStyleProperty, valuesVisibleProperty, options ) {

      // Type check unique arguments
      assert && assert( vectorComponent instanceof VectorComponent, `invalid vectorComponent: ${vectorComponent}` );
      assert && assert( modelViewTransformProperty instanceof Property
      && modelViewTransformProperty.value instanceof ModelViewTransform2,
      `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
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
        lineDash:[ 3, 10 ]
      }, options.onAxisLinesOptions );

      options.arrowOptions = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
        fill: VectorAdditionColors[ vectorComponent.vectorGroup ].fill,
        headWidth: 10.5,
        headHeight: 6,
        tailWidth: 4
      }, options.arrowOptions );

      super( vectorComponent, modelViewTransformProperty, valuesVisibleProperty, options.arrowOptions );

      //----------------------------------------------------------------------------------------
      // Create a path  that represents the dashed lines corresponding to the on_axis style.
      // The shape of the path will be updated later

      // @private
      this.onAxisLinesPath = new Path( new Shape(), options.onAxisLinesOptions );

      this.addChild( this.onAxisLinesPath );

      // Dispose of the super class observer, as it is necessary to add the component style property
      this.vectorObserver.dispose();

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
          
          // Update the appearance of the vector only when it is visible
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
      if ( componentStyle === ComponentStyles.INVISIBLE ) {
        this.visible = false;
        this.onAxisLinesPath.visible = false;
      }
      else if ( componentStyle === ComponentStyles.ON_AXIS ) {
        this.visible = true;
        this.onAxisLinesPath.visible = true;

        this.onAxisLinesPath.setShape( this.getOnAxisLinesShape( vectorComponent, modelViewTransform ) );
      }
      else {
        this.onAxisLinesPath.visible = false;
        this.visible = true;       
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
     * @param {VectorComponent} vectorComponent
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Boolean} valuesVisible
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

      // Flags to indicate the angle translation. Declared below on and depends on the vector positioning.
      const offset = new Vector2( 0, 0 );

      //----------------------------------------------------------------------------------------
      // Convenience variables
      const componentMidPoint = vectorComponent.attributesVector.timesScalar( 0.5 ).plus( vectorComponent.tail );
      const parentMidPoint = vectorComponent.parentVector.attributesVector
                              .timesScalar( 0.5 )
                              .plus( vectorComponent.parentVector.tail );


      if ( vectorComponent.componentType === VectorComponent.Types.X_COMPONENT ) { // if its an x component
      
        // if the component is below the parent, position the label below, otherwise position it above
        if ( componentMidPoint.y <= parentMidPoint.y ) {
          offset.setXY( 0, -COMPONENT_LABEL_OFFSET );
        }
        else { 
          offset.setXY( 0, COMPONENT_LABEL_OFFSET );
        }
      }       
      else if ( vectorComponent.componentType === VectorComponent.Types.Y_COMPONENT ) { // if its an y component

        // if the component is to the left of the parent, position the label to the left, otherwise to the right
        if ( componentMidPoint.x <= parentMidPoint.x ) {
          offset.setXY( -COMPONENT_LABEL_OFFSET, 0 );
        }

        else {
          offset.setXY( COMPONENT_LABEL_OFFSET, 0 );
        }
      }

      // Get the middle of the vector with respect to the component tail as the origin
      const deltaMidPoint = vectorComponent.attributesVector.timesScalar( 0.5 );

      this.labelNode.center = modelViewTransform.modelToViewDelta( deltaMidPoint.plus( offset ) );
    }
  }

  return vectorAddition.register( 'VectorComponentNode', VectorComponentNode );
} );