// Copyright 2019, University of Colorado Boulder

/**
 * View for the component vectors of a vector node.
 * Constructed based on many individually passed parameters about the vector node.
 * Listens to the componentStyleProperty to determine which style of components to display.
 * Listens to a vector's vectorProperty to determine resize.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

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
     * @param {componentStyleProperty} - the enumeration property on which style of components to display
     * @param {ModelViewTransform2} modelViewTransform
     */
    constructor( vector, componentStyleProperty, modelViewTransform ) {

      super();

      // Create the 2 component nodes. These will be translated depending on the different component style
      const XComponentArrow = new ArrowNode( 0, 0, 0, 0, ARROW_OPTIONS );
      const YComponentArrow = new ArrowNode( 0, 0, 0, 0, ARROW_OPTIONS );

      this.setChildren( [ XComponentArrow, YComponentArrow ] );

      // function to make components visible
      const makeComponentsVisible = () => {
        XComponentArrow.visible = true;
        YComponentArrow.visible = true;
      };

      // create an object that matches enum value (key) to a function that changes the components to match 
      // the keys style
      const changeComponentsByComponentStyle = {
        'INVISIBLE': () => {
          XComponentArrow.visible = false;
          YComponentArrow.visible = false;
        },
        'TRIANGLE': ( newVector ) => {

          // make the components visible
          makeComponentsVisible();

          // calculate the tip position of the vector based on its current value
          const tipPosition = modelViewTransform.modelToViewDelta( vector.vectorProperty.value );

          XComponentArrow.setTailAndTip( 0, 0, tipPosition.x, 0 );
          YComponentArrow.setTailAndTip( tipPosition.x, 0, tipPosition.x, tipPosition.y );
        },
        'PARALLELOGRAM': ( newVector ) => {

          // make the components visible
          makeComponentsVisible();

          // calculate the tip position of the vector based on its current value
          const tipPosition = modelViewTransform.modelToViewDelta( vector.vectorProperty.value );
          XComponentArrow.setTailAndTip( 0, 0, tipPosition.x, 0 );
          YComponentArrow.setTailAndTip( 0, 0, 0, tipPosition.y );
        },
        'ON_AXIS': ( newVector ) => {
          // make the components visible
          makeComponentsVisible();

          // calculate the tip position of the vector based on its current value
          const tipPosition = modelViewTransform.modelToViewDelta( vector.vectorProperty.value );

          // calculate the tail position to place the components on the axis
          const tailPosition = modelViewTransform.modelToViewDelta( vector.tailPositionProperty.value );

          XComponentArrow.setTailAndTip( 0, -tailPosition.y, tipPosition.x, -tailPosition.y );
          YComponentArrow.setTailAndTip( -tailPosition.x, 0, -tailPosition.x, tipPosition.y );
        }
      };

      // create a link to the componentStyle enumeration property to toggle the different component styles
      componentStyleProperty.link( ( newValue ) => {

        // unlink the previous style
        vector.vectorProperty.unlinkAll();
        vector.tailPositionProperty.unlinkAll();

        // link the new style
        vector.vectorProperty.link( changeComponentsByComponentStyle[ newValue.name ] );

        if ( newValue.name === 'ON_AXIS' ) {
          vector.tailPositionProperty.link( changeComponentsByComponentStyle[ newValue.name ] );
        }
      } );
    }
  }

  return vectorAddition.register( 'VectorComponentsNode', VectorComponentsNode );
} );