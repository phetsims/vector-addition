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
  const Property = require( 'AXON/Property' );

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
      // create the 2 component nodes. These will be translated depending on the component style value
      const XComponentArrow = new ArrowNode( 0, 0, 0, 0, ARROW_OPTIONS );
      const YComponentArrow = new ArrowNode( 0, 0, 0, 0, ARROW_OPTIONS );

      // add the components to the scene graph
      this.setChildren( [ XComponentArrow, YComponentArrow ] );

      // create a function that updates the style of the components and their positions
      const updateComponents = ( componentStyle, modelVector, modelTailPosition ) => {

        // calculate the vector (in view coordinates) based on its current value
        const viewVector = modelViewTransform.modelToViewDelta( modelVector );

        // calculate the tail position of the vector
        const viewTailPosition = modelViewTransform.modelToViewDelta( modelTailPosition );

        switch( componentStyle ) {
          case ComponentStyles.INVISIBLE: {
            this.visible = false;
            break;
          }
          case ComponentStyles.TRIANGLE: {
            // make the components visible
            this.visible = true;

            XComponentArrow.setTailAndTip( 0, 0, viewVector.x, 0 );
            YComponentArrow.setTailAndTip( viewVector.x, 0, viewVector.x, viewVector.y );
            break;
          }
          case ComponentStyles.PARALLELOGRAM: {
            // make the components visible
            this.visible = true;

            XComponentArrow.setTailAndTip( 0, 0, viewVector.x, 0 );
            YComponentArrow.setTailAndTip( 0, 0, 0, viewVector.y );
            break;
          }
          case  ComponentStyles.ON_AXIS: {
            // make the components visible
            this.visible = true;

            XComponentArrow.setTailAndTip( 0, -viewTailPosition.y, viewVector.x, -viewTailPosition.y );
            YComponentArrow.setTailAndTip( -viewTailPosition.x, 0, -viewTailPosition.x, viewVector.y );
            break;
          }
          default: {
            throw new Error( 'invalid componentStyle: ' + componentStyle );
          }
        }
      };

      // @private
      this.updateLayoutMultilink = Property.multilink( [
          componentStyleProperty,
          vector.vectorProperty,
          vector.tailPositionProperty ],
        ( componentStyle, vector, tailPosition ) => updateComponents( componentStyle, vector, tailPosition )
      );
    }

    /**
     * @public
     */
    dispose() {
      this.updateLayoutMultilink.dispose();
    }
  }

  return vectorAddition.register( 'VectorComponentsNode', VectorComponentsNode );
} );