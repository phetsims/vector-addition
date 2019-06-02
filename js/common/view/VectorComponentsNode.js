// Copyright 2019, University of Colorado Boulder

/**
 * View for the component vectors of a vector node.
 * Constructed based on many individually passed parameters about the vector node.
 * Listens to the componentStyleProperty to determine which style of components to display.
 * Listens to a model vector's vectorProperty to rescale and reposition the components.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );

  // constants
  const ARROW_OPTIONS = {
    stroke: 'rgb( 0, 191, 255 )',
    fill: 'rgb( 0, 191, 255 )',
    headWidth: 8,
    headHeight: 4,
    tailWidth: 4
  };

  class VectorComponentsNode extends Node {

    /**
     * @param {Vector} vector - the vector model
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property related to the style of components to display
     * @param {ModelViewTransform2} modelViewTransform
     */
    constructor( vector, componentStyleProperty, modelViewTransform ) {

      super();

      // the origin of this node (0,0) is the tail of the vector.
      // Create the 2 component nodes. These will be translated depending on the different component style
      const XComponentArrow = new ArrowNode( 0, 0, 0, 0, ARROW_OPTIONS );
      const YComponentArrow = new ArrowNode( 0, 0, 0, 0, ARROW_OPTIONS );

      this.setChildren( [ XComponentArrow, YComponentArrow ] );

      // create an object that matches enum value (key) to a function that changes the components to match 
      // the keys style
      const changeComponentsByComponentStyle = {
        'INVISIBLE': () => {
          this.visible = false;
        },
        'TRIANGLE': ( newVector ) => {

          // make the components visible
          this.visible = true;

          // calculate the tip position of the vector based on its current value
          const tipPosition = modelViewTransform.modelToViewDelta( vector.vectorProperty.value );

          XComponentArrow.setTailAndTip( 0, 0, tipPosition.x, 0 );
          YComponentArrow.setTailAndTip( tipPosition.x, 0, tipPosition.x, tipPosition.y );
        },
        'PARALLELOGRAM': ( newVector ) => {

          // make the components visible
          this.visible = true;

          // calculate the tip position of the vector based on its current value
          const tipPosition = modelViewTransform.modelToViewDelta( vector.vectorProperty.value );
          XComponentArrow.setTailAndTip( 0, 0, tipPosition.x, 0 );
          YComponentArrow.setTailAndTip( 0, 0, 0, tipPosition.y );
        },
        'ON_AXIS': ( newVector ) => {
          // make the components visible
          this.visible = true;

          // calculate the tip position of the vector based on its current value
          const tipPosition = modelViewTransform.modelToViewDelta( vector.vectorProperty.value );

          // calculate the tail position to place the components on the axis
          const tailPosition = modelViewTransform.modelToViewDelta( vector.tailPositionProperty.value );

          XComponentArrow.setTailAndTip( 0, -tailPosition.y, tipPosition.x, -tailPosition.y );
          YComponentArrow.setTailAndTip( -tailPosition.x, 0, -tailPosition.x, tipPosition.y );
        }
      };


      // create a link to the componentStyle enumeration property to toggle the different component styles
      componentStyleProperty.link( ( newValue, oldValue ) => {

        // first, if we have changed, remove the old component resize function
        if ( oldValue ) {
          vector.vectorProperty.unlink( changeComponentsByComponentStyle[ oldValue.name ] );

          // on axis also was linked to the tail position property, so we have to remove it as well
          if ( oldValue.name === ComponentStyles.ON_AXIS ) {
            vector.tailPositionProperty.unlink( changeComponentsByComponentStyle[ oldValue.name ] );
          }
        }

        // link the new component resize function based on the new value's name
        vector.vectorProperty.link( changeComponentsByComponentStyle[ newValue.name ] );

        // on axis style needs to be linked to the tail position
        if ( newValue.name === ComponentStyles.ON_AXIS ) {
          vector.tailPositionProperty.link( changeComponentsByComponentStyle[ newValue.name ] );
        }
      } );


    }
  }

  return vectorAddition.register( 'VectorComponentsNode', VectorComponentsNode );
} );