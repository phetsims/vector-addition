// Copyright 2019, University of Colorado Boulder

/**
 * Base class for vector views for all types of vectors (sum, component, etc.).
 * Primarily responsibilities are:
 *  - Create an Arrow Node that mirrors a vector models tail/tip position
 *  - Create Other Nodes that ALL vectors in the sim have (ie. labels etc.)
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BaseVectorModel = require( 'VECTOR_ADDITION/common/model/BaseVectorModel' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Multilink = require( 'AXON/Multilink' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const VectorLabelNode = require( 'VECTOR_ADDITION/common/view/VectorLabelNode' );

  class BaseVectorNode extends Node {
    /**
     * @constructor
     * @param {BaseVectorModel} baseVectorModel - the vector model
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property for the coordinate transform
     * between model coordinates and view coordinates
     * @param {Object} arrowOptions - options passed to the arrow node for specific / specialized styling
     */
    constructor( baseVectorModel, modelViewTransformProperty, valuesVisibleProperty, arrowOptions ) {

      // Type check arguments
      assert && assert( baseVectorModel instanceof BaseVectorModel, `invalid baseVectorModel: ${baseVectorModel}` );
      assert && assert( modelViewTransformProperty instanceof Property
      && modelViewTransformProperty.value instanceof ModelViewTransform2,
        `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
      assert && assert( typeof arrowOptions === 'object', `invalid arrowOptions: ${arrowOptions}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );

      //----------------------------------------------------------------------------------------

      super();

      // Define a vector node in which the tail location (view coordinates) 
      // is (0, 0). Get the tip location in view coordinates
      const tipDeltaLocation = modelViewTransformProperty.value.modelToViewDelta( baseVectorModel.components );

      // @public (read-only) {Node} arrowNode - Create an arrow node that represents an actual vector.
      this.arrowNode = new ArrowNode( 0, 0, tipDeltaLocation.x, tipDeltaLocation.y, arrowOptions );

      // @public (read-only) {Node} labelNode - Create a label for the vector that is displayed 'next' to the arrow. 
      // The location of this depends on the angle of the vector.
      this.labelNode = new VectorLabelNode( baseVectorModel, valuesVisibleProperty );

      this.setChildren( [ this.arrowNode, this.labelNode ] );

      //----------------------------------------------------------------------------------------
      // update the tail/tip location when the vector's tail/tip position changes

      // @public {Multilink} - observe changes to the tail/tip
      this.vectorObserver = new Multilink(
        [ baseVectorModel.tailPositionProperty, baseVectorModel.tipPositionProperty ],
        () => { this.updateVector( baseVectorModel, modelViewTransformProperty.value ); } );

    }

    /**
     * Update the tail and tip position of the view
     * @param {BaseVectorModel} baseVectorModel
     * @param {ModelViewTransform2} modelViewTransform
     * @private
     */
    updateVector( baseVectorModel, modelViewTransform ) {

      // Since the tail is defined at (0, 0) for the vector, we must translate.
      this.translation = modelViewTransform.modelToViewPosition( baseVectorModel.tail );

      // Get the tip location in view coordinates
      const tipDeltaLocation = modelViewTransform.modelToViewDelta( baseVectorModel.components );
      this.arrowNode.setTip( tipDeltaLocation.x, tipDeltaLocation.y );

      // make the arrow easier to grab
      this.arrowNode.mouseArea = this.arrowNode.shape.getOffsetShape( 3 );
    }

    /**
     * Dispose the vector
     * @public
     * @override
     */
    dispose() {
      this.arrowNode.dispose();
      this.labelNode.dispose();
      this.vectorObserver.dispose();
      super.dispose();
    }
  }

  return vectorAddition.register( 'BaseVectorNode', BaseVectorNode );
} );